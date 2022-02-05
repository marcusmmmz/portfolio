export type Vec2 = { x: number; y: number };
export const Vec2 = (x: number, y: number) => ({ x, y });

export type Rect2 = Vec2 & { width: number; height: number };

export function isPointerInRect(rect: Rect2, pointer: Vec2) {
	return (
		pointer.x > rect.x &&
		pointer.y > rect.y &&
		pointer.x < rect.x + rect.width &&
		pointer.y < rect.y + rect.height
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
