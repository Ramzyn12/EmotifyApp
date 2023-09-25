import React from "react";
import TracksCarousel from "./TracksCarousel";
import { useSession } from "next-auth/react";

const Tracks = (props) => {
  const { data: session } = useSession();

  return (
    <div className="w-full h-full flex justify-center items-center">
      {props.tracksInfo.length === 0 && <p className="font-navLinks text-lg">{session ? 'No Tracks Liked yet!' : 'Login to view your liked tracks!'}</p>}
      {props.tracksInfo.length > 0 && <TracksCarousel>
        {props.tracksInfo.map((trackInfo, index) => (
          <div
            key={index}
            className="flex flex-col w-2/3 border-2 overflow-hidden rounded-xl "
          >
            {/* mood section */}
            <div
              className={`text-center ${
                props.emotionsMap[trackInfo.mood][0]
              } font-sans capitalize font-bold p-1`}
            >
              {trackInfo.mood}
            </div>
            {/* song image + url */}
            <div className="">
              <a
                href={trackInfo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full"
              >
                <img
                  src={trackInfo.imageSrc}
                  alt="image"
                  className="w-full object-contain"
                />
              </a>
            </div>
            {/* song track name and stuff */}
            <div className="p-2">
              <h3 className="text-xl font-bold ">{trackInfo.trackName}</h3>
              <p className="text-slate-300  text-lg">
                {trackInfo?.trackArtist || "Adele"}
              </p>
            </div>
          </div>
        ))}
      </TracksCarousel>}
    </div>
  );
};

export default Tracks;
