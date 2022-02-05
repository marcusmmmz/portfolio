export type Vec2 = { x: number; y: number };
export const Vec2 = (x: number, y: number) => ({ x, y });

export type Rect2 = Vec2 & { width: number; height: number };

export function isMouseInRect(rect: Rect2, mouse: Vec2) {
	return (
		mouse.x > rect.x &&
		mouse.y > rect.y &&
		mouse.x < rect.x + rect.width &&
		mouse.y < rect.y + rect.height
	);
}

export function getMousePos(canvas: HTMLCanvasElement, evt: MouseEvent) {
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
