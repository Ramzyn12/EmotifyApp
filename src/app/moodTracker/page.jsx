"use client";
import React from "react";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { doc, getDocs, collection } from "firebase/firestore";
import { db } from "../firebase";
import FullCalendar from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import PlaylistModal from "@/components/PlaylistModal";

const emotionColourMap = {
  happy: ["bg-green-400", "text-green-400"],
  sad: ["bg-purple-800", "text-purple-800"],
  neutral: ["bg-blue-500", "text-blue-500"],
  surprised: ["bg-yellow-400", "text-yellow-400"],
  disgusted: ["bg-stone-600", "text-stone-600"],
  fearful: ["bg-yellow-400", "text-yellow-400"],
  angry: ["bg-red-500", "text-red-500"],
};

const findMostFrequentEmotion = (emotionsForTheDay) => {
  const emotionCounts = {};

  emotionsForTheDay.forEach((emotion) => {
    emotionCounts[emotion.mood] = (emotionCounts[emotion.mood] || 0) + 1;
  });

  let mostFrequentEmotion = null;
  let maxCount = 0;

  for (const [emotion, count] of Object.entries(emotionCounts)) {
    if (count > maxCount) {
      mostFrequentEmotion = emotion;
      maxCount = count;
    }
  }

  return mostFrequentEmotion;
};

// /MAYBE CALL TRACKER PAGE
const Page = () => {
  const { data: session, status } = useSession();

  const [showModal, setShowModal] = useState(false);

  const [tracks, setTracks] = useState([]);
  const [emotions, setEmotions] = useState([]);
  const [notes, setNotes] = useState([]);

  const [selectedNotes, setSelectedNotes] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTracks, setSelectedTracks] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (session && session.user && session.user.email) {
        const userDocRef = doc(db, "users", session.user.email);

        // Fetching tracks
        const trackSnapshot = await getDocs(
          collection(userDocRef, "likedTracks")
        );
        const fetchedTracks = trackSnapshot.docs.map((doc) => doc.data());

        // Fetching emotions
        const emotionSnapshot = await getDocs(
          collection(userDocRef, "emotions")
        );
        const fetchedEmotions = emotionSnapshot.docs.map((doc) => doc.data());

        const notesSnapshot = await getDocs(collection(userDocRef, "notes"));
        const fetchedNotes = notesSnapshot.docs.map((doc) => doc.data());

        setTracks(fetchedTracks);
        setEmotions(fetchedEmotions);
        setNotes(fetchedNotes);
      }
    };

    if (status === "authenticated") {
      fetchData();
    }
  }, [session, status]);

  const handleDateClick = (info) => {
    console.log(info);

    const clickedDate = info.dateStr; // YYYY-MM-DD format
    setSelectedDate(clickedDate);

    const tracksForTheDay = tracks.filter(
      (track) => track.date === clickedDate
    );
    setSelectedTracks(tracksForTheDay); // Using setSelectedTracks here

    const notesForTheDay = notes.filter((note) => note.date === clickedDate);
    setSelectedNotes(notesForTheDay);

    setShowModal(true);
  };

  const renderDayContent = (eventInfo) => {
    const date = new Date(eventInfo.date);
    date.setDate(date.getDate() + 1);
    const adjustedDateStr = date.toISOString().split("T")[0];

    const emotionsForTheDay = emotions.filter(
      (emotion) => emotion.date === adjustedDateStr
    );

    console.log("Before sorting:", emotionsForTheDay);

    emotionsForTheDay.sort((a, b) => {
      if (a.time && b.time) {
        return a.time.localeCompare(b.time);
      }
      return 0;
    });

    console.log("After sorting:", emotionsForTheDay);

    const emotionsTimeMap = {};

    emotionsForTheDay.forEach((emotion) => {
      const key = `${emotion.mood}-${emotion.time}`;
      if (!emotionsTimeMap[key]) {
        emotionsTimeMap[key] = {
          mood: emotion.mood,
          time: emotion.time,
        };
      }
    });

    const groupedEmotionsAndTimes = Object.values(emotionsTimeMap);

    const mostFrequentEmotion = findMostFrequentEmotion(emotionsForTheDay);
    const cellColor = mostFrequentEmotion
      ? emotionColourMap[mostFrequentEmotion][0]
      : "";

    return (
      <>
        <div
          className={`absolute ${cellColor} lg:bg-inherit z-20 cursor-pointer hover:bg-blue-200 transition duration-300 p-1 left-0 top-0 bottom-0 right-0 h-full w-full`}
        >
          <div className="text-right text-white text-xs">
            {eventInfo.dayNumberText}
          </div>{" "}
          {/* Mood and Time Section */}
          <div className="mt-2 hidden lg:block">
            {groupedEmotionsAndTimes.map((item, i) => (
              <div
                className={`flex my-1 ${
                  emotionColourMap[item.mood][0]
                } rounded-md px-2 py-1 w-full lg:text-md justify-between`}
                key={i}
              >
                <span className="capitalize">{item.mood}</span>
                <span> {item.time}</span>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      <div className="min-h-screen text-white w-full xs:p-10 px-4 py-10 bg-slate-900">
        {
          <>
            <h1 className="w-full text-center text-slate-200 font-homeTitle text-2xl md:text-3xl lg:text-4xl uppercase lg:mt-10">
              Keep track of your moods and thoughts!{" "}
            </h1>
            <p className="text-2xl mb-10 text-slate-400 font-navLinks text-center mt-8">
              Open any calender day to see your notes and liked tracks for the
              day!
            </p>
          </>
        }
        {!session && (
          <div className="w-full sm:w-2/3 md:w-1/2 mb-6 tracking-wide mx-auto flex flex-col justify-center bg-slate-950 p-6 gap-2 rounded-2xl text-white font-navLinks text-base sm:text-lg lg:text-xl mt-10 ">
            <p>
              Please use the following login to experience the full features of the mood tracker
            </p>
            <p>tester123spotify@gmail.com</p>
            <p>Password: Tester123</p>
          </div>
        )}
        {
          <div className="">
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              dateClick={handleDateClick}
              dayCellContent={renderDayContent}
              dayHeaderClassNames="text-white"
            />
          </div>
        }

        {showModal && (
          <PlaylistModal
            emotionsMap={emotionColourMap}
            notesInfo={selectedNotes}
            tracksInfo={selectedTracks}
            date={selectedDate}
            closeModal={() => setShowModal(false)}
          />
        )}
      </div>
    </>
  );
};

export default Page;
