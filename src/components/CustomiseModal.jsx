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
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipTimeout = useRef(null);

  const handleMouseEnter = () => {
    tooltipTimeout.current = setTimeout(() => {
      setShowTooltip(true);
    }, 800);
  };

  const handleMouseLeave = () => {
    clearTimeout(tooltipTimeout.current);
    setShowTooltip(false);
  };

  return (
    <div onClick={() => setShowCustomisation(false)} className="fixed flex flex-col top-0 right-0 left-0 bottom-0 text-white bg-black bg-opacity-90  items-center justify-center z-20">
      <button
        className="text-white flex items-center justify-center absolute top-5 right-5 bg-red-600 w-10 h-10 rounded-full hover:bg-red-700"
        onClick={() => setShowCustomisation(false)}
      >
        <FontAwesomeIcon icon={faClose} className="text-2xl" />
      </button>
      <motion.div
        variants={notesVariants}
        initial="initial"
        animate="enter"
        exit="exit"
        className="lg:w-1/3 w-full bg-green-600 p-2 rounded-lg"
        onClick={(e) => e.stopPropagation()}  // Prevent modal from closing when content is clicked

      >
        <div className=" w-full p-4 rounded-lg">
          <div
            //same animation as notesVariants

            className="w-full p-4 rounded-lg  bg-slate-600"
          >
            <h2 className="text-2xl font-semibold mb-4">
              Customize Your Recommendations
            </h2>

            <h1 className="text-xl font-bold mb-2">Emotions Storage</h1>

            <div className={`flex items-center mb-5`}>
              <label htmlFor="emotion" className="flex-auto text-lg">
                Save emotions to tracker
              </label>
              <input
                id="emotion"
                type="checkbox"
                checked={saveCurrEmotion}
                onChange={() => setSaveCurrEmotion(!saveCurrEmotion)}
                className="form-checkbox h-5 w-5 text-blue-600"
              ></input>
            </div>

            <h1 className="text-xl font-bold mb-2">
              Configure Recommendations
            </h1>

            {/* Use Top Tracks */}
            <div
              className={`flex items-center mb-2 relative ${
                isTempoEnabled || isDanceabilityEnabled || isMaxDurationEnabled
                  ? "opacity-50"
                  : "opacity-100"
              }`}
            >
              <label
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                htmlFor="topArtists"
                className="flex-auto text-lg"
              >
                {showTooltip && (
                  <div
                    className="absolute z-10 p-2 w-1/2 mt-2 text-sm bg-gray-700 text-white rounded-md shadow-lg -left-4 bottom-full"
                    // style={{ maxWidth: "200px" }}
                  >
                    Your recommendations will be based on your top artists. This
                    setting disables other filters.
                  </div>
                )}
                Use Your Top Artists for Recommendations
              </label>
              <input
                id="topArtists"
                disabled={
                  isTempoEnabled ||
                  isDanceabilityEnabled ||
                  isMaxDurationEnabled
                }
                type="checkbox"
                checked={useTopTracks}
                onChange={() => setUseTopTracks(!useTopTracks)}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
            </div>

            {/* Tempo */}
            <div
              className={`flex items-center gap-5 mb-2 ${
                useTopTracks ? "opacity-50" : "opacity-100"
              }`}
            >
              <label htmlFor="tempo" className="flex-auto text-lg">
                Tempo (BPM)
              </label>

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
              className={`flex items-center gap-5 mb-2 ${
                useTopTracks ? "opacity-50" : "opacity-100"
              }`}
            >
              <label htmlFor="dance" className="flex-auto text-lg">
                Danceability
              </label>

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
                onChange={() =>
                  setIsDanceabilityEnabled(!isDanceabilityEnabled)
                }
                className="form-checkbox h-5 w-5 text-blue-600"
              />
            </div>

            {/* Max Duration */}

            <div
              className={`flex items-center gap-5  ${
                useTopTracks ? "opacity-50" : "opacity-100"
              }`}
            >
              <label htmlFor="maxDuration" className="flex-auto text-lg">
                Max Duration (s)
              </label>

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
        </div>
      </motion.div>
    </div>
  );
};

export default CustomiseModal;
