"use client";

import { motion } from "framer-motion";
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaBookOpen,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-800 text-white py-12 mt-0">
      {/* Background Decoration */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,white,transparent)]"></div>

      {/* Content Container */}
      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <FaBookOpen className="text-3xl text-yellow-300" />
              <h2 className="text-2xl font-bold">SmartPrep AI</h2>
            </div>
            <p className="text-gray-200">
              Personalized AI-powered learning platform for +2 Science students.
              Learn smarter, revise faster, and succeed with SmartPrep AI.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {["Home", "About", "Features", "Contact"].map((link, i) => (
                <li key={i}>
                  <a
                    href={`#${link.toLowerCase()}`}
                    className="hover:text-yellow-300 transition"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Resources */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <h3 className="text-xl font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-yellow-300 transition">
                  Entrance Prep
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-yellow-300 transition">
                  Study Materials
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-yellow-300 transition">
                  AI Quiz Generator
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-yellow-300 transition">
                  Student Community
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Socials */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
            <div className="flex gap-4 text-2xl">
              <a href="#" className="hover:text-yellow-300 transition">
                <FaFacebook />
              </a>
              <a href="#" className="hover:text-yellow-300 transition">
                <FaInstagram />
              </a>
              <a href="#" className="hover:text-yellow-300 transition">
                <FaTwitter />
              </a>
              <a href="#" className="hover:text-yellow-300 transition">
                <FaLinkedin />
              </a>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-12 border-t border-gray-600 pt-6 text-center text-sm text-gray-300"
        >
          © {new Date().getFullYear()} SmartPrep AI. All rights reserved. | Built
          with ❤️ for learners.
        </motion.div>
      </div>
    </footer>
  );
}
