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
    let dpMSE = 1.0;
    let smpcMSE = 1.0;
    let currentRound = 0;

    const id = setInterval(() => {
      currentRound += 1;
      const nextRound = clamp(currentRound, 0, 20);
      setRound(nextRound);
      setStep((nextRound - 1) % 3);

      // Baseline converges rapidly
      baseMSE = Math.max(0.1, baseMSE * 0.85);
      
      // DP converges slower with noise
      dpMSE = Math.max(0.2, dpMSE * 0.92) + (Math.random() * 0.05 - 0.02);
      
      // SMPC + DP flatlines or converges very slowly
      smpcMSE = Math.max(0.85, smpcMSE * 0.98) + (Math.random() * 0.08 - 0.04);

      // Active selected logic
      const currentVal = dp && smpc ? smpcMSE : dp ? dpMSE : baseMSE;
      const nextMse = parseFloat(currentVal.toFixed(4));
      
      // Store all 3 for the comparative graph, plus the 'active' one as value
      const mseEntry = {
        round: nextRound,
        value: nextMse,
        baseline: parseFloat(baseMSE.toFixed(4)),
        dp: parseFloat(dpMSE.toFixed(4)),
        smpc: parseFloat(smpcMSE.toFixed(4))
      };

      // AODV Routing logic
      // In AODV, it finds multi-hop routes. Let's simulate a random hop count (2 to 4 hops usually).
      const hopCount = Math.floor(Math.random() * 3) + 2; // 2, 3, or 4 hops
      
      // Delay increases with hops: Base processing (10ms) + (hops * 15ms) + jitter
      const nextDelay = parseFloat((10 + (hopCount * 15) + clients * 0.28 + Math.sin(nextRound / 3) * 0.8 + Math.random() * 5).toFixed(2));
      
      const nextActive = clamp(clients - Math.floor(Math.random() * Math.max(2, clients * 0.22)), 1, clients);
      const nextEpsilon = dp ? parseFloat((Math.sqrt(nextRound) * 1.6).toFixed(2)) : 0;
      const progressState = nextRound === 1
        ? ["Bootstrapping clients", "Syncing grid topology via AODV"]
        : nextRound === 20
          ? ["Federated rounds complete", "Aggregated model stabilized"]
          : [
              nextRound % 3 === 1 ? "Local training in progress" : nextRound % 3 === 2 ? `Multi-hop routing (${hopCount} hops)` : "Aggregation and validation",
              dp ? "Applying differential privacy noise" : "Privacy budget remains stable",
              smpc ? "Secure aggregation masking enabled" : "Standard aggregation path"
            ];

      setMse((prev) => [...prev, mseEntry]);
      // We pass the hop count along with the delay value
      setDelay((prev) => [...prev, { round: nextRound, value: nextDelay, hops: hopCount }]);
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
    }, 1200); // Slowed down slightly to see AODV animation better

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
