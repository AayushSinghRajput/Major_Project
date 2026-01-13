"use client";

import { useRouter } from "next/router";
import Lottie from "lottie-react";
import { motion } from "framer-motion";
import chatbotAnimation from "../animations/chatbot.json";
import TopViewedBooks from '../components/topviewedbooks';
import TopPerformers from '../components/topperformers';
import About from './about';
import Contact from './contact';

export default function Home() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push("/signup");
  };

  // Animation variants
  const textVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8 },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { delay: 0.5, duration: 0.5 },
    },
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 },
    },
    tap: { scale: 0.95 },
  };

  const imageVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, delay: 0.2 },
    },
  };

  return (
    <>
      <section className="flex flex-col md:flex-row items-center max-w-7xl mx-auto px-6 py-20 gap-12">
        <motion.div
          className="md:w-1/2"
          initial="hidden"
          animate="visible"
          variants={textVariants}
        >
          <motion.h2
            className="text-4xl font-bold mb-6"
            variants={textVariants}
          >
            Welcome to SmartPrep AI
          </motion.h2>
          <motion.p
            className="text-lg text-gray-700 leading-relaxed mb-6"
            variants={textVariants}
            transition={{ delay: 0.2 }}
          >
            SmartPrep AI empowers students with AI tools to study smarter, not
            harder. From flashcards to note-taking, we simplify learning using
            modern AI.
          </motion.p>
          <motion.button
            onClick={handleGetStarted}
            className="mt-8 bg-indigo-600 text-white px-6 py-3 rounded-full hover:bg-indigo-700 transition"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            Get Started
          </motion.button>
        </motion.div>

        <motion.div
          className="md:w-1/2 aspect-square"
          initial="hidden"
          animate="visible"
          variants={imageVariants}
        >
          <Lottie
            animationData={chatbotAnimation}
            loop={true}
            style={{ width: "100%", height: "100%" }}
          />
        </motion.div>
      </section>

      <section
        id="topviewbooks"
        className="py-16 bg-gradient-to-r from-indigo-50 to-blue-50"
      >
        <TopViewedBooks />
      </section>

      <section
        id="topperformers"
        className="py-16 bg-gradient-to-r from-indigo-50 to-blue-50"
      >
        <TopPerformers />
      </section>

      <About/>
      <Contact/>
    </>
  );
}