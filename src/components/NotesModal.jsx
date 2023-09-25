import React from "react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const NotesModal = ({
  notesVariants,
  currentEmotion,
  setNote,
  handleSaveNote,
  setShowNotes,
  note,
}) => {
  const { data: session } = useSession();

  return (
    <div  onClick={() => setShowNotes(false)} className="fixed flex flex-col top-0 right-0 left-0 bottom-0 bg-black bg-opacity-90  items-center justify-center z-20">
      <button
        className="text-white flex items-center justify-center absolute top-5 right-5 bg-red-600 w-10 h-10 rounded-full hover:bg-red-700"
        onClick={() => setShowNotes(false)}
      >
        <FontAwesomeIcon icon={faClose} className="text-2xl" />
      </button>
      <div className="lg:w-1/3 w-full lg:h-full p-4 flex items-center justify-center">
        <motion.div
          onClick={(e) => e.stopPropagation()}
          variants={notesVariants}
          initial="initial"
          animate="enter"
          exit="exit"
          className=" w-full bg-green-600 p-6 rounded-lg"
        >
          <div className={`bg-slate-600 p-6 w-full rounded-lg shadow-md`}>
            <h3 className="text-white font-navLinks text-lg capitalize mb-3">
              {currentEmotion
                ? `You seem to be feeling ${currentEmotion}. Any thoughts?`
                : "No emotion detected yet. You may still add a note on how your feeling"}
            </h3>
            <textarea
              className="w-full h-32 p-3 rounded-md bg-opacity-50 text-slate-800 placeholder-gray-400"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={
                session
                  ? "Write your thoughts here..."
                  : "Login to use notes feature"
              }
            ></textarea>
            <div className="w-full flex justify-between items-end">
              <button
                onClick={handleSaveNote}
                className="mt-2 bg-green-700 py-1 px-2 rounded-lg w-full hover:bg-green-800 text-white font-bold "
              >
                Save Note
              </button>
             
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotesModal;
