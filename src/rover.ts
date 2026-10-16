export {};

const canvas = document.querySelector<HTMLCanvasElement>("#rover-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>("#rover-readout")!;

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
  execute(rover: Rover): void;
}

class ForwardCommand implements Command {
  execute(rover: Rover): void {
    rover.moveForward();
  }
}

class RightCommand implements Command {
  execute(rover: Rover): void {
    rover.turnRight();
  }
}

class ResetCommand implements Command {
  execute(rover: Rover): void {
    rover.reset();
  }
}

//invoker
class RoverExecutor {
  run(command: Command, rover: Rover): void {
    command.execute(rover);
    drawRover();
  }
}

const rover = new Rover();
const executor = new RoverExecutor();

const forwardCmd = new ForwardCommand();
const rightCmd = new RightCommand();
const resetCmd = new ResetCommand();

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
  executor.run(forwardCmd, rover);
};
document.querySelector<HTMLButtonElement>("#rover-right")!.onclick = () => {
  executor.run(rightCmd, rover);
};
document.querySelector<HTMLButtonElement>("#rover-reset")!.onclick = () => {
  executor.run(resetCmd, rover);
};
drawRover();
