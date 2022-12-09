export type Vec2 = { x: number; y: number };
export const Vec2 = (x: number, y: number) => ({ x, y });

export type Rect2 = { pos: Vec2; size: Vec2 };

export function isPointerInRect(rect: Rect2, pointer: Vec2) {
	return (
		pointer.x > rect.pos.x &&
		pointer.y > rect.pos.y &&
		pointer.x < rect.pos.x + rect.size.x &&
		pointer.y < rect.pos.y + rect.size.y
	);
}

export function getPointerPos(
	canvas: HTMLCanvasElement,
	evt: MouseEvent | Touch
) {
	let rect = canvas.getBoundingClientRect();
	return {
		x: evt.clientX - rect.left,
		y: evt.clientY - rect.top,
	};
}

export function drawLine(
	ctx: CanvasRenderingContext2D,
	points: Vec2[],
	color = "white"
) {
	ctx.strokeStyle = color;
	ctx.lineWidth = 4;

	ctx.beginPath();
	ctx.moveTo(points[0].x, points[0].y);
	for (let i = 1; i < points.length; i++) {
		const vec = points[i];
		ctx.lineTo(vec.x, vec.y);
	}

	ctx.stroke();
}

export function getDistance2D(from: Vec2, to: Vec2) {
	return Vec2(from.x - to.x, from.y - to.y);
}

export function getRadialDistance(from: Vec2, to: Vec2) {
	let { x, y } = getDistance2D(from, to);
	return Math.sqrt(x ** 2 + y ** 2) || 0;
}

export function getVecMagnitude(vec: Vec2) {
	return Math.sqrt(vec.x ** 2 + vec.y ** 2);
}

export function normalizeVector(vec: Vec2): Vec2 {
	let magnitude = getVecMagnitude(vec);

	// console.log(vec);

	return Vec2(
		vec.x / magnitude || 0,
		vec.y / magnitude || 0
		// vec.divide(vec.magnitude());
	);
}
