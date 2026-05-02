export function generateSimulationData({ clients, dp, smpc }) {
  const rounds = 20;

  let mse = [];
  let delay = [];
  let active = [];
  let epsilon = [];

  let baseMSE = 1.0;

  for (let r = 1; r <= rounds; r++) {
    // -------- MSE --------
    if (!dp && !smpc) {
      baseMSE *= 0.92;
    } else if (dp && !smpc) {
      baseMSE *= 0.92;
      baseMSE += Math.random() * 0.01;
    } else {
      baseMSE = 1.02 + Math.random() * 0.01;
    }

    mse.push({ round: r, value: parseFloat(baseMSE.toFixed(4)) });

    // -------- Delay --------
    delay.push({
      round: r,
      value: parseFloat((14 + clients * 0.1 + Math.random()).toFixed(2))
    });

    // -------- Active Clients --------
    let activeClients = clients - Math.floor(Math.random() * (clients * 0.2));

    active.push({ round: r, value: activeClients });

    // -------- Epsilon --------
    epsilon.push({
      round: r,
      value: dp ? Math.sqrt(r) * 20 : 0
    });
  }

  return { mse, delay, active, epsilon };
}
