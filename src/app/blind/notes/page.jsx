"use client";
import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";

const NoteMakingPage = () => {
    const [topic, setTopic] = useState("");
    const [content, setContent] = useState("");
    const [status, setStatus] = useState("");
    const [notes, setNotes] = useState("");
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef(null);

    useEffect(() => {
        if ("webkitSpeechRecognition" in window) {
            const recognition = new window.webkitSpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = false;
            recognition.lang = "en-US";

            recognition.onresult = (event) => {
                const transcript = event.results[event.results.length - 1][0].transcript.trim();
                if (!topic) {
                    setTopic(transcript);
                    setStatus(`📝 Topic set: "${transcript}"`);
                } else {
                    setContent(prev => prev + " " + transcript);
                    setStatus("✅ Note recorded.");
                }
            };

            recognitionRef.current = recognition;
        }
    }, []);

    const toggleRecording = () => {
        if (isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
            setStatus("🛑 Recording stopped.");
        } else {
            recognitionRef.current.start();
            setIsListening(true);
            setStatus("🎙️ Recording started...");
        }
    };

    const saveNote = async () => {
        if (!topic || !content) {
            setStatus("❌ Please provide a topic and content.");
            return;
        }

        try {
            const response = await fetch("http://127.0.0.1:5002/api/note-making/save_note", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ topic, content }),
            });

            const data = await response.json();
            setStatus(data.message);
            setContent("");
        } catch (error) {
            setStatus("❌ Failed to save note.");
        }
    };

    const fetchNotes = async () => {
        if (!topic) {
            setStatus("❌ Please say a topic name first.");
            return;
        }

        try {
            const response = await fetch(`http://127.0.0.1:5002/api/note-making/get_notes?topic=${topic}`);
            const data = await response.json();

            if (data.success) {
                setNotes(data.notes);
                setStatus(`📜 Notes generated for "${topic}".`);
                speakNotes(data.notes);
            } else {
                setNotes("");
                setStatus("⚠️ No notes generated.");
            }
        } catch (error) {
            setStatus("❌ Error fetching notes.");
        }
    };

    const speakNotes = (text) => {
        if ("speechSynthesis" in window) {
            window.speechSynthesis.cancel();
            const sentences = text.split(". ");

            sentences.forEach((sentence, index) => {
                setTimeout(() => {
                    const utterance = new SpeechSynthesisUtterance(sentence);
                    utterance.rate = 0.9;
                    utterance.pitch = 1;
                    window.speechSynthesis.speak(utterance);
                }, index * 3000);
            });
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center p-6 bg-gray-900 text-gray-100 mt-20">
            <h1 className="text-3xl font-bold mb-6">🗣️ AI-Powered Voice Notes</h1>
            <Card className="w-full max-w-2xl bg-gray-800 shadow-lg p-6">
                <CardContent className="flex flex-col space-y-4">
                    <button onClick={toggleRecording} className={`px-6 py-3 rounded-lg text-white ${isListening ? "bg-red-500" : "bg-blue-500"} hover:opacity-80 transition`}>
                        {isListening ? "🛑 Stop Recording" : "🎙️ Start Recording"}
                    </button>
                    <button onClick={saveNote} className="bg-green-500 px-6 py-3 rounded-lg text-white hover:bg-green-600 transition">
                        Save Note
                    </button>
                    <button onClick={fetchNotes} className="bg-yellow-500 px-6 py-3 rounded-lg text-white hover:bg-yellow-600 transition">
                        Get Notes
                    </button>
                    {status && <p className="mt-4 text-yellow-400">{status}</p>}
                </CardContent>
            </Card>
            {notes && (
                <Card className="w-full max-w-2xl bg-gray-800 shadow-lg p-6 mt-6">
                    <CardContent>
                        <h2 className="text-xl font-bold mb-2">📖 Generated Notes:</h2>
                        <p className="text-white whitespace-pre-line">{notes}</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default NoteMakingPage;