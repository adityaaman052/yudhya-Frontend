"use client";
import { useEffect } from "react";
import { useSpeech } from "@/hooks/speech";
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Mic, FileSearch, FileText, Image, Youtube, BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";

const BlindPage = () => {
    const router = useRouter();
    const { speakText } = useSpeech();

    useEffect(() => {
        speakText(
            "Welcome Jury,  Explore Dantika's AI-powered features designed to enhance your dental practice.",
        );
    }, [speakText]);

    const handleHover = (title, description) => {
        speakText(`${title}. ${description}`);
    };

    const features = [
        {
            title: "Train the model",
            description:
                "Help Improving the model",
            icon: <Mic className="w-24 h-24 text-white" />,
            path: "/blind/topic-selection",
            bgColor: "bg-[#0A5EB0] hover:bg-[#0A5EB0]/90",
        },
        {
            title: "Analysis",
            description: "Upload and analyze images for detailed analysis",
            icon: <Image className="w-24 h-24 text-white" />,
            path: "/blind/scene-description",
            bgColor: "bg-[#4B4376] hover:bg-[#4B4376]/90",
        },
        {
            title: "Virtual Assistance",
            description: "Mange your daily tasks with AI assistance",
            icon: <FileText className="w-24 h-24 text-white" />,
            path: "/blind/notes",
            bgColor: "bg-[#c44601] hover:bg-[#c44601]/90",
        },
        {
            title: "Report Summarizer",
            description:
                "Convert and summarize reports of patients into accessible formats",
            icon: <FileSearch className="w-24 h-24 text-white" />,
            path: "/blind/document-summarizer",
            bgColor: "bg-[#5ba300] hover:bg-[#5ba300]/90",
        },
       
       
    ];

    return (
        <div className="h-[calc(100vh-64px)] mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 p-0 h-full group">
                {features.map((feature, index) => (
                    <Card
                        key={index}
                        className={`w-full h-full cursor-pointer transition-all duration-500 
              ${feature.bgColor}
              rounded-none border-0 shadow-2xl
              group-hover:opacity-[0.25] hover:!opacity-100`}
                        onClick={() => router.push(feature.path)}
                        onMouseEnter={() =>
                            handleHover(feature.title, feature.description)}
                        onFocus={() =>
                            handleHover(feature.title, feature.description)}
                    >
                        <CardHeader className="items-center justify-center h-full text-center space-y-8 p-8">
                            {feature.icon}
                            <CardTitle className="text-6xl font-bold text-white">
                                {feature.title}
                            </CardTitle>
                            <CardDescription className="text-3xl font-medium text-white/90 sr-only">
                                {feature.description}
                            </CardDescription>
                        </CardHeader>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default BlindPage;
