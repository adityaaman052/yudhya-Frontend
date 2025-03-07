"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  CalendarIcon,
  BotIcon,
  Hammer,
} from "lucide-react";
import { useRouter } from "next/navigation";
import LandingPage from "@/components/LandingPage";

const HomePage = () => {
  const router = useRouter();

  return (
    <div>
      <div
        className="flex flex-col items-center justify-center p-4 w-full"
        style={{
          minHeight: "calc(100vh - 4rem)",
          background:
            "linear-gradient(to bottom, #1a1a2e, #16213e, #0f3460)",
          color: "white",
        }}
      >
        <div className="text-center space-y-6">
          {/* Gradient title text */}
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-purple-400 via-pink-500 to-blue-400 text-transparent bg-clip-text">
            Dantika - An AI Powered App for Dentists
          </h1>
          <p className="text-gray-300">
            Select the type of assistance you need
          </p>

          {/* Cards Section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* General Assistance Card */}
            <Card className="bg-blue-950 text-white shadow-lg shadow-blue-500/50">
              <CardContent className="flex flex-col items-center p-6">
                <Hammer className="w-10 h-10 text-blue-400" />
                <h3 className="text-lg font-semibold mt-3">
                  General Assistance
                </h3>
                <p className="text-gray-300 text-sm text-center mt-1">
                  Get AI-powered guidance for dental procedures and workflow management.
                </p>
                <Button
                  size="lg"
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => router.push("/blind")}
                >
                  Get Assistance
                </Button>
              </CardContent>
            </Card>

            {/* Chatbot Card */}
            <Card className="bg-purple-950 text-white shadow-lg shadow-purple-500/50">
              <CardContent className="flex flex-col items-center p-6">
                <BotIcon className="w-10 h-10 text-purple-400" />
                <h3 className="text-lg font-semibold mt-3">
                  Chatbot
                </h3>
                <p className="text-gray-300 text-sm text-center mt-1">
                  Interact with our AI chatbot for instant dental-related queries.
                </p>
                <Button
                  size="lg"
                  className="mt-4 bg-purple-600 hover:bg-purple-700 text-white"
                  onClick={() => router.push("/chatbot")}
                >
                  Open Chatbot
                </Button>
              </CardContent>
            </Card>

            {/* Schedule Card */}
            <Card className="bg-pink-950 text-white shadow-lg shadow-pink-500/50">
              <CardContent className="flex flex-col items-center p-6">
                <CalendarIcon className="w-10 h-10 text-pink-400" />
                <h3 className="text-lg font-semibold mt-3">
                  Schedule
                </h3>
                <p className="text-gray-300 text-sm text-center mt-1">
                  Manage appointments with AI-powered scheduling suggestions.
                </p>
                <Button
                  size="lg"
                  className="mt-4 bg-pink-600 hover:bg-pink-700 text-white"
                  onClick={() => router.push("/schedule")}
                >
                  Manage Schedule
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
