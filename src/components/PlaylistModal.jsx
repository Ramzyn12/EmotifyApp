import React, { useState } from "react";
import Notes from "./Notes";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader

import Tracks from "./Tracks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";

const formatDate = (dateStr) => {
  const dateObj = new Date(dateStr);
  const day = dateObj.getDate();
  const month = dateObj.getMonth();
  const year = dateObj.getFullYear();
  const weekdayName = dateObj.toLocaleString("default", { weekday: "long" });
  const monthName = dateObj.toLocaleString("default", { month: "long" });

  let suffix = "";
  if (day >= 4 && day <= 20) {
    suffix = "th";
  } else if (day >= 24 && day <= 30) {
    suffix = "th";
  } else {
    const suffixes = ["st", "nd", "rd"];
    suffix = suffixes[(day % 10) - 1];
  }

  return `${weekdayName} ${day}${suffix} ${monthName} ${year}`;
};

const PlaylistModal = (props) => {
  const formattedDate = formatDate(props.date);
  console.log(props.tracksInfo);
  const [isNotes, setIsNotes] = useState(true);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      props.closeModal();
    }
  };

  return (
    <div
      className="fixed flex flex-col top-0 right-0 left-0 bottom-0 bg-black bg-opacity-90  items-center justify-center z-20"
      onClick={handleBackdropClick} // Add onClick handler here
    >
      {/* modal content container */}
      <div className="   lg:w-1/2 overflow-hidden w-full max-w-2xl  sm:w-4/5 md:w-2/3 sm:h-2/3 h-full lg:h-3/4 flex flex-col">
        <div className="flex rounded-lg overflow-hidden xs:flex-row flex-col h-full">
          {/* side bar */}
          <div className="sm:w-1/4 xs:w-1/5 w-full  bg-slate-600 xs:h-full flex xs:flex-col">
            <div
              onClick={() => setIsNotes(true)}
              className={`p-2 w-1/2 xs:h-1/2 xs:w-full cursor-pointer flex items-center hover:bg-slate-700 transition-all ease-in-out duration-500 justify-center border-b-2 border-b-gray-500 ${
                isNotes ? "bg-slate-700" : ""
              }`}
            >
              Notes
            </div>
            <div
              onClick={() => setIsNotes(false)}
              className={`p-2 w-1/2 xs:h-1/2 xs:w-full cursor-pointer hover:bg-slate-700 transition-all ease-in-out duration-500 flex items-center justify-center ${
                !isNotes ? "bg-slate-700" : ""
              }`}
            >
              Tracks
            </div>
          </div>
          {/* main content */}
          <div className="xs:w-4/5 w-full lg:w-3/4 xs:relative bg-slate-800 p-6 overflow-y-scroll h-full">
            <button
              className="text-white flex items-center justify-center absolute top-2 right-2 "
              onClick={() => props.closeModal()}
            >
              <FontAwesomeIcon icon={faClose} className="text-2xl" />
            </button>
            <h1 className="text-2xl text-center mb-4">{formattedDate}</h1>

            {isNotes ? (
              <Notes
                emotionsMap={props.emotionsMap}
                notesInfo={props.notesInfo}
              />
            ) : (
              <Tracks
                emotionsMap={props.emotionsMap}
                tracksInfo={props.tracksInfo}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaylistModal;
