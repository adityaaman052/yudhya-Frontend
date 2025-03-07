'use client';

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image";
import { featuresData, howItWorksData, statsData, testimonialsData } from "@/data/landing";
import Link from "next/link";
import HeroSection from "./ui/hero";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900 text-white">
      {/* Hero Section */}
    <HeroSection/>
      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.h2 className="text-4xl font-bold text-center mb-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
            Features Designed for You
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuresData.map((feature, index) => (
              <motion.div key={index} whileHover={{ scale: 1.05 }}>
                <Card className="p-6 bg-white/50 backdrop-blur-md">
                  <CardContent className="space-y-4 pt-4">
                    {feature.icon}
                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                    <p className="text-black-300">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-black/40">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {howItWorksData.map((step, index) => (
              <motion.div key={index} whileHover={{ scale: 1.1 }}>
                <div className="text-center p-6 bg-black/50 rounded-xl shadow-lg">
                  <div className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
                  <p className="text-gray-300">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-black-600">
        <div className="container mx-auto px-6 text-center">
          <motion.h2 className="text-4xl font-bold text-white mb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
            Ready to Take care of Your patients as a Dentist?
          </motion.h2>
          <p className="text-white mb-8 max-w-2xl mx-auto">
            Join thousands of dentists who are already managing their patients smarter.
          </p>
          <Link href="/">
            <motion.div whileHover={{ scale: 1.1 }}>
              <Button className="bg-white text-pink-600 hover:bg-gray-200 px-6 py-3 text-lg rounded-lg shadow-lg">
                Start Free Trial
              </Button>
            </motion.div>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage; 
