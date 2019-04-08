const CANVAS_SIZE = 600;
const GRID_SIZE = 5;

const CELL_SIZE = CANVAS_SIZE / GRID_SIZE;

const canvas = document.createElement('canvas');
canvas.width = canvas.height = CANVAS_SIZE;
document.body.appendChild(canvas);

const ctx = canvas.getContext('2d');

let grid = [];
for (var y = 0; y < GRID_SIZE; y++) {
	grid[y] = [];
	for (var x = 0; x < GRID_SIZE; x++) {
		let c = new Cell(x, y)
		grid[y].push(c);
	}
}

let start = grid[0][0];
start.g = 0;
start.wall = false;
let end = grid[GRID_SIZE - 1][GRID_SIZE - 1];
end.wall = false;
start.f = start.h(end);

let open = [start];
let closed = [];

let found = false;

let current;

const DIR = [{
		x: 0,
		y: -1
	},
	{
		x: 1,
		y: 0
	},
	{
		x: 0,
		y: 1
	},
	{
		x: -1,
		y: 0
	}
];


function step() {
	if (open.length == 0) {
		console.error("NO SOLUTION");
		return;
	}

	current = open.reduce((min, elt) => {
		if (elt.f < min.f) {
			return elt;
		}
		if (elt.f == min.f && elt.h(end) < min.h(end)) {
			return elt;
		}
		return min;
	});

	if (current == end) {
		found = true;
		console.log("PATH FOUND!");
		return;
	}

	open.splice(open.indexOf(current), 1);
	closed.push(current);

	for (var d = 0; d < 4; d++) {
		let dir = DIR[d];
		let nx = current.x + dir.x;
		let ny = current.y + dir.y;

		if (nx < 0 || ny < 0 || nx > GRID_SIZE - 1 || ny > GRID_SIZE - 1) {
			continue;
		}

		let nCell = grid[ny][nx];
		if (nCell.wall || closed.indexOf(nCell) > -1) {
			continue;
		}

		let gScore = current.g + 1;

		if (open.indexOf(nCell) == -1) {
			open.push(nCell);
		} else if (gScore >= nCell.g) {
			continue;
		}

		nCell.from = current;
		nCell.g = gScore;
		nCell.f = nCell.g + nCell.h(end);
	}
}

function draw() {
	for (var y = 0; y < GRID_SIZE; y++) {
		for (var x = 0; x < GRID_SIZE; x++) {
			let c = grid[y][x];
			c.draw(ctx);

			if (c == end) {
				c.draw(ctx, 'grey');
			}
			if (open.indexOf(c) > -1) {
				c.draw(ctx, 'green');
			}
			if (closed.indexOf(c) > -1) {
				c.draw(ctx, 'red');
			}
			if (c == current) {
				c.draw(ctx, 'blue');
			}
		}
	}
}

function astar() {
	if (!found) {
		step();
		draw();
	} else {
		let c = end;
		do {
			c.draw(ctx, 'orange');
			c = c.from;
		} while (c != start);
	}
}

draw();
document.addEventListener('click', evt => {
	if (evt.ctrlKey) {
		let x = Math.floor(evt.x / CELL_SIZE);
		let y = Math.floor(evt.y / CELL_SIZE);
		grid[y][x].wall = !grid[y][x].wall;
		draw();
	} else {
		astar();
	}
});