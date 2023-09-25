import { useSession } from "next-auth/react";
import React from "react";

const Notes = (props) => {
  const { data: session } = useSession();
  const sortedNotes = props.notesInfo.sort((a, b) => {
    if (a.time && b.time) {
      return a.time.localeCompare(b.time);
    }
    return 0;
  });

  const newEmotionsMap = {
    ...props.emotionsMap,
    "No Emotion": ["bg-slate-200", "text-slate-200"],
  };

  return (
    <>
      {sortedNotes.length === 0 && (
        <div className="h-full flex items-center justify-center">
          {" "}
          <p className="text-center font-navLinks text-lg">
            {session ? 'Add some notes to get started!' : 'Login to add some notes!'}
          </p>
        </div>
      )}
      {sortedNotes.length > 0 &&
        sortedNotes.map((noteInfo, index) => (
          <div
            className={`${
              newEmotionsMap[noteInfo.mood][0]
            } mt-4 font-navLinks rounded-xl text-black p-4`}
            key={index}
          >
            <div className="flex justify-between">
              <span className="font-bold text-xl capitalize">
                {noteInfo.mood}
              </span>
              <span>{noteInfo.time}</span>
            </div>
            <p className="mt-2">{noteInfo.note}</p>
          </div>
        ))}
    </>
  );
};

export default Notes;
