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
      <h1 className="text-2xl text-center mb-4">{formattedDate}</h1>
      <div className="bg-green-600 p-5 rounded-lg lg:w-1/2 w-full sm:w-4/5 md:w-2/3 h-2/3 lg:h-3/4 flex flex-col">
        <div className="flex flex-row h-full">
          {/* side bar */}
          <div className="sm:w-1/4 w-1/5  bg-slate-600 h-full flex flex-col">
            <div
              onClick={() => setIsNotes(true)}
              className={`p-2 h-1/2 cursor-pointer flex items-center hover:bg-slate-700 transition-all ease-in-out duration-500 justify-center border-b-2 border-b-gray-500 ${
                isNotes ? "bg-slate-700" : ""
              }`}
            >
              Notes
            </div>
            <div
              onClick={() => setIsNotes(false)}
              className={`p-2 h-1/2 cursor-pointer hover:bg-slate-700 transition-all ease-in-out duration-500 flex items-center justify-center ${
                !isNotes ? "bg-slate-700" : ""
              }`}
            >
              Tracks
            </div>
          </div>
          {/* main content */}
          <div className="w-4/5 lg:w-3/4 bg-slate-800 p-4 overflow-y-scroll h-full">
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
      <button
        className="text-white flex items-center justify-center absolute top-5 right-5 bg-red-600 w-10 h-10 rounded-full hover:bg-red-700"
        onClick={() => props.closeModal()}
      >
        <FontAwesomeIcon icon={faClose} className="text-2xl" />
      </button>
    </div>
  );
};

export default PlaylistModal;
