export {};

const canvas = document.querySelector<HTMLCanvasElement>("#allocation-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>(
  "#allocation-readout",
)!;
let activeProducers = 2;

function ui() {
  const totalProduction = activeProducers * 3;
  const totalConsumption = 6;
  const resourceBalance = totalProduction - totalConsumption;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < 6; i++) {
    ctx.fillStyle = i < activeProducers ? "#27766b" : "#c9d2c9";
    ctx.fillRect(18 + i * 45, 16, 36, 36);
    ctx.fillStyle = i < activeProducers ? "#ffffff" : "#233e43";
    ctx.font = "16px system-ui";
    ctx.fillText(String(i + 1), 31 + i * 45, 40);
  }
  ctx.fillStyle = "#233e43";
  ctx.font = "14px system-ui";
  ctx.fillText(`Producers: ${activeProducers} / 6`, 18, 76);
  ctx.fillText(`Production: ${totalProduction}`, 18, 102);
  ctx.fillStyle = "#27766b";
  ctx.fillRect(18, 110, totalProduction * 14, 20);
  ctx.fillStyle = "#233e43";
  ctx.fillText(`Consumption: ${totalConsumption}`, 18, 154);
  ctx.fillStyle = "#a44d23";
  ctx.fillRect(18, 162, totalConsumption * 14, 20);
  readout.textContent =
    `Assigned: ${activeProducers}/6 · Production: ${totalProduction} · Consumption: ${totalConsumption} · Balance: ${
      resourceBalance > 0 ? "+" : ""
    }${resourceBalance}`;
}

document.querySelector<HTMLButtonElement>("#allocation-less")!.onclick = () => {
  activeProducers = Math.max(0, activeProducers - 1);
  ui();
};
document.querySelector<HTMLButtonElement>("#allocation-more")!.onclick = () => {
  activeProducers = Math.min(6, activeProducers + 1);
  ui();
};
document.querySelector<HTMLButtonElement>("#allocation-reset")!.onclick =
  () => {
    activeProducers = 2;
    ui();
  };
ui();
