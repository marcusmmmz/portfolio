<script lang="ts">
	import {
		drawLine,
		getPointerPos,
		isPointerInRect,
		type Rect2,
		Vec2,
		getDistance2D,
		getRadialDistance,
		normalizeVector
	} from '$lib/utils';
	import { onMount } from 'svelte';

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;

	let visibleIcons: Icon[] = [];

	let draggedIcon: Icon | null = null;

	let can_drag = false;

	interface Icon {
		pos: Vec2;
		size: Vec2;
		textureSrc: string;
		scale: number;
		image: HTMLImageElement;
		draw: () => any;
	}

	function createIcon(pos: Vec2, scale = 1, textureSrc = '') {
		let obj: Icon = {
			pos,
			size: Vec2(0, 0),
			get textureSrc() {
				return textureSrc;
			},
			set textureSrc(src: string) {
				this.image.src = src;
				this.image.onload = () => {
					this.size.x = this.image.width * this.scale;
					this.size.y = this.image.height * this.scale;
				};
			},
			scale,
			image: new Image(),
			draw() {
				ctx.fillStyle = '#880088';
				ctx.drawImage(this.image, this.pos.x, this.pos.y, this.size.x, this.size.y);

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
			}
		};

		return obj;
	}

	function connectIcons(a: Rect2, b: Rect2) {
		drawLine(ctx, [
			Vec2(a.pos.x + a.size.x / 2, a.pos.y + a.size.x / 2),
			Vec2(b.pos.x + b.size.y / 2, b.pos.y + b.size.y / 2)
		]);
	}

	function mainloop() {
		// Clear screen
		ctx.fillStyle = '#131516';
		ctx.fillRect(0, 0, 1000, 1000);

		connectIcons(stackIcons.frontend, stackIcons.server);

		if (stack.db == 'firebase') {
			connectIcons(stackIcons.frontend, stackIcons.db);
		} else {
			connectIcons(stackIcons.server, stackIcons.orm);

			connectIcons(stackIcons.orm, stackIcons.db);
		}

		for (const obj of visibleIcons) obj.draw();

		return requestAnimationFrame(mainloop);
	}

	function onPointerDown(e: MouseEvent | Touch) {
		for (const icon of visibleIcons) {
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

		can_drag = false;

		for (const icon of visibleIcons) {
			if (isPointerInRect(icon, getPointerPos(canvas, e))) {
				can_drag = true;
			}
		}
	}
	function onPointerUp() {
		draggedIcon = null;
	}

	function onPointerLeave() {
		can_drag = false;
	}

	onMount(() => {
		ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

		let frame = mainloop();
		return () => cancelAnimationFrame(frame);
	});

	let stack = {
		language: 'typescript',
		frontend: 'svelte',
		server: 'nodejs',
		orm: 'prisma',
		db: 'postgresql'
	};

	let stackIcons = {
		// language: createIcon(Vec2(1000, 1000), 0.15),
		frontend: createIcon(Vec2(256, 256), 0.5),
		server: createIcon(Vec2(128, 128), 0.2),
		orm: createIcon(Vec2(256, 128), 0.5),
		db: createIcon(Vec2(256 + 128, 256), 0.125)
	};

	$: needsORM = stack.db != 'firebase';

	// $: stackIcons.language.textureSrc = stack.language + '.svg';
	$: stackIcons.frontend.textureSrc = stack.frontend + '.svg';
	$: stackIcons.server.textureSrc = stack.server + '.svg';
	$: stackIcons.orm.textureSrc = stack.orm + '.svg';
	$: stackIcons.db.scale = stack.db == 'firebase' ? 0.5 : 0.125;
	$: stackIcons.db.textureSrc = stack.db + '.svg';

	$: stackIcons.orm.scale = needsORM ? 0.5 : 0;

	$: visibleIcons = Object.values(stackIcons);
</script>

<h1>Hello there, I'm Marcus, a fullstack web dev and also a tinkerer at heart!</h1>
<h2>Here's my web tech stack (the icons are draggable!):</h2>
<form>
	<div class="stack-choice">
		<strong>Front end</strong>
		<label>
			<input type="radio" bind:group={stack.frontend} value={'svelte'} />
			Svelte
		</label>
		<label>
			<input type="radio" bind:group={stack.frontend} value={'react'} />
			React
		</label>
	</div>

	<div class="stack-choice">
		<strong>Server</strong>
		<label>
			<input type="radio" bind:group={stack.server} value={'nodejs'} />
			NodeJS
		</label>
	</div>

	<div class="stack-choice">
		<strong>ORM</strong>
		<label>
			<input type="radio" bind:group={stack.orm} value={'prisma'} disabled={!needsORM} />
			Prisma
		</label>
	</div>

	<div class="stack-choice">
		<strong>Database</strong>
		<label>
			<input type="radio" bind:group={stack.db} value={'postgresql'} />
			Postgresql
		</label>
		<label>
			<input type="radio" bind:group={stack.db} value={'firebase'} />
			Firebase
		</label>
	</div>
</form>

<canvas
	style={`cursor: ${can_drag ? 'grab' : ''}`}
	on:touchstart={(e) => onPointerDown(e.touches[0])}
	on:touchmove={(e) => {
		e.preventDefault();
		onPointerMove(e.touches[0]);
	}}
	on:touchend={() => onPointerUp()}
	on:pointerleave={onPointerLeave}
	on:mousedown={onPointerDown}
	on:mousemove={onPointerMove}
	on:mouseup={onPointerUp}
	on:mouseleave={onPointerLeave}
	bind:this={canvas}
	width="600"
	height="400"
/>

<h1>
	You can find some projects of mine <a href="/projects">over here</a>
</h1>

<style>
	form {
		display: flex;
		justify-content: space-evenly;
	}
	.stack-choice {
		display: flex;
		flex-direction: column;
	}
	canvas {
		margin: 1em;
		border-color: #111133;
		border-width: 1rem;
		border-style: solid;
	}
</style>
