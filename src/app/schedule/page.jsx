"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";

const hardcodedAppointments = [
  { id: 1, patient: "John Doe", date: "2025-03-10", time: "10:00 AM" },
  { id: 2, patient: "Jane Smith", date: "2025-03-11", time: "11:30 AM" },
  { id: 3, patient: "Michael Brown", date: "2025-03-12", time: "02:00 PM" },
  { id: 4, patient: "Emily Davis", date: "2025-03-13", time: "09:30 AM" },
  { id: 5, patient: "Chris Wilson", date: "2025-03-14", time: "01:00 PM" },
  { id: 6, patient: "Anna White", date: "2025-03-15", time: "03:30 PM" },
  { id: 7, patient: "David Clark", date: "2025-03-16", time: "08:00 AM" },
];

export default function DentistScheduler() {
  const [appointments, setAppointments] = useState([]);
  const [aiSuggestion, setAiSuggestion] = useState("");

  useEffect(() => {
    setAppointments(hardcodedAppointments);
    fetchAISuggestions();
  }, []);

  const fetchAISuggestions = async () => {
    try {
      const res = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + process.env.NEXT_PUBLIC_GEMINI_API_KEY, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: "Suggest an optimized schedule for a dentist based on these appointments: " + JSON.stringify(hardcodedAppointments) }] }],
        }),
      });
      const data = await res.json();
      setAiSuggestion(data?.candidates?.[0]?.content?.parts?.[0]?.text || "No suggestion available");
    } catch (error) {
      console.error("Error fetching AI suggestions:", error);
    }
  };

  const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col items-center mt-20">
      <h1 className="text-2xl font-bold mb-4">Dentist Weekly Schedule</h1>
      <div className="bg-gray-800 p-4 rounded-lg shadow-lg w-full max-w-6xl overflow-x-auto">
        <table className="w-full border-collapse border border-gray-700">
          <thead>
            <tr className="bg-gray-700">
              <th className="p-2 border border-gray-600">Day</th>
              <th className="p-2 border border-gray-600">Appointments</th>
            </tr>
          </thead>
          <tbody>
            {weekdays.map((day, index) => (
              <tr key={index} className="odd:bg-gray-600 even:bg-gray-700">
                <td className="p-2 border border-gray-600 font-bold">{day}</td>
                <td className="p-2 border border-gray-600">
                  {appointments
                    .filter((appt) => format(new Date(appt.date), "EEEE") === day)
                    .map((appt) => (
                      <div key={appt.id} className="p-1">
                        {appt.time} - {appt.patient}
                      </div>
                    ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4 p-4 bg-gray-700 rounded">
          <h2 className="text-lg font-bold">AI Suggested Schedule</h2>
          <p className="mt-2">{aiSuggestion || "Fetching AI suggestion..."}</p>
        </div>
      </div>
    </div>
  );
}
