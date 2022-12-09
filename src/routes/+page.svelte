<script lang="ts">
	import {
		drawLine,
		getPointerPos,
		isPointerInRect,
		type Rect2,
		Vec2,
	} from "$lib/utils";
	import { onMount } from "svelte";

	/**
	 * TODO:
	 *	show my stack as something like a graph
	 *	and then have alternative graphs for
	 *	the other things i'm also able to use
	 *	like React or NextJS
	 */

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;

	let gameObjects: {
		draw: Function;
	}[] = [];

	let icons: Icon[] = [];
	let draggedIcon: Icon | null;

	interface Icon extends Rect2 {
		textureSrc: string;
		scale: number;
		image: HTMLImageElement;
		draw: () => any;
	}

	function createIcon(x: number, y: number, textureSrc: string, scale = 1) {
		let obj: Icon = {
			x,
			y,
			textureSrc,
			scale,
			width: 0,
			height: 0,
			image: new Image() as HTMLImageElement,
			draw() {
				ctx.fillStyle = "#880088";
				ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
			},
		};

		obj.image.src = textureSrc;
		obj.image.onload = () => {
			obj.width = obj.image.width * obj.scale;
			obj.height = obj.image.height * obj.scale;
		};
		icons.push(obj);

		return obj;
	}

	function connectIcons(a: Rect2, b: Rect2) {
		drawLine(ctx, [
			Vec2(a.x + a.width / 2, a.y + a.width / 2),
			Vec2(b.x + b.height / 2, b.y + b.height / 2),
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

		connectIcons(
			stackChoices.server[stack.server],
			stackChoices.orm[stack.orm]
		);

		connectIcons(stackChoices.orm[stack.orm], stackChoices.db[stack.db]);

		for (const obj of gameObjects) obj.draw();

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
			draggedIcon.x = x - draggedIcon.width / 2;
			draggedIcon.y = y - draggedIcon.height / 2;
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
			javascript: createIcon(1000, 1000, "javascript.svg", 0.5),
			typescript: createIcon(1000, 1000, "typescript.svg", 0.15),
		},
		frontend: {
			svelte: createIcon(32, 32, "svelte.svg", 0.5),
			react: createIcon(32, 32, "react.svg", 0.5),
		},
		server: {
			nodejs: createIcon(128, 32, "nodejs.svg", 0.2),
		},
		orm: {
			prisma: createIcon(256, 32, "prisma.svg", 0.5),
		},
		db: {
			postgresql: createIcon(256 + 64, 32, "postgresql.svg", 0.125),
			firebase: createIcon(256 + 64, 32, "firebase.svg", 0.5),
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
		gameObjects = [
			stackChoices.frontend[stack.frontend],
			stackChoices.server[stack.server],
			// orm,
			stackChoices.db[stack.db],
		];

		if (needsORM && stack.orm)
			gameObjects = [...gameObjects, stackChoices.orm[stack.orm]];
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
