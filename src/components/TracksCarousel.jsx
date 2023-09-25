import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, Children, cloneElement } from "react";
import { motion, AnimatePresence } from "framer-motion";

const slideVariants = {
  initial: { opacity: 0, x: -100 },
  enter: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 100 },
};

const TracksCarousel = ({ children }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalItems = Children.count(children);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalItems);
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + totalItems) % totalItems);
  };

  const childrenWithProps = Children.map(children, (child, index) =>
    cloneElement(child, { key: index })
  );

  return (
    <div className="w-full flex relative">
      <button className="absolute top-1/2 left-0" onClick={handlePrevious}>
        <FontAwesomeIcon icon={faArrowLeft} />
      </button>
      <div className="w-full flex items-center justify-center">
        <motion.div
          key={currentIndex}
          variants={slideVariants}
          initial="initial"
          animate="enter"
          exit="exit"
          className="w-full flex items-center justify-center"
        >
          {childrenWithProps[currentIndex]}
        </motion.div>
      </div>
      <button className="absolute top-1/2 right-1" onClick={handleNext}>
        <FontAwesomeIcon icon={faArrowRight} />
      </button>
    </div>
  );
};

export default TracksCarousel;
