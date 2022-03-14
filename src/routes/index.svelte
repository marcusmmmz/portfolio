<script lang="ts">
	import {
		drawLine,
		getPointerPos,
		isPointerInRect,
		Rect2,
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

	class Icon {
		width = 0;
		height = 0;
		image = new Image();

		constructor(
			public x: number,
			public y: number,
			textureSrc: string,
			public scale = 1
		) {
			this.image.src = textureSrc;
			this.image.onload = () => {
				this.width = this.image.width * this.scale;
				this.height = this.image.height * this.scale;
			};
			icons.push(this);
		}

		draw() {
			ctx.fillStyle = "#880088";
			ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
		}
	}

	function connectIcons(a: Rect2, b: Rect2) {
		gameObjects.push({
			draw() {
				drawLine(ctx, [
					Vec2(a.x + a.width / 2, a.y + a.width / 2),
					Vec2(b.x + b.height / 2, b.y + b.height / 2),
				]);
			},
		});
	}

	function mainloop() {
		// Clear screen
		ctx.fillStyle = "#111133";
		ctx.fillRect(0, 0, 1000, 1000);
		// ctx.clearRect(0, 0, 1000, 1000);

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
			javascript: new Icon(1000, 1000, "javascript.svg", 0.5),
			typescript: new Icon(1000, 1000, "typescript.svg", 0.15),
		},
		frontend: {
			svelte: new Icon(32, 32, "svelte.svg", 0.5),
			react: new Icon(32, 32, "react.svg", 0.5),
		},
		server: {
			nodejs: new Icon(128, 32, "nodejs.svg", 0.2),
		},
		orm: {
			prisma: new Icon(256, 32, "prisma.svg", 0.5),
		},
		db: {
			postgresql: new Icon(256 + 64, 32, "postgresql.svg", 0.125),
			firebase: new Icon(256 + 64, 32, "firebase.svg", 0.5),
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
