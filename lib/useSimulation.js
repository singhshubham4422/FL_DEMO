import { useEffect, useMemo, useState } from "react";

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function useSimulation({ clients, dp, smpc, running }) {
  const [round, setRound] = useState(0);
  const [mse, setMse] = useState([]);
  const [delay, setDelay] = useState([]);
  const [activeClients, setActiveClients] = useState([]);
  const [epsilon, setEpsilon] = useState([]);
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState([]);
  const [computeLoad, setComputeLoad] = useState([]);

  const timeline = useMemo(() => {
    return Array.from({ length: 20 }, (_, index) => index + 1);
  }, []);

  useEffect(() => {
    if (!running) {
      setRound(0);
      setMse([]);
      setDelay([]);
      setActiveClients([]);
      setEpsilon([]);
      setStep(0);
      setStatus([]);
      setComputeLoad([]);
      return;
    }

    let baseMSE = 1.0;
    let currentRound = 0;

    const id = setInterval(() => {
      currentRound += 1;
      const nextRound = clamp(currentRound, 0, 20);
      setRound(nextRound);
      setStep((nextRound - 1) % 3);

      if (!dp && !smpc) {
        baseMSE *= 0.92;
      } else if (dp && !smpc) {
        baseMSE *= 0.92;
        baseMSE += Math.random() * 0.01;
      } else {
        baseMSE = 1.02 + Math.random() * 0.01;
      }

      const nextMse = parseFloat(baseMSE.toFixed(4));
      const nextDelay = parseFloat((10 + clients * 0.28 + Math.sin(nextRound / 3) * 0.8 + Math.random() * 0.6).toFixed(2));
      const nextActive = clamp(clients - Math.floor(Math.random() * Math.max(2, clients * 0.22)), 1, clients);
      const nextEpsilon = dp ? parseFloat((Math.sqrt(nextRound) * 1.6).toFixed(2)) : 0;
      const progressState = nextRound === 1
        ? ["Bootstrapping clients", "Syncing grid topology"]
        : nextRound === 20
          ? ["Federated rounds complete", "Aggregated model stabilized"]
          : [
              nextRound % 3 === 1 ? "Local training in progress" : nextRound % 3 === 2 ? "Uploading model updates" : "Aggregation and validation",
              dp ? "Applying differential privacy noise" : "Privacy budget remains stable",
              smpc ? "Secure aggregation masking enabled" : "Standard aggregation path"
            ];

      setMse((prev) => [...prev, { round: nextRound, value: nextMse }]);
      setDelay((prev) => [...prev, { round: nextRound, value: nextDelay }]);
      setActiveClients((prev) => [...prev, { round: nextRound, value: nextActive }]);
      setEpsilon((prev) => [...prev, { round: nextRound, value: nextEpsilon }]);
      setComputeLoad(Array.from({ length: Math.min(6, clients) }, (_, i) => ({
        client: i + 1,
        value: clamp(Math.round(28 + Math.random() * 65 - i * 2), 6, 96)
      })));
      setStatus(progressState);

      if (nextRound >= timeline.length) {
        clearInterval(id);
      }
    }, 800);

    return () => clearInterval(id);
  }, [clients, dp, smpc, running, timeline.length]);

  return {
    round,
    step,
    mse,
    delay,
    activeClients,
    epsilon,
    status,
    computeLoad,
    timeline
  };
}
