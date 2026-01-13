"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FiMenu, FiX, FiUser, FiLogOut, FiAward } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
// import logo from "../assets/images/logo.jpg";
import Company_Logo from "../assets/images/Company_Logo.png";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const { user, loading ,logout} = useAuth();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Don't render navbar until we know the auth state
  if (loading) {
    return (
      <nav className="fixed w-full top-0 z-50 bg-white/95 backdrop-blur-md shadow-lg border-b border-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        </div>
      </nav>
    );
  }

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  const handleLoginClick = () => {
    router.push("/login");
    closeMenu();
  };

  const handleSignupClick = () => {
    router.push("/signup");
    closeMenu();
  };

  const handleSignOut = async () => {
    await logout();
    closeMenu();
    router.push("/");
  };

  // Animation variants
  const navbarVariants = {
    hidden: { y: -100 },
    visible: { y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  const menuVariants = {
    open: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.07,
        delayChildren: 0.2,
        type: "spring",
        stiffness: 400,
        damping: 40,
      },
    },
    closed: {
      opacity: 0,
      y: -20,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
        when: "afterChildren",
      },
    },
  };

  const itemVariants = {
    open: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
    closed: { opacity: 0, y: -20 },
  };
  
  const buttonVariants = {
    hover: { scale: 1.05, boxShadow: "0 5px 15px rgba(99, 102, 241, 0.4)" },
    tap: { scale: 0.95 },
  };

  return (
    <motion.nav
      variants={navbarVariants}
      initial="hidden"
      animate="visible"
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-indigo-100"
          : "bg-gradient-to-r from-indigo-50 to-purple-50"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2"
          >
            <div className="relative h-10 w-10 rounded-lg overflow-hidden shadow-md bg-white p-1.5">
              <Image
                src={Company_Logo}
                alt="Company_Logo"
                fill
                className="object-contain"
              />
            </div>
            <Link
              href="/"
              className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
            >
              SmartPrep AI
            </Link>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            {["/", "/about", "/contact"].map((link, idx) => {
              const label =
                link === "/"
                  ? "Home"
                  : link.slice(1).charAt(0).toUpperCase() + link.slice(2);
              return (
                <motion.div
                  key={idx}
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 0 }}
                >
                  <Link
                    href={link}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      pathname === link
                        ? "text-indigo-700 bg-indigo-50"
                        : "text-gray-600 hover:text-indigo-600 hover:bg-indigo-50/50"
                    }`}
                  >
                    {label}
                  </Link>
                </motion.div>
              );
            })}

            {/* Auth Buttons - Conditionally render based on user */}
            {!user ? (
              <div className="flex items-center ml-2 space-x-2">
                <motion.button
                  onClick={handleLoginClick}
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  className="flex items-center bg-white border border-indigo-200 text-indigo-600 px-4 py-2 rounded-full text-sm font-medium hover:bg-indigo-50 transition-all shadow-sm"
                >
                  <FiUser className="mr-1.5" size={16} /> Login
                </motion.button>

                <motion.button
                  onClick={handleSignupClick}
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  className="flex items-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:shadow-md transition-all"
                >
                  <FiAward className="mr-1.5" size={16} /> Sign Up
                </motion.button>
              </div>
            ) : (
              <>
                <motion.div
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 0 }}
                >
                  <Link
                    href="/dashboard"
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      pathname === "/dashboard"
                        ? "text-indigo-700 bg-indigo-50"
                        : "text-gray-600 hover:text-indigo-600 hover:bg-indigo-50/50"
                    }`}
                  >
                    Dashboard
                  </Link>
                </motion.div>
                <motion.button
                  onClick={handleSignOut}
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  className="flex items-center bg-red-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-red-700 transition-all ml-2"
                >
                  <FiLogOut className="mr-1.5" size={16} /> Sign Out
                </motion.button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:text-indigo-600 hover:bg-indigo-50/50 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="md:hidden bg-white/95 backdrop-blur-md border-t border-indigo-100 shadow-xl"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {["/", "/about", "/contact"].map((link, idx) => {
                const label =
                  link === "/"
                    ? "Home"
                    : link.slice(1).charAt(0).toUpperCase() + link.slice(2);
                return (
                  <motion.div
                    key={idx}
                    variants={itemVariants}
                    className="border-b border-indigo-100/50 pb-2"
                  >
                    <Link
                      href={link}
                      onClick={closeMenu}
                      className="flex items-center px-3 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                    >
                      {label}
                    </Link>
                  </motion.div>
                );
              })}

              {/* Dashboard link for logged-in users */}
              {user && (
                <motion.div variants={itemVariants} className="border-b border-indigo-100/50 pb-2">
                  <Link
                    href="/dashboard"
                    onClick={closeMenu}
                    className="flex items-center px-3 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                  >
                    Dashboard
                  </Link>
                </motion.div>
              )}

              {/* Mobile Auth Buttons */}
              {!user ? (
                <>
                  <motion.div variants={itemVariants}>
                    <button
                      onClick={handleLoginClick}
                      className="flex items-center justify-center w-full bg-white border border-indigo-200 text-indigo-600 px-4 py-3 rounded-lg text-base font-medium hover:bg-indigo-50 transition-colors mt-2"
                    >
                      <FiUser className="mr-2" size={18} /> Login
                    </button>
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <button
                      onClick={handleSignupClick}
                      className="flex items-center justify-center w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-3 rounded-lg text-base font-medium hover:shadow-md transition-all mt-2"
                    >
                      <FiAward className="mr-2" size={18} /> Sign Up
                    </button>
                  </motion.div>
                </>
              ) : (
                <motion.div variants={itemVariants}>
                  <button
                    onClick={() => {
                      handleSignOut();
                      closeMenu();
                    }}
                    className="flex items-center justify-center w-full bg-red-600 text-white px-4 py-3 rounded-lg text-base font-medium hover:bg-red-700 transition-all mt-2"
                  >
                    <FiLogOut className="mr-2" size={18} /> Sign Out
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}