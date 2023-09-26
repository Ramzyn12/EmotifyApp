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
  notesError,
  setNotesError,
}) => {
  const { data: session } = useSession();

  const handleModalClose = () => {
    setShowNotes(false);
    setNotesError("");
    setNote("");
  };

  return (
    <div
      onClick={handleModalClose}
      className="fixed flex flex-col top-0 right-0 left-0 bottom-0 bg-black bg-opacity-90  items-center justify-center z-20"
    >
      <div className="w-full h-full lg:h-full flex items-center justify-center">
        <motion.div
          onClick={(e) => e.stopPropagation()}
          variants={notesVariants}
          initial="initial"
          animate="enter"
          exit="exit"
          className={`bg-slate-600  p-6 h-full xs:h-fit w-full md:w-1/2 max-w-xl xs:w-2/3 flex justify-center flex-col rounded-lg shadow-md`}
        >
          <button
            className="text-white flex items-center justify-center absolute top-2 right-2 "
            onClick={handleModalClose}
          >
            <FontAwesomeIcon icon={faClose} className="text-2xl" />
          </button>
          <h3 className="text-white font-bold text-lg capitalize mb-1">
            {currentEmotion
              ? `You seem to be feeling ${currentEmotion}`
              : "No emotion detected yet"}
          </h3>
          <p className="text-white font-sans mb-3">
            Write a note about how your feeling and visit the mood tracker to
            see a journal of your notes.
          </p>
          <p className="text-red-500 font-sans mb-3">{notesError}</p>
          <textarea
            className="w-full h-64 p-3 rounded-md bg-opacity-50 text-slate-800 placeholder-gray-400"
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
              className="mt-2 bg-green-600 py-1 px-2 rounded-lg w-full duration-300 hover:bg-green-800 ease-in-out text-white "
            >
              Save Note
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotesModal;
