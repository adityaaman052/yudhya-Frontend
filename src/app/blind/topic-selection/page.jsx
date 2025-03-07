"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function TopicSelection() {
    const router = useRouter();
    const [transcription, setTranscription] = useState("");
    const [isRecording, setIsRecording] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    const speak = (text) => {
        const utterance = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(utterance);
    };

    useEffect(() => {
        speak("Please teach me to improve my insights");
        initializeSpeechRecognition();
    }, []);

    const initializeSpeechRecognition = () => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
            const recognition = new SpeechRecognition();
            
            recognition.continuous = false;
            recognition.interimResults = true;
            recognition.lang = 'en-US';

            recognition.onstart = () => {
                setIsRecording(true);
                setTranscription(""); // Clear previous transcription
                setIsFinished(false);
                console.log('Voice recognition started...');
            };

            recognition.onresult = (event) => {
                const transcript = Array.from(event.results)
                    .map((result) => result[0].transcript)
                    .join('');
                setTranscription(transcript);
                console.log('Transcript:', transcript);
            };

            recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
            };

            recognition.onend = async () => {
                setIsRecording(false);
                setIsFinished(true);
                speak("Thanks for the lesson, I will try to improve.");

                if (transcription) {
                    try {
                        await axios.post(`http://127.0.0.1:5000/api/teach_model`, { 
                            topic: transcription 
                        });
                    } catch (error) {
                        console.error('Error submitting topic:', error);
                    }
                }
            };

            recognition.start();
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-black to-purple-900 p-6">
            <Card className="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-6">
                <CardContent className="flex flex-col items-center space-y-6">
                    <h1 className="text-4xl font-extrabold text-gray-800 text-center">
                        Hey, How are you?
                    </h1>

                    <div className="text-center w-full bg-gray-100 rounded-lg p-6 shadow-md">
                        <p className="text-xl font-semibold text-gray-700">
                            {isRecording ? (
                                <span className="flex items-center justify-center gap-2 text-purple-600">
                                    <Loader2 className="animate-spin" size={24} />
                                    Listening...
                                </span>
                            ) : isFinished ? (
                                <span className="text-green-600">Thank you for teaching!</span>
                            ) : (
                                <span className="text-gray-500">Waiting to start...</span>
                            )}
                        </p>
                        <p className="text-2xl font-bold text-gray-900 mt-4">
                            {transcription || "Speak your lesson..."}
                        </p>
                    </div>

                    {!isRecording && (
                        <Button
                            size="lg"
                            onClick={initializeSpeechRecognition}
                            className="text-xl px-8 py-6 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-all duration-300 shadow-lg"
                        >
                            Start Teaching
                        </Button>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
