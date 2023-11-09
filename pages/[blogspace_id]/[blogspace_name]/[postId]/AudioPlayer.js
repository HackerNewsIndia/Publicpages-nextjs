import { useState, useEffect, useRef } from "react";
import Highlighter from "react-highlight-words";
import "../../../../styles/text_highlight.module.css";

export default function AudioPlayer({ audioSrc, text }) {
  const audioRef = useRef();
  const textRef = useRef();
  const [currentWord, setCurrentWord] = useState("");

  useEffect(() => {
    const audio = audioRef.current;
    const textElement = textRef.current;

    const handleTimeUpdate = () => {
      const currentTime = audio.currentTime;

      // Your logic to determine which part of the text corresponds to the current playback position
      // You can split the text into words or phrases and compare with the currentTime

      // For example, you can split the text into words using spaces
      const words = text.split(" ");
      for (let i = 0; i < words.length; i++) {
        // Calculate the start and end time for this word based on your audio
        // For example, you can assume each word takes a fixed duration
        const wordDuration = 1.0; // Adjust this based on your audio
        const wordStartTime = i * wordDuration;
        const wordEndTime = (i + 1) * wordDuration;

        if (currentTime >= wordStartTime && currentTime < wordEndTime) {
          setCurrentWord(words[i]);
          break; // Exit the loop when you find the current word
        }
      }
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [audioSrc, text]);

  return (
    <div>
      <audio ref={audioRef} src={audioSrc} controls />
      <div ref={textRef}>
        <Highlighter
          highlightClassName="text-highlighted"
          searchWords={[currentWord]}
          autoEscape={true}
          textToHighlight={text}
        />
      </div>
    </div>
  );
}
