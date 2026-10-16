export {};

const canvas = document.querySelector<HTMLCanvasElement>("#rover-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>("#rover-readout")!;

const pendingList = document.querySelector<HTMLOListElement>("#rover-pending")!;
const runButton = document.querySelector<HTMLButtonElement>("#rover-run")!;
const clearButton = document.querySelector<HTMLButtonElement>("#rover-clear")!;
const queueStatus = document.querySelector<HTMLParagraphElement>(
  "#rover-queue-status",
)!;

interface directionRecord {
  name: string;
  dx: number;
  dy: number;
}

const headings: directionRecord[] = [
  { name: "North", dx: 0, dy: -1 },
  { name: "East", dx: 1, dy: 0 },
  { name: "South", dx: 0, dy: 1 },
  { name: "West", dx: -1, dy: 0 },
];

//reciever
class Rover {
  x = 2;
  y = 2;
  direction = 0;

  moveForward() {
    const curr = headings[this.direction];
    this.x = Math.max(0, Math.min(4, this.x + curr.dx));
    this.y = Math.max(0, Math.min(4, this.y + curr.dy));
  }

  turnRight() {
    this.direction = (this.direction + 1) % 4;
  }

  reset() {
    this.x = 2;
    this.y = 2;
    this.direction = 0;
  }
}

//command
interface Command {
  label: string;
  execute(rover: Rover): void;
}

class ForwardCommand implements Command {
  label = "Forward";
  execute(rover: Rover): void {
    rover.moveForward();
  }
}

class RightCommand implements Command {
  label = "Right";
  execute(rover: Rover): void {
    rover.turnRight();
  }
}

//processor/scheduler
class RoverScheduler {
  private queue: Command[] = [];

  enqueue(command: Command): void {
    this.queue.push(command);
    this.updateUI();
  }

  runAll(rover: Rover): void {
    while (this.queue.length > 0) {
      const command = this.queue.shift()!;
      command.execute(rover);
    }
    this.updateUI();
    drawRover();
  }

  clear(): void {
    this.queue = [];
    this.updateUI();
  }

  private updateUI(): void {
    pendingList.innerHTML = "";

    this.queue.forEach((cmd) => {
      const li = document.createElement("li");
      li.textContent = cmd.label;
      pendingList.appendChild(li);
    });

    if (this.queue.length === 0) {
      queueStatus.textContent = "Empty";
      runButton.disabled = true;
      clearButton.disabled = true;
    } else {
      queueStatus.textContent = `${this.queue.length} pending action(s)`;
      runButton.disabled = false;
      clearButton.disabled = false;
    }
  }
}

const rover = new Rover();
const scheduler = new RoverScheduler();

function drawRover() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#718881";
  for (let row = 0; row < 5; row++) {
    for (let column = 0; column < 5; column++) {
      ctx.strokeRect(10 + column * 56, 10 + row * 56, 56, 56);
    }
  }
  ctx.save();
  ctx.translate(38 + rover.x * 56, 38 + rover.y * 56);
  ctx.rotate(rover.direction * Math.PI / 2);
  ctx.fillStyle = "#27766b";
  ctx.beginPath();
  ctx.moveTo(0, -20);
  ctx.lineTo(17, 16);
  ctx.lineTo(-17, 16);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
  readout.textContent = `Position: (${rover.x}, ${rover.y}) · Facing: ${
    headings[rover.direction].name
  }`;
}

document.querySelector<HTMLButtonElement>("#rover-forward")!.onclick = () => {
  scheduler.enqueue(new ForwardCommand());
};
document.querySelector<HTMLButtonElement>("#rover-right")!.onclick = () => {
  scheduler.enqueue(new RightCommand());
};
document.querySelector<HTMLButtonElement>("#rover-run")!.onclick = () => {
  scheduler.runAll(rover);
};

document.querySelector<HTMLButtonElement>("#rover-clear")!.onclick = () => {
  scheduler.clear();
};

document.querySelector<HTMLButtonElement>("#rover-reset")!.onclick = () => {
  rover.reset();
  scheduler.clear();
  drawRover();
};
drawRover();
scheduler.clear();
