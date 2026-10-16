export {};

const canvas = document.querySelector<HTMLCanvasElement>("#allocation-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>(
  "#allocation-readout",
)!;

//Constants
const maxCrewSize = 6;
const defaultProducerCount = 2;
const productionRatePerProducer = 3;
const staticTotalConsumption = 6;

//var
let activeProducers = defaultProducerCount;

//explicit type
type ShiftResults = {
  activeCount: number;
  maxCount: number;
  production: number;
  consumption: number;
  balance: number;
};

function calcShiftData(producers: number): ShiftResults {
  const production = producers * productionRatePerProducer;
  const consumption = staticTotalConsumption;
  const balance = production - consumption;

  return {
    activeCount: producers,
    maxCount: maxCrewSize,
    production: production,
    consumption: consumption,
    balance: balance,
  };
}

function updateDOM(data: ShiftResults): void {
  const balanceSign = data.balance > 0 ? "+" : "";
  readout.textContent = `Assigned: ${data.activeCount}/${data.maxCount} ·` +
    `Production: ${data.production} · ` +
    `Consumption: ${data.consumption} · ` +
    `Balance: ${balanceSign}${data.balance}`;
}

function canvasGraphics(data: ShiftResults): void {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < data.maxCount; i++) {
    const isActive = i < data.activeCount;
    ctx.fillStyle = isActive ? "#27766b" : "#c9d2c9";
    ctx.fillRect(18 + i * 45, 16, 36, 36);
    ctx.fillStyle = isActive ? "#ffffff" : "#233e43";
    ctx.font = "16px system-ui";
    ctx.fillText(String(i + 1), 31 + i * 45, 40);
  }

  ctx.fillStyle = "#233e43";
  ctx.font = "14px system-ui";
  ctx.fillText(`Producers: ${data.activeCount} / ${data.maxCount}`, 18, 76);
  ctx.fillText(`Production: ${data.production}`, 18, 102);
  ctx.fillStyle = "#27766b";
  ctx.fillRect(18, 110, data.production * 14, 20);
  ctx.fillStyle = "#233e43";
  ctx.fillText(`Consumption: ${data.consumption}`, 18, 154);
  ctx.fillStyle = "#a44d23";
  ctx.fillRect(18, 162, data.consumption * 14, 20);
}

function ui() {
  const shiftData = calcShiftData(activeProducers);

  updateDOM(shiftData);
  canvasGraphics(shiftData);
}

document.querySelector<HTMLButtonElement>("#allocation-less")!.onclick = () => {
  activeProducers = Math.max(0, activeProducers - 1);
  ui();
};
document.querySelector<HTMLButtonElement>("#allocation-more")!.onclick = () => {
  activeProducers = Math.min(maxCrewSize, activeProducers + 1);
  ui();
};
document.querySelector<HTMLButtonElement>("#allocation-reset")!.onclick =
  () => {
    activeProducers = 2;
    ui();
  };

ui();
