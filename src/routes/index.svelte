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
	let draggedIcons: Icon[] = [];

	class Icon {
		width = 64;
		height = 64;

		constructor(public x: number, public y: number) {
			icons.push(this);
			gameObjects.push(this);
		}

		draw() {
			ctx.fillStyle = "#880088";
			ctx.fillRect(this.x, this.y, this.width, this.height);
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

	let a = new Icon(0, 0);
	let b = new Icon(128, 128);

	connectIcons(a, b);

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
				draggedIcons.push(icon);
			}
		}
	}
	function onPointerMove(e: MouseEvent | Touch) {
		for (const icon of draggedIcons) {
			const { x, y } = getPointerPos(canvas, e);
			icon.x = x - icon.width / 2;
			icon.y = y - icon.height / 2;
		}
	}
	function onPointerUp() {
		draggedIcons = [];
	}

	onMount(() => {
		ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

		let frame = mainloop();
		return () => cancelAnimationFrame(frame);
	});
</script>

<canvas
	on:touchstart={(e) => onPointerDown(e.touches[0])}
	on:touchmove={(e) => {e.preventDefault(); onPointerMove(e.touches[0])}}
	on:touchend={() => onPointerUp()}
	on:mousedown={onPointerDown}
	on:mousemove={onPointerMove}
	on:mouseup={onPointerUp}
	bind:this={canvas}
	width="400"
	height="400"
/>

<style>
	:global(:root) {
		text-align: center;
		background-color: #131516;
		color: white;
	}
</style>
