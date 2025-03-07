"use client";

export default function AnalysisResults({ data }) {
  return (
    <div className="mt-6 p-6 bg-white shadow-md rounded-lg">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">Analysis Results</h3>

      <div className="mb-4">
        <h5 className="text-xl font-semibold">Overall Health Assessment</h5>
        <p className="text-lg">
          Health Status:{" "}
          <span className="px-2 py-1 bg-blue-200 text-blue-800 rounded">
            {data.health_assessment.health_status}
          </span>
        </p>
        <p className="text-lg">Next Checkup: {data.health_assessment.next_checkup}</p>
      </div>

      <div className="mb-4">
        <h5 className="text-xl font-semibold">Detailed Findings</h5>
        {data.findings.map((finding, index) => (
          <div key={index} className="p-3 border rounded-lg my-2">
            <h6 className="text-lg font-semibold">{finding.condition}</h6>
            <p>Confidence: {Math.round(finding.confidence * 100)}%</p>
            <p>
              Severity:{" "}
              <span className="px-2 py-1 bg-yellow-200 text-yellow-800 rounded">
                {finding.severity}
              </span>
            </p>
          </div>
        ))}
      </div>

      <div className="mb-4">
        <h5 className="text-xl font-semibold">Treatment Plan</h5>
        {data.treatment_plan.immediate_actions.map((action, index) => (
          <div key={index} className="p-3 border rounded-lg bg-red-100 text-red-800">
            <h6 className="text-lg font-semibold">{action.condition}</h6>
            <p>{action.description}</p>
          </div>
        ))}
      </div>

      <div>
        <h5 className="text-xl font-semibold">Preventive Measures</h5>
        <ul className="list-disc pl-5">
          {data.treatment_plan.preventive_measures.map((measure, index) => (
            <li key={index}>{measure}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
