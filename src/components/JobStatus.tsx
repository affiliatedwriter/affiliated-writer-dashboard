"use client";

type Props = {
  steps: string[];
  currentStep: number;
};

export default function JobStatus({ steps, currentStep }: Props) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow">
      <h3 className="mb-4 text-lg font-semibold">Article Generation Progress</h3>
      <ul className="space-y-2">
        {steps.map((step, i) => (
          <li
            key={i}
            className={`flex items-center gap-2 text-sm ${
              i < currentStep
                ? "text-green-600"
                : i === currentStep
                ? "text-blue-600"
                : "text-gray-400"
            }`}
          >
            <span>
              {i < currentStep ? "✅" : i === currentStep ? "⏳" : "•"}
            </span>
            {step}
          </li>
        ))}
      </ul>
    </div>
  );
}
