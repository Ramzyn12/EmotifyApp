"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faHeartPulse,
  faLaptopHouse,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { Hidden } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Detect Mood", href: "/detect" },
  { name: "Mood Tracker", href: "/moodTracker" },
];

const Navbar = () => {
  const { data: session } = useSession();

  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const slideIn = {
    hidden: { x: "100%", opacity: 0 },
    visible: { x: "0%", opacity: 1 },
    exit: { x: "100%", opacity: 0 },
  };

  return (
    <section className="bg-slate-900">
      <div className="px-10 py-8 text-white mx-auto flex items-end justify-between">
        <Link href={"/"}>
          <h1 className="text-4xl font-navLogo">Emotify</h1>
        </Link>

        <ul
          className={`lg:flex hidden font-navLinks tracking-wider flex-1 justify-center text-xl list-none space-x-10`}
        >
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                href={link.href}
                key={link.name}
                className={`${
                  isActive ? "underline underline-offset-8 decoration-4" : ""
                } hover:text-slate-400`}
              >
                {link.name}
              </Link>
            );
          })}
        </ul>
        <div className="flex gap-4">
          {!session ? (
            <button
              onClick={(e) => {
                e.preventDefault();
                signIn("spotify");
              }}
              className="p-1 px-3 rounded-lg border-none sm:block hidden bg-green-700 text-lg font-navLinks hover:bg-green-800 transition-all duration-500 border-2 border-slate-800"
            >
              Login
            </button>
          ) : (
            <div className="font-navLinks flex items-center gap-4">
              <p className="text-lg hidden lg:block">{session.user.email}</p>
              <button
                onClick={() => signOut()}
                className="p-1 font-navLinks sm:block hidden border-none px-3 text-lg rounded-lg bg-green-700 hover:bg-green-800 transition-all duration-500 "
              >
                Logout
              </button>
            </div>
          )}
          <button
            className="lg:hidden px-2 py-1"
            onClick={() => setIsOpen(true)}
          >
            <FontAwesomeIcon icon={faBars} className="text-2xl" />
          </button>
        </div>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={slideIn}
              className="fixed font-navLinks z-50 top-0 right-0 h-screen w-full bg-slate-900 text-white"
            >
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-5 right-5"
              >
                <FontAwesomeIcon className="text-2xl" icon={faTimes} />
              </button>
              <ul className="flex flex-col items-center justify-center h-screen space-y-4">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      href={link.href}
                      key={link.name}
                      onClick={() => setIsOpen(false)}
                      className={`${
                        isActive
                          ? "underline underline-offset-8 decoration-4"
                          : ""
                      } hover:text-slate-400`}
                    >
                      {link.name}
                    </Link>
                  );
                })}
                {session && (
                  <>
                    <p className="text-lg mt-10">{session.user.email}</p>
                    <button
                      onClick={() => signOut()}
                      className="p-1 font-navLinks block sm:hidden border-none px-3 text-lg rounded-lg bg-green-700 hover:bg-green-800 transition-all duration-500 "
                    >
                      Logout
                    </button>
                  </>
                )}
                {!session && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      signIn("spotify");
                    }}
                    className="p-1 px-3 rounded-lg border-none  bg-green-700 text-lg font-navLinks hover:bg-green-800 transition-all duration-500 border-2 border-slate-800"
                  >
                    Login
                  </button>
                )}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Navbar;
