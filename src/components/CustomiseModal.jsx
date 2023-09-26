import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { Slider } from "@mui/material";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const CustomiseModal = ({
  notesVariants,
  setSaveCurrEmotion,
  saveCurrEmotion,
  isTempoEnabled,
  setIsDanceabilityEnabled,
  isDanceabilityEnabled,
  isMaxDurationEnabled,
  setIsMaxDurationEnabled,
  setShowCustomisation,
  useTopTracks,
  setUseTopTracks,
  setTempo,
  setIsTempoEnabled,
  tempo,
  setDanceability,
  danceability,
  setMaxDuration,
  maxDuration,
}) => {
  // const {data: session} = useSession()
  const [currentTooltip, setCurrentTooltip] = useState(null);
  const tooltipTimeout = useRef(null);

  const tooltips = {
    topArtistsTip:
      "Your recommendations will be based on your top artists. This setting disables other filters.",
    saveTracksTip:
      "Your emotions will be stored in the mood tracker in each calender day.",
    tempoTip:
      "A target for the tempo of your recommended songs in beats per minute.",
    danceabilityTip:
      "A target for how suited your recommended song is to dance to",
    maxDurationTip:
      "A maximum amount of seconds the recommended songs will be. If too low songs may not be recommended",
  };

  const handleMouseEnter = (tooltipId) => {
    tooltipTimeout.current = setTimeout(() => {
      setCurrentTooltip(tooltipId);
    }, 500);
  };

  const handleMouseLeave = () => {
    clearTimeout(tooltipTimeout.current);
    setCurrentTooltip(null);
  };

  return (
    <div
      onClick={() => setShowCustomisation(false)}
      className="fixed flex flex-col top-0 right-0 left-0 bottom-0 text-white bg-black bg-opacity-90  items-center justify-center z-20"
    >
      <motion.div
        variants={notesVariants}
        initial="initial"
        animate="enter"
        exit="exit"
        className="lg:min-w-[500px] md:w-1/2 lg:w-1/3 max-w-xl xs:w-2/3 xs:h-fit w-full h-full relative bg-slate-600 rounded-lg"
        onClick={(e) => e.stopPropagation()} // Prevent modal from closing when content is clicked
      >
        <button
          className="text-white flex items-center justify-center absolute top-2 right-2  rounded-full"
          onClick={() => setShowCustomisation(false)}
        >
          <FontAwesomeIcon icon={faClose} className="text-2xl" />
        </button>
        <div className="w-full p-4  rounded-lg  bg-slate-600">
          <h2 className="text-3xl font-sans font-semibold mb-6">Customise</h2>

          <h1 className="text-xl font-bold mb-2">Emotion Storage</h1>

          <div className={`flex relative items-center mb-5`}>
            <label
              onMouseEnter={() => handleMouseEnter("saveTracksTip")}
              onMouseLeave={handleMouseLeave}
              htmlFor="emotion"
              className="flex-auto capitalize text-lg"
            >
              Save emotions to mood tracker
            </label>

            {currentTooltip === "saveTracksTip" && (
              <div
                className="absolute z-10 p-2 w-1/2  mt-2 text-sm bg-gray-700 text-white rounded-md shadow-lg -left-4 bottom-full"
                // style={{ maxWidth: "200px" }}
              >
                {tooltips.saveTracksTip}
              </div>
            )}
            <input
              id="emotion"
              type="checkbox"
              checked={saveCurrEmotion}
              onChange={() => setSaveCurrEmotion(!saveCurrEmotion)}
              className="form-checkbox h-5 w-5 text-blue-600"
            ></input>
          </div>

          <h1 className="text-xl font-bold mb-2">Configure Recommendations</h1>

          {/* Use Top Tracks */}
          <div
            className={`flex items-center gap-5 mb-2 relative ${
              isTempoEnabled || isDanceabilityEnabled || isMaxDurationEnabled
                ? "opacity-50"
                : "opacity-100"
            }`}
          >
            <label
              onMouseEnter={() => handleMouseEnter("topArtistsTip")}
              onMouseLeave={handleMouseLeave}
              htmlFor="topArtistsTip"
              className="flex-auto text-lg"
            >
              Use Your Top Artists for Recommendations
            </label>

            {currentTooltip === "topArtistsTip" && (
              <div
                className="absolute z-10 p-2 w-1/2  mt-2 text-sm bg-gray-700 text-white rounded-md shadow-lg -left-4 bottom-full"
                // style={{ maxWidth: "200px" }}
              >
                {tooltips.topArtistsTip}
              </div>
            )}
            <input
              id="topArtistsTip"
              disabled={
                isTempoEnabled || isDanceabilityEnabled || isMaxDurationEnabled
              }
              type="checkbox"
              checked={useTopTracks}
              onChange={() => setUseTopTracks(!useTopTracks)}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
          </div>

          {/* Tempo */}
          <div
            className={`flex relative items-center gap-5 mb-2 ${
              useTopTracks ? "opacity-50" : "opacity-100"
            }`}
          >
            <label
              onMouseEnter={() => handleMouseEnter("tempoTip")}
              onMouseLeave={handleMouseLeave}
              htmlFor="tempo"
              className="flex-auto text-lg"
            >
              Tempo (BPM)
            </label>

            {currentTooltip === "tempoTip" && (
              <div
                className="absolute z-10 p-2 w-1/2  mt-2 text-sm bg-gray-700 text-white rounded-md shadow-lg -left-4 bottom-full"
                // style={{ maxWidth: "200px" }}
              >
                {tooltips.tempoTip}
              </div>
            )}

            {isTempoEnabled && (
              <Slider
                // color=""
                size="small"
                // defaultValue={70}
                max={200}
                min={40}
                disabled={useTopTracks}
                value={tempo}
                aria-label="Small"
                valueLabelDisplay="auto"
                onChange={(e, newValue) => setTempo(newValue)}
              />
            )}
            <input
              id="tempo"
              type="checkbox"
              disabled={useTopTracks}
              checked={isTempoEnabled}
              onChange={() => setIsTempoEnabled(!isTempoEnabled)}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
          </div>

          {/* Danceability */}

          <div
            className={`flex relative items-center gap-5 mb-2 ${
              useTopTracks ? "opacity-50" : "opacity-100"
            }`}
          >
            <label
              onMouseEnter={() => handleMouseEnter("danceabilityTip")}
              onMouseLeave={handleMouseLeave}
              htmlFor="dance"
              className="flex-auto text-lg"
            >
              Danceability
            </label>

            {currentTooltip === "danceabilityTip" && (
              <div
                className="absolute z-10 p-2 w-1/2  mt-2 text-sm bg-gray-700 text-white rounded-md shadow-lg -left-4 bottom-full"
                // style={{ maxWidth: "200px" }}
              >
                {tooltips.danceabilityTip}
              </div>
            )}

            {isDanceabilityEnabled && (
              <Slider
                // color=""
                size="small"
                // defaultValue={70}
                max={100}
                min={0}
                disabled={useTopTracks}
                value={danceability}
                aria-label="Small"
                valueLabelDisplay="auto"
                onChange={(e, newValue) => setDanceability(newValue)}
              />
            )}
            <input
              id="dance"
              type="checkbox"
              checked={isDanceabilityEnabled}
              disabled={useTopTracks}
              onChange={() => setIsDanceabilityEnabled(!isDanceabilityEnabled)}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
          </div>

          {/* Max Duration */}

          <div
            className={`flex relative items-center gap-5  ${
              useTopTracks ? "opacity-50" : "opacity-100"
            }`}
          >
            <label
              onMouseEnter={() => handleMouseEnter("maxDurationTip")}
              onMouseLeave={handleMouseLeave}
              htmlFor="maxDuration"
              className="flex-auto text-lg"
            >
              Max Duration (s)
            </label>

            {currentTooltip === "maxDurationTip" && (
              <div
                // onMouseEnter={}
                className="absolute z-10 p-2 w-1/2  mt-2 text-sm bg-gray-700 text-white rounded-md shadow-lg -left-4 bottom-full"
                // style={{ maxWidth: "200px" }}
              >
                {tooltips.maxDurationTip}
              </div>
            )}

            {isMaxDurationEnabled && (
              <Slider
                // color=""
                size="small"
                // defaultValue={70}
                max={300}
                min={120}
                disabled={useTopTracks}
                value={maxDuration}
                aria-label="Small"
                valueLabelDisplay="auto"
                onChange={(e, newValue) => setMaxDuration(newValue)}
              />
            )}
            <input
              id="maxDuration"
              disabled={useTopTracks}
              type="checkbox"
              checked={isMaxDurationEnabled}
              onChange={() => setIsMaxDurationEnabled(!isMaxDurationEnabled)}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CustomiseModal;
