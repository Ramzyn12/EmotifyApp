"use client";
import React, { useEffect, useReducer, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import Webcam from "react-webcam";
import { useSession } from "next-auth/react";
import { db } from "../firebase";
import Typewriter from "typewriter-effect";
import { doc, addDoc, collection } from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-regular-svg-icons";
import {
  fa1,
  fa2,
  fa3,
  faFaceSmile,
  faFaceAngry,
  faFaceSurprise,
  faFaceSadTear,
  faFaceMeh,
  faNotesMedical,
  faGear,
} from "@fortawesome/free-solid-svg-icons";
// import { motion } from "framer-motion";
// import { Slider } from "@mui/material";
import { scroller } from "react-scroll";
import NotesModal from "@/components/NotesModal";
import CustomiseModal from "@/components/CustomiseModal";
import { flushSync } from "react-dom";

const Page = () => {
  const webcamRef = useRef(null);
  const { data: session } = useSession();
  const [recommendations, setRecommendations] = useState([]);
  const [isWebcamReady, setWebcamReady] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState("");
  const [saveCurrEmotion, setSaveCurrEmotion] = useState(true);
  const [likedTracks, setLikedTracks] = useState({});
  const [emotionError, setEmotionError] = useState(null);
  const [fetchError, setFetchError] = useState(null);
  const [note, setNote] = useState("");
  const [notesError, setNotesError] = useState("");
  const [showNotes, setShowNotes] = useState(false);
  const [showCustomisation, setShowCustomisation] = useState(false);

  const [useTopTracks, setUseTopTracks] = useState(false);
  const [tempo, setTempo] = useState(0);
  const [isTempoEnabled, setIsTempoEnabled] = useState(false);
  const [danceability, setDanceability] = useState(0);
  const [isDanceabilityEnabled, setIsDanceabilityEnabled] = useState(false);
  const [maxDuration, setMaxDuration] = useState(0); // in seconds
  const [isMaxDurationEnabled, setIsMaxDurationEnabled] = useState(false);

  // This function will be called once the webcam is ready

  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
      await faceapi.nets.faceExpressionNet.loadFromUri("/models");
      await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
    };

    loadModels();
  }, []);

  useEffect(() => {
    // Check if the video element is available
    if (webcamRef.current && webcamRef.current.video) {
      const video = webcamRef.current.video;

      // Set an event listener for the loadeddata event
      video.onloadeddata = () => {
        setWebcamReady(true);
      };
    }
  }, [webcamRef]);

  useEffect(() => {
    if (isFetching) {
      scroller.scrollTo("emotion-section", {
        duration: 800,
        delay: 0,
        smooth: "easeInOutQuart",
      });
    }
  }, [isFetching]);

  const detectEmotions = async () => {
    if (webcamRef.current) {
      const detections = await faceapi
        .detectAllFaces(
          webcamRef.current.video,
          new faceapi.TinyFaceDetectorOptions()
        )
        .withFaceExpressions();

      if (detections && detections.length > 0) {
        const sortedExpressions = Object.entries(detections[0].expressions)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 2);

        setCurrentEmotion(sortedExpressions[0][0]);
        if (saveCurrEmotion) {
          await saveEmotion(sortedExpressions[0][0]);
        }
        setEmotionError(null); // Reset the error

        return sortedExpressions;
      } else {
        setEmotionError("No emotion detected"); // Set an error message
      }
    }
  };

  const getTopArtists = async (session) => {
    try {
      const topArtistsResponse = await fetch(
        `https://api.spotify.com/v1/me/top/artists?limit=20`,
        {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        }
      );

      if (topArtistsResponse.status === 403) {
        throw new Error(
          "You are not a registered user, please logout and see mood Tracker page for next steps"
        );
      }

      if (topArtistsResponse.status === 504) {
        throw new Error(
          "The server took too long to respond. Please try again later."
        );
      }

      if (topArtistsResponse.ok) {
        return await topArtistsResponse.json();
      } else {
        if (topArtistsResponse.status === 401) {
          throw new Error(
            "You are not authorized anymore. Please Log out and then in again."
          );
        } else {
          throw new Error(
            `Failed to get recommendations. Please try again later`
          );
        }
      }
    } catch (error) {
      throw error;
    }
  };

  const fetchRecommendations = async (session, emotion, seedString) => {
    let targetValence = 0.5; // Default to Neutral
    let targetEnergy;
    switch (emotion) {
      //NEED TO GET RID OF =happy if i have enough from the artists
      case "happy":
        targetValence = 0.8;
        seedString += "&seed_genres=happy";
        break;
      case "sad":
        targetValence = 0.2;
        seedString += "&seed_genres=sad";
        break;
      case "fearful":
        seedString += "&seed_genres=rock";
        break;
      case "angry":
        seedString += "&seed_genres=metal";
        targetValence = 0.2;
        targetEnergy = 0.8;
        break;
      case "disgusted":
        seedString += "&seed_genres=death-metal";
        targetValence = 0.2;
        targetEnergy = 0.2;

        break;
      case "surprised":
        seedString += "&seed_genres=dance";
        targetEnergy = 0.8;
        break;
      case "neutral":
        seedString += "&seed_genres=pop";
        break;
      default:
        console.log(emotion, `Sorry, we are out of emotions`);
    }

    const params = new URLSearchParams({
      limit: 99,
      target_valence: targetValence,
    });

    if (targetEnergy) {
      params.append("target_energy", targetEnergy);
    }

    if (isTempoEnabled && tempo !== null) {
      params.append("target_tempo", tempo);
    }

    if (isDanceabilityEnabled && danceability !== null) {
      params.append("target_danceability", danceability / 100);
    }

    if (isMaxDurationEnabled && maxDuration !== null) {
      params.append("max_duration_ms", maxDuration * 1000);
    }

    const url = `https://api.spotify.com/v1/recommendations?${seedString}&${params.toString()}&min_duration_ms=120000`;
    console.log(url);

    const recommendationsResponse = await fetch(url, {
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
      },
    });

    if (recommendationsResponse.status === 403) {
      throw new Error(
        "You are not a registered user, please logout and see mood Tracker page for next steps"
      );
    }

    if (recommendationsResponse.status === 504) {
      throw new Error(
        "The server took too long to respond. Please try again later."
      );
    }

    if (recommendationsResponse.ok) {
      const recommendationsData = await recommendationsResponse.json();
      const tracks = recommendationsData.tracks;

      if (tracks && tracks.length > 0) {
        const shuffledTracks = tracks
          .sort(() => Math.random() - 0.5)
          .slice(0, 3);
        setRecommendations(shuffledTracks);
      } else {
        throw new Error("Not Enough Tracks, Please Increase Max Duration");
      }
    } else {
      throw new Error(`Failed to get recommendations. Please try again later`);
    }
  };

  const getPlaylist = async () => {
    if (!isWebcamReady) {
      setFetchError("Webcam not ready yet");
      return; // Return early to prevent further execution
    }

    flushSync(() => {
      setIsFetching(true);
    });
    setFetchError(null);

    const emotionResults = await detectEmotions();

    if (!emotionResults) {
      setIsFetching(false);
      return;
    }

    if (!session || !session.accessToken) {
      setIsFetching(false);
      setFetchError("Please Login to use the recommended songs feature");
      return;
    }

    const emotion = emotionResults[0][0];

    // Step 2: Get User's Top Artists
    let topArtistsData;
    let seedString = "";

    // remove true
    if (useTopTracks) {
      try {
        topArtistsData = await getTopArtists(session);
        // console.log(topArtistsData, "top data");
      } catch (error) {
        setFetchError(error.message);
        setIsFetching(false);
        return;
      }

      if (topArtistsData.items && topArtistsData.items.length > 0) {
        const topArtistIds = topArtistsData.items.map((artist) => artist.id);
        const numSlices = 4;
        const startIndex =
          topArtistIds.length <= numSlices
            ? 0
            : Math.floor(Math.random() * (topArtistIds.length - numSlices));
        const randomSliceOfArtists = topArtistIds
          .slice(startIndex, startIndex + numSlices)
          .join(",");
        seedString = `&seed_artists=${randomSliceOfArtists}`;
      } else {
        seedString = "&seed_genres=pop";
      }
    }

    try {
      await fetchRecommendations(session, emotion, seedString);
    } catch (error) {
      setFetchError(error.message);
      setIsFetching(false);
      return;
    }

    setIsFetching(false);
  };

  const handleLikeClick = async (trackObject) => {
    if (!session) {
      return;
    }

    setLikedTracks((prevState) => ({
      ...prevState,
      [trackObject.name]: !prevState[trackObject.name],
    }));

    const now = new Date();
    const localTimeHours = String(now.getHours()).padStart(2, "0");
    const localTimeMinutes = String(now.getMinutes()).padStart(2, "0");
    const currentTime = `${localTimeHours}:${localTimeMinutes}`; // HH:MM format

    const currentDate = now.toISOString().split("T")[0]; // YYYY-MM-DD format

    const trackData = {
      trackName: trackObject.name,
      trackArtist: trackObject.artists[0].name,
      date: currentDate,
      url: trackObject.external_urls.spotify,
      mood: currentEmotion,
      imageSrc: trackObject.album.images[1].url,
      time: currentTime, // Storing the time
      // add other relevant data as needed
    };

    try {
      // Check if a document for this user already exists
      const userDocRef = doc(db, "users", session.user.email);
      await addDoc(collection(userDocRef, "likedTracks"), trackData);
    } catch (error) {
      //add real error handle 
      console.error("Error saving liked track:", error);
    }
  };

  const handleSaveNote = async () => {
    if (!session) {
      setNotesError("Please Login to save a note");
      return;
    }

    const now = new Date();
    const localTimeHours = String(now.getHours()).padStart(2, "0");
    const localTimeMinutes = String(now.getMinutes()).padStart(2, "0");
    const currentTime = `${localTimeHours}:${localTimeMinutes}`; // HH:MM format

    const currentDate = now.toISOString().split("T")[0]; // YYYY-MM-DD format

    const noteData = {
      date: currentDate,
      time: currentTime,
      mood: currentEmotion || "No Emotion",
      note: note, // The note content
    };

    try {
      const userDocRef = doc(db, "users", session.user.email);
      await addDoc(collection(userDocRef, "notes"), noteData);
      console.log("Note saved successfully!");
    } catch (error) {
      //add real error handling
      console.error("Error saving note:", error);
    }
    setNote("");
  };

  const saveEmotion = async (detectedEmotion) => {
    if (!session) {
      console.error("User is not authenticated.");
      return;
    }

    const now = new Date();
    const localTimeHours = String(now.getHours()).padStart(2, "0");
    const localTimeMinutes = String(now.getMinutes()).padStart(2, "0");
    const currentTime = `${localTimeHours}:${localTimeMinutes}`; // HH:MM format

    const currentDate = now.toISOString().split("T")[0]; // YYYY-MM-DD format

    const emotionData = {
      mood: detectedEmotion,
      time: currentTime,
      date: currentDate,
    };

    try {
      const userDocRef = doc(db, "users", session.user.email);
      await addDoc(collection(userDocRef, "emotions"), emotionData);
      console.log("Emotion saved successfully!");
    } catch (error) {
      // add error handling real
      console.error("Error saving emotion:", error);
    }
  };

  const emotionColourMap = {
    happy: ["bg-green-400", "text-green-400"],
    sad: ["bg-purple-800", "text-purple-800"],
    neutral: ["bg-blue-500", "text-blue-500"],
    surprised: ["bg-yellow-400", "text-yellow-400"],
    disgusted: ["bg-stone-600", "text-stone-600"],
    fearful: ["bg-yellow-400", "text-yellow-400"],
    angry: ["bg-red-500", "text-red-500"],
  };

  const emotionIcon = {
    happy: faFaceSmile,
    sad: faFaceSadTear,
    neutral: faFaceMeh,
    surprised: faFaceSurprise,
    angry: faFaceAngry,
    disgusted: faFaceSurprise,
    fearful: faFaceSurprise,
  };

  const buttonVariants = {
    initial: { x: "-100" },
    enter: { x: 0 },
  };

  const buttonVariants2 = {
    initial: { x: "100" },
    enter: { x: 0 },
  };

  const notesVariants = {
    initial: { y: "-100%" },
    enter: { y: 0 },
  };

  return (
    <div className="min-h-screen pb-9 w-full px-4 bg-slate-900">
      {/* change font */}
      <h1
        className={`text-2xl lg:text-4xl uppercase font-homeTitle text-center text-white pt-10`}
      >
        Lets Tune Into Your Emotions!
      </h1>

      <div className="w-full flex justify-center">
        <div className="flex xl:w-full xl:flex-row my-10 flex-col  items-start justify-around">
          <p className="text-slate-400 flex xs:items-center items-start justify-center font-sans text-xl sm:text-2xl mt-8 text-center ">
            <FontAwesomeIcon
              className="border-2 rounded-lg border-slate-400 px-3 py-2"
              icon={fa1}
            />
            <span className="ml-3">Position Your Face In The Centre.</span>
          </p>
          <div className="text-slate-400 flex xs:items-center items-start justify-center font-sans text-xl sm:text-2xl mt-8 text-center ">
            <FontAwesomeIcon
              className="border-2 rounded-lg border-slate-400 px-3 py-2"
              icon={fa2}
            />
            <span className="ml-3 flex  gap-1 items-center justify-center">
              Let Your Emotions Flood Out.
              <Typewriter
                options={{
                  cursor: "",
                  strings: [
                    "Happy?",
                    "Sad?",
                    "Surprised?",
                    "Angry?",
                    "Neutral?",
                  ],
                  autoStart: true,
                  pauseFor: 2000,
                  loop: false,
                }}
              />
            </span>
          </div>
          <p className="text-slate-400 flex xs:items-center items-start justify-center font-sans text-xl sm:text-2xl mt-8 text-center">
            <FontAwesomeIcon
              className="border-2 border-slate-400 rounded-lg px-3 py-2"
              icon={fa3}
            />
            <span className="ml-3">Click &apos;Go&apos; When Ready.</span>
          </p>
        </div>
      </div>
      {/* save emotion? */}

      <div className="flex flex-col mx-auto w-full items-center justify-center">
        {/* Webcam Section */}
        <div className="relative rounded-xl bg-slate-700 p-4 py-0 mt-10 flex flex-col  items-center justify-center w-full">
          <div
            className="absolute inset-0 bg-left bg-repeat bg-contain grayscale bg-slate-800 bg-opacity-10 z-0"
            style={{
              backgroundImage: "url(/playfulBackground.png)",
              backgroundSize: "50%",
            }}
          ></div>

          {showNotes && (
            <NotesModal
              notesVariants={notesVariants}
              note={note}
              currentEmotion={currentEmotion}
              setNote={setNote}
              handleSaveNote={handleSaveNote}
              setShowNotes={setShowNotes}
              notesError={notesError}
              setNotesError={setNotesError}
            />
          )}

          {/* webcam Main */}
          <div className="sm:w-3/4 md:w-1/2 z-10 py-4 relative  bg-slate-700 h-full lg:w-[40%] xl:w-1/3 w-full">
            {!isWebcamReady && (
              <div className=" flex text-2xl z-10 relative rounded-xl  text-white font-sans  items-center bg-slate-300 animate-pulse justify-center w-full h-[300px]">
                Loading webcam...
              </div>
            )}
            <Webcam
              className="rounded-xl w-full cursor-pointer"
              ref={webcamRef}
              style={{ display: isWebcamReady ? "block" : "none" }}
            />
            {/* controls */}
            <div className="flex flex-col z-10 relative w-full mt-3 space-y-2">
              <button
                onClick={getPlaylist}
                className="bg-green-700 hover:bg-green-600 duration-500 ease-in-out  rounded-lg py-2 text-white"
              >
                Go
              </button>
              <button
                variants={buttonVariants}
                initial="initial"
                animate="enter"
                exit="exit"
                onClick={() => setShowNotes(true)}
                className="bg-slate-600 hover:bg-slate-500 duration-500 ease-in-out flex items-center gap-2 justify-center text-white rounded-lg py-2"
              >
                <FontAwesomeIcon icon={faNotesMedical} />
                Add Notes
              </button>
              <button
                variants={buttonVariants2}
                initial="initial"
                animate="enter"
                onClick={() => setShowCustomisation(true)}
                className="bg-slate-600 hover:bg-slate-500 duration-500 ease-in-out items-center flex gap-2 justify-center text-white space-x-1 rounded-lg py-2"
              >
                <FontAwesomeIcon icon={faGear} />
                Customise
              </button>
            </div>
          </div>

          {showCustomisation && ( //prettier-ignore
            <CustomiseModal
              {...{
                notesVariants,
                setSaveCurrEmotion,
                saveCurrEmotion,
                setIsDanceabilityEnabled,
                setIsMaxDurationEnabled,
                setShowCustomisation,
                isTempoEnabled,
                isDanceabilityEnabled,
                isMaxDurationEnabled,
                useTopTracks,
                setUseTopTracks,
                setTempo,
                setIsTempoEnabled,
                tempo,
                setDanceability,
                danceability,
                setMaxDuration,
                maxDuration,
              }}
            />
          )}
        </div>

        {/* Error Section */}
        {emotionError && (
          <div
            name="error-section"
            className="text-red-500 capitalize mt-5 lg:text-4xl text-3xl"
          >{`${emotionError}`}</div>
        )}

        {/* add nacl !emotionError */}
        {isFetching && (
          <div
            name="emotion-section"
            className="flex items-center justify-center mt-10 gap-6"
          >
            <div className="w-[300px] lg:block hidden h-[400px] bg-gray-300 rounded animate-pulse"></div>

            <div className="w-[300px] h-[400px] text-slate-500 text-2xl font-bold flex justify-center items-center bg-gray-300 rounded animate-pulse">
              <Typewriter
                options={{
                  cursor: "",
                  strings: ["Nearly", "Few seconds now...", "Almost!"],
                  autoStart: true,
                  pauseFor: 2000,
                  loop: false,
                }}
              />
            </div>
            <div className="w-[300px] lg:block hidden h-[400px] bg-gray-300 rounded animate-pulse"></div>
          </div>
        )}

        {/* Bottom Section */}
        <div>
          {!emotionError && currentEmotion && (
            <h2
              className={`lg:text-6xl text-4xl uppercase flex lg:flex-row flex-col gap-3 items-center justify-center font-homeTitle font-bold text-center mt-16  ${emotionColourMap[currentEmotion][1]}`}
            >
              {`You're Feeling ${currentEmotion}`}
              <FontAwesomeIcon
                icon={emotionIcon[currentEmotion]}
                className={`text-5xl ${emotionColourMap[currentEmotion][1]}`}
              />
            </h2>
          )}
        </div>

        {/* Show recommendations only if all conditions are met */}
        {recommendations.length > 0 &&
          !isFetching &&
          !emotionError &&
          !fetchError && (
            <div className="w-full">
              <p className="text-3xl font-homeHeader mt-12 text-slate-400 tracking-wider uppercase font-bold text-center">
                Check out these songs!
              </p>

              <div className="flex lg:flex-row flex-col lg:items-stretch lg:justify-evenly items-center mt-8 w-full">
                {recommendations.map((track) => (
                  <div
                    key={track.name}
                    className={` flex flex-col justify-between max-w-[300px]  bg-slate-700 mt-8`}
                  >
                    <a
                      href={track.external_urls.spotify}
                      className="max-w-[300px] max-h-[300px]"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        className="object-cover"
                        src={track.album.images[1].url}
                        alt={`Album cover for ${track.name}`}
                      ></img>
                    </a>
                    <div className="flex max-w-full p-2 items-end justify-between">
                      <div className="flex flex-col items-stretch justify-between">
                        <h3 className="font-bold text-xl text-white mt-3 text-ellipsis ">
                          {track.name}
                        </h3>
                        <p className="mt-2 text-slate-300 text-base">
                          by {track.artists[0].name}
                        </p>
                      </div>
                      <button
                        onClick={() => handleLikeClick(track)}
                        className=""
                      >
                        <FontAwesomeIcon
                          icon={faStar}
                          size="xl"
                          color={likedTracks[track.name] ? "yellow" : "gray"}
                        />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        {fetchError && (
          <div className="text-red-500 lg:w-1/2 w-full mx-auto mt-5 capitalize lg:text-3xl md:text-2xl text-xl text-center">
            {fetchError}
          </div>
        )}
        {fetchError === "Please Login to use the recommended songs feature" && (
          <div className="w-full sm:w-2/3 md:w-1/2 mb-6 tracking-wide mx-auto flex flex-col justify-center bg-slate-950 p-6 gap-2 rounded-2xl text-white font-navLinks text-base sm:text-lg lg:text-xl mt-10 ">
            <p>Please use the following login to test the main features</p>
            <p>tester123spotify@gmail.com</p>
            <p>Password: Tester123</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
