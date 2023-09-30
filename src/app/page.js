"use client";
import Instructions from "@/components/Instructions";
import {
  faArrowDown,
  faLocationArrow,
  faPlay,
  faScroll,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Link as ScrollLink, Element } from "react-scroll";
import { scroller } from "react-scroll";

export default function Home() {
  const session = useSession();
  const [isArrow, setIsArrow] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsArrow(false);
      } else {
        setIsArrow(true);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  console.log(session);

  return (
    <>
      <main className="w-full xs:p-10 px-4 py-8 bg-slate-900">
        {/* {isArrow && (
          <FontAwesomeIcon
            icon={faArrowDown}
            onClick={() =>
              scroller.scrollTo("instructions-section", {
                duration: 1000,
                smooth: true,
              })
            }
            className="cursor-pointer absolute bottom-2 text-2xl text-white animate-bounce right-5 left-1/2"
          />
        )} */}
        {/* main container */}
        <div className="flex lg:flex-row flex-col w-full">
          {/* left side */}
          <div className="lg:w-1/2 w-full flex flex-col justify-between">
            {/* Line and triangle */}
            <div className="flex items-center gap-4">
              <div className="lg:w-1/2 w-full h-6 bg-gradient-to-r from-green-400 to-green-700"></div>
              <FontAwesomeIcon
                icon={faPlay}
                className="text-green-700 text-4xl"
              />
            </div>
            {/* Big title */}
            <h1 className="uppercase text-6xl sm:text-7xl md:text-8xl lg:max-xl:text-7xl text-gradient font-homeTitle mt-10">
              Live your day with music
            </h1>
            {/* sub title */}
            <p className="sm:text-2xl sm:w-3/4 text-lg lg:w-2/3 lg:text-xl w-full tracking-wider text-gray-200 mt-10 font-navLinks">
              Make your day more lively with a variety of music that suits your
              mood, and log your feelings along the way
            </p>
            {/* controls */}
            <div className="flex sm:flex-row flex-col lg:max-xl:flex-col w-full mt-10 gap-3">
              <Link
                href={"/detect"}
                className="sm:w-1/2 lg:max-xl:w-2/3 xl:w-auto"
              >
                <button className="text-slate-300 tracking-wider w-full justify-center bg-green-700 font-homeButtons uppercase text-xl px-5 py-3 flex items-center gap-2 hover:bg-green-800 hover:rounded-lg transition-all duration-300">
                  Find Songs
                  <FontAwesomeIcon icon={faLocationArrow} className="text-xl" />
                </button>
              </Link>
              <Link
                href={"/moodTracker"}
                className="sm:w-1/2 lg:max-xl:w-full xl:w-auto"
              >
                <button className=" bg-slate-600 tracking-wider font-homeButtons w-full justify-center uppercase text-xl px-5 py-3 text-slate-300 hover:bg-slate-700 hover:rounded-lg flex transition-all duration-300 items-center gap-2">
                  Track Moods
                  <FontAwesomeIcon icon={faLocationArrow} className="text-xl" />
                </button>
              </Link>
            </div>
          </div>
          {/* right side */}
          <div className="lg:flex w-1/2 hidden justify-end relative">
            <div className="w-96 h-96 rounded-full bg-gradient-to-t from-green-600 to-green-700 border-8 border-slate-600 absolute top-30 right-1/3 z-0"></div>
            <img
              className="z-10 lg:self-end object-contain"
              src="/headphoneMan.png"
              alt="main with headphones"
            />
          </div>
        </div>
      </main>
      <Element name="instructions-section">
        <Instructions />
      </Element>
    </>
  );
}
