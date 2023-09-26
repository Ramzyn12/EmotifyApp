import React from "react";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import { motion } from "framer-motion";

import "react-vertical-timeline-component/style.min.css";

const Instructions = () => {
  return (
    <div className="bg-slate-900 px-10 lg:py-32 py-10">
      <motion.div className="text-center">
        <p className="text-slate-400 tracking-wider uppercase text-2xl font-homeTitle">
          How to make the most of emotify
        </p>
        <h2 className="lg:text-5xl text-4xl text-slate-200 mt-8 uppercase font-homeTitle">
          Get started in 3 easy steps
        </h2>
      </motion.div>
      <div className="mt-20 flex flex-col">
        <VerticalTimeline>
          <VerticalTimelineElement
            icon={
              <div>
                <img src="/number-1.png" />
              </div>
            }
            contentStyle={{
              background: "rgb(203 213 225)",
              color: "rgb(15 23 42)",
            }}
            contentArrowStyle={{ borderRight: "7px solid rgb(203 213 225)" }}
          >
            <h3 className="font-navLinks text-2xl font-bold ">Step One</h3>
            <p className="">
              Visit the detect page and follow the instructions to detect your
              very first emotion! You can even add extra customization to get
              the perfect recommendation
            </p>
          </VerticalTimelineElement>
          <VerticalTimelineElement
            icon={
              <div>
                <img src="/number-2.png" />
              </div>
            }
            contentStyle={{
              background: "rgb(203 213 225)",
              color: "rgb(15 23 42)",
            }}
            contentArrowStyle={{ borderRight: "7px solid rgb(203 213 225)" }}
          >
            <h3 className="font-navLinks text-2xl font-bold ">Step Two</h3>
            <p className="">
              Add a note about your thoughts and feelings to keep a
              journal of your mood throughout. You can even like tracks to save
              them to your journal if you ever want to revisit them
            </p>
          </VerticalTimelineElement>
          <VerticalTimelineElement
            icon={
              <div>
                <img src="/number-3.png" />
              </div>
            }
            contentStyle={{
              background: "rgb(203 213 225)",
              color: "rgb(15 23 42)",
            }}
            contentArrowStyle={{ borderRight: "7px solid rgb(203 213 225)" }}
          >
            <h3 className="font-navLinks text-2xl font-bold ">Step Three</h3>
            <p className="text-2xl">
              Visit the journal page to get a calender overview of all your
              emotions. Click on a date to get a rundown of your mood, notes
              and liked songs that day!
            </p>
          </VerticalTimelineElement>
        </VerticalTimeline>
      </div>
    </div>
  );
};

export default Instructions;
