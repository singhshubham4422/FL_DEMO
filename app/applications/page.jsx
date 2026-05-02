export default function ApplicationsPage() {
  return (
    <div className="space-y-6">
      <div className="glass p-6">
        <h1 className="text-2xl font-bold">Real-World Applications</h1>
        <p className="mt-3 text-gray-300">Smart Grid Energy Forecasting</p>
        <p className="mt-2 text-sm text-gray-300">Federated learning enables multiple homes to collaboratively train energy-forecasting models while keeping raw data private. Differential Privacy and Secure Multiparty Computation help protect individual households' information during training and aggregation.</p>
      </div>

      <div className="glass p-6 flex gap-6 items-center">
        <div className="w-1/2">
          <div className="text-lg font-semibold">Why it matters</div>
          <ul className="mt-2 text-sm text-gray-300 list-disc list-inside">
            <li>Predict demand while preserving privacy</li>
            <li>Distributed updates reduce communication cost</li>
            <li>Regulatory-friendly approaches for consumer data</li>
          </ul>
        </div>

        <div className="w-1/2">
          <div className="flex gap-3 items-center">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center">Home</div>
            <div className="flex-1 text-sm text-gray-300">Homes communicate masked model updates to the central grid server for aggregation.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
