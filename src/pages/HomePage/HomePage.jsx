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
      <LandingPage />
     
    </div>
  );
};

export default HomePage;
