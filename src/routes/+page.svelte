<script lang="ts">
	import {
		drawLine,
		getPointerPos,
		isPointerInRect,
		type Rect2,
		Vec2,
		getDistance2D,
		getRadialDistance,
		normalizeVector,
	} from "$lib/utils";
	import { onMount } from "svelte";

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;

	let visibleIcons: Icon[] = [];

	let icons: Icon[] = [];
	let draggedIcon: Icon | null;

	interface Icon {
		pos: Vec2;
		size: Vec2;
		textureSrc: string;
		scale: number;
		image: HTMLImageElement;
		draw: () => any;
	}

	function createIcon(pos: Vec2, textureSrc: string, scale = 1) {
		let obj: Icon = {
			pos,
			size: Vec2(0, 0),
			textureSrc,
			scale,
			image: new Image() as HTMLImageElement,
			draw() {
				ctx.fillStyle = "#880088";
				ctx.drawImage(
					this.image,
					this.pos.x,
					this.pos.y,
					this.size.x,
					this.size.y
				);

				visibleIcons.forEach((otherIcon) => {
					let distance = getDistance2D(this.pos, otherIcon.pos);

					let direction = normalizeVector(distance);

					let radialDistance = getRadialDistance(this.pos, otherIcon.pos);

					let attractiveForce2D = 80 / radialDistance;
					let repulsiveForce2D = 10000 / radialDistance ** 2;
					let force = Vec2(0, 0);

					if (Math.abs(distance.x) >= 1) {
						force.x = -direction.x * attractiveForce2D;
						force.x += direction.x * repulsiveForce2D;
					}

					if (Math.abs(distance.y) >= 1) {
						force.y = -direction.y * attractiveForce2D;
						force.y += direction.y * repulsiveForce2D;
					}

					this.pos.x += force.x;
					this.pos.y += force.y;
				});
			},
		};

		obj.image.src = textureSrc;
		obj.image.onload = () => {
			obj.size.x = obj.image.width * obj.scale;
			obj.size.y = obj.image.height * obj.scale;
		};
		icons.push(obj);

		return obj;
	}

	function connectIcons(a: Rect2, b: Rect2) {
		drawLine(ctx, [
			Vec2(a.pos.x + a.size.x / 2, a.pos.y + a.size.x / 2),
			Vec2(b.pos.x + b.size.y / 2, b.pos.y + b.size.y / 2),
		]);
	}

	function mainloop() {
		// Clear screen
		ctx.fillStyle = "#111133";
		ctx.fillRect(0, 0, 1000, 1000);

		connectIcons(
			stackChoices.frontend[stack.frontend],
			stackChoices.server[stack.server]
		);

		if (stack.db == "firebase") {
			connectIcons(
				stackChoices.frontend[stack.frontend],
				stackChoices.db[stack.db]
			);
		} else {
			connectIcons(
				stackChoices.server[stack.server],
				stackChoices.orm[stack.orm]
			);

			connectIcons(stackChoices.orm[stack.orm], stackChoices.db[stack.db]);
		}

		for (const obj of visibleIcons) obj.draw();

		return requestAnimationFrame(mainloop);
	}

	function onPointerDown(e: MouseEvent | Touch) {
		for (const icon of icons) {
			if (isPointerInRect(icon, getPointerPos(canvas, e))) {
				draggedIcon = icon;
			}
		}
	}
	function onPointerMove(e: MouseEvent | Touch) {
		if (draggedIcon) {
			const { x, y } = getPointerPos(canvas, e);
			draggedIcon.pos.x = x - draggedIcon.size.x / 2;
			draggedIcon.pos.y = y - draggedIcon.size.y / 2;
		}
	}
	function onPointerUp() {
		draggedIcon = null;
	}

	onMount(() => {
		ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

		let frame = mainloop();
		return () => cancelAnimationFrame(frame);
	});

	let stackChoices = {
		language: {
			javascript: createIcon(Vec2(1000, 1000), "javascript.svg", 0.5),
			typescript: createIcon(Vec2(1000, 1000), "typescript.svg", 0.15),
		},
		frontend: {
			svelte: createIcon(Vec2(256, 256), "svelte.svg", 0.5),
			react: createIcon(Vec2(256, 256), "react.svg", 0.5),
		},
		server: {
			nodejs: createIcon(Vec2(128, 128), "nodejs.svg", 0.2),
		},
		orm: {
			prisma: createIcon(Vec2(256, 128), "prisma.svg", 0.5),
		},
		db: {
			postgresql: createIcon(Vec2(256 + 128, 256), "postgresql.svg", 0.125),
			firebase: createIcon(Vec2(256 + 128, 256), "firebase.svg", 0.5),
		},
	};

	let stack: {
		[choice in keyof typeof stackChoices]: keyof typeof stackChoices[choice];
	} = {
		language: "typescript",
		frontend: "svelte",
		server: "nodejs",
		orm: "prisma",
		db: "postgresql",
	};

	$: {
		visibleIcons = [
			stackChoices.frontend[stack.frontend],
			stackChoices.server[stack.server],
			// orm,
			stackChoices.db[stack.db],
		];

		if (needsORM && stack.orm)
			visibleIcons = [...visibleIcons, stackChoices.orm[stack.orm]];
	}

	$: needsORM = stack.db != "firebase";
</script>

<form>
	<div>
		<h1>Front end</h1>
		<label>
			<input type="radio" bind:group={stack.frontend} value={"svelte"} />
			Svelte
		</label>
		<label>
			<input type="radio" bind:group={stack.frontend} value={"react"} />
			React
		</label>
	</div>

	<div>
		<h1>Server</h1>
		<label>
			<input type="radio" bind:group={stack.server} value={"nodejs"} />
			NodeJS
		</label>
	</div>

	<div>
		<h1>ORM</h1>
		<label>
			<input
				type="radio"
				bind:group={stack.orm}
				value={"prisma"}
				disabled={!needsORM}
			/>
			Prisma
		</label>
	</div>

	<div>
		<h1>Database</h1>
		<label>
			<input type="radio" bind:group={stack.db} value={"postgresql"} />
			Postgresql
		</label>
		<label>
			<input type="radio" bind:group={stack.db} value={"firebase"} />
			Firebase
		</label>
	</div>
</form>

<canvas
	on:touchstart={(e) => onPointerDown(e.touches[0])}
	on:touchmove={(e) => {
		e.preventDefault();
		onPointerMove(e.touches[0]);
	}}
	on:touchend={() => onPointerUp()}
	on:mousedown={onPointerDown}
	on:mousemove={onPointerMove}
	on:mouseup={onPointerUp}
	bind:this={canvas}
	width="600"
	height="400"
/>

<style>
	:global(:root) {
		text-align: center;
		background-color: #131516;
		color: white;
	}
	form {
		display: flex;
		justify-content: space-evenly;
	}
</style>
