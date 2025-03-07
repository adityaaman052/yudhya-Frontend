'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button"
import { Calendar, Home, Info, PhoneCall } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const Header = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 w-full bg-gradient-to-br from-blue-900 via-black to-purple-900 backdrop-blur-lg z-50 border-b border-purple-500 shadow-lg"
    >
      <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo with animation */}
        <motion.div whileHover={{ scale: 1.1 }}>
          <Link href="/">
            <Image
              src="/dantika-logo.png"
              alt="Dantika Logo"
              width={180}
              height={60}
              className="h-12 w-auto object-contain"
            />
          </Link>
        </motion.div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-8 text-white">
          <Link href="/" className="hover:text-purple-400 transition-all flex items-center gap-1">
            <Home size={18} />
            Home
          </Link>
          <Link href="/servic" className="hover:text-purple-400 transition-all flex items-center gap-1">
            <Info size={18} />
            Services
          </Link>
          <Link href="/appointments" className="hover:text-purple-400 transition-all flex items-center gap-1">
            <Calendar size={18} />
            Appointments
          </Link>
          <Link href="/contact" className="hover:text-purple-400 transition-all flex items-center gap-1">
            <PhoneCall size={18} />
            Contact
          </Link>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-4">
          <Link href="/schedule">
            <Button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white flex items-center gap-2 hover:scale-105 transition-all">
              <Calendar size={18} />
              <span className="hidden md:inline">Check Notifications</span>
            </Button>
          </Link>
        </div>
      </nav>
    </motion.header>
  );
};

export default Header;
