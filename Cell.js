class Cell {
	constructor(x_, y_) {
		this.x = x_;
		this.y = y_;

		this.g = Infinity;
		this.f = Infinity;
		this.from = null;
		this.wall = Math.random() > 0.8;
	}

	h(end) {
		return (this.x - end.x) ** 2 + (this.y - end.y) ** 2; // Squared Euclidian Distance
	}

	draw(ctx, color = 'white') {
		ctx.fillStyle = this.wall ? 'black' : color;
		ctx.fillRect(this.x * CELL_SIZE, this.y * CELL_SIZE, CELL_SIZE - 1, CELL_SIZE - 1);

		if (!this.wall && color != 'grey') {
			ctx.font = CELL_SIZE / 4 + "px Arial";
			ctx.fillStyle = "white";
			ctx.fillText(this.h(end), (this.x + 0.45) * CELL_SIZE, (this.y + 0.4) * CELL_SIZE);
			ctx.fillText(this.g, (this.x + 0.05) * CELL_SIZE, (this.y + 0.4) * CELL_SIZE);
			ctx.fillText(this.f, (this.x + 0.05) * CELL_SIZE, (this.y + 0.8) * CELL_SIZE);

			if (this.from) {
				let dx = CELL_SIZE / 8 * (this.x - this.from.x);
				let dy = CELL_SIZE / 8 * (this.y - this.from.y);

				let cx = (this.x + 0.75) * CELL_SIZE;
				let cy = (this.y + 0.75) * CELL_SIZE;
				ctx.beginPath();
				ctx.moveTo(cx - dx, cy - dy);
				ctx.lineTo(cx + dx - 0.25 * dy, cy + dy - 0.25 * dx);
				ctx.lineTo(cx + dx + 0.25 * dy, cy + dy + 0.25 * dx);
				ctx.fill();
			}
		}
	}
}