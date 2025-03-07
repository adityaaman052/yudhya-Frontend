"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
    const router = useRouter();
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    
    const [sceneDescription, setSceneDescription] = useState("");
    const [hasLearning, setHasLearning] = useState(false);
    const [learningContent, setLearningContent] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);
    const [showLearning, setShowLearning] = useState(false);
    const [showButtons, setShowButtons] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        return () => {
            if (videoRef.current?.srcObject) {
                videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            setError("Error accessing camera");
        }
    };

    const handleCapture = async () => {
        if (!videoRef.current || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const video = videoRef.current;
        const context = canvas.getContext("2d");

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
            if (blob) {
                setSelectedFile(blob);
            }
        }, "image/jpeg");
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const sendImageToAPI = async () => {
        if (!selectedFile) {
            setError("Please upload or capture an image first.");
            return;
        }

        setIsProcessing(true);
        setError(null);

        const formData = new FormData();
        formData.append("image", selectedFile, "captured_image.jpg");

        try {
            const response = await fetch("http://127.0.0.1:5003/api/scene-description", {
                method: "POST",
                body: formData,
                headers: { "Accept": "application/json" },
            });

            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            const data = await response.json();
            if (!data || !data.scene_description) throw new Error("Invalid response from server");

            setSceneDescription(data.scene_description);
            setHasLearning(data.has_learning || false);
            setLearningContent(data.learning || "");
            setShowButtons(true);

            readAloud(data.scene_description);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsProcessing(false);
        }
    };

    const readAloud = (text) => {
        if ('speechSynthesis' in window) {
            const speech = new SpeechSynthesisUtterance(text);
            window.speechSynthesis.speak(speech);
        }
    };

    const handleYes = () => setShowLearning(true);
    const handleNo = () => {
        setSceneDescription("");
        setHasLearning(false);
        setLearningContent("");
        setShowLearning(false);
        setError(null);
        setSelectedFile(null);
    };
    const handleBack = () => router.push("/");

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6 mt-16">
            {/* Header */}
            <h1 className="text-4xl font-extrabold text-blue-400 mb-6 tracking-wide">
                X-Ray Analysis Tool
            </h1>
    
            <div className="flex flex-col items-center space-y-6 bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700">
                {/* Video Stream Section */}
                <div className="relative">
                    <video
                        ref={videoRef}
                        autoPlay
                        className="w-96 h-72 border-2 border-blue-400 shadow-lg rounded-md"
                    />
                    <canvas ref={canvasRef} className="hidden" />
                </div>
    
                {/* Buttons for Camera Control */}
                <div className="flex space-x-4">
                    <button
                        onClick={startCamera}
                        className="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-md font-semibold tracking-wide transition"
                    >
                        Start Camera
                    </button>
                    <button
                        onClick={handleCapture}
                        className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-md font-semibold tracking-wide transition"
                    >
                        Capture X-Ray
                    </button>
                </div>
    
                <p className="text-lg text-gray-400 mt-4">OR</p>
    
                {/* File Upload Section */}
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="bg-gray-800 text-white border border-gray-600 px-4 py-2 rounded-md"
                />
    
                <button
                    onClick={sendImageToAPI}
                    className="bg-green-600 hover:bg-green-500 px-6 py-3 rounded-md font-semibold tracking-wide transition"
                >
                    Upload X-Ray & Analyze
                </button>
            </div>
    
            {/* Processing & Error Messages */}
            {isProcessing && <p className="text-2xl mt-6 text-blue-400 animate-pulse">Analyzing X-Ray...</p>}
            {error && <p className="text-red-500 text-xl mt-6">{error}</p>}
    
            {/* X-Ray Analysis Result */}
            {!isProcessing && !error && sceneDescription && (
                <div className="mt-8 bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 max-w-2xl text-center">
                    <h2 className="text-2xl font-bold text-blue-400">Analysis Report:</h2>
                    <p className="text-lg text-gray-300 mt-2">{sceneDescription}</p>
                </div>
            )}
    
            {/* Additional Medical Learning Section */}
            {showLearning && learningContent && (
                <div className="mt-6 bg-white text-gray-900 p-6 rounded-lg shadow-lg border border-gray-300 max-w-3xl">
                    <h2 className="font-bold text-2xl text-gray-800">Medical Insights:</h2>
                    <p className="text-lg mt-2">{learningContent}</p>
                </div>
            )}
    
            {/* Decision Buttons */}
            {showButtons && (
                <div className="mt-6 flex space-x-4">
                    <button
                        onClick={handleYes}
                        className="bg-green-600 hover:bg-green-500 px-6 py-3 rounded-md font-semibold tracking-wide transition"
                    >
                        Confirm
                    </button>
                    <button
                        onClick={handleNo}
                        className="bg-red-600 hover:bg-red-500 px-6 py-3 rounded-md font-semibold tracking-wide transition"
                    >
                        Reject
                    </button>
                    <button
                        onClick={handleBack}
                        className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-md font-semibold tracking-wide transition"
                    >
                        Back to Home
                    </button>
                </div>
            )}
        </div>
    );
}