import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faPause,
  faStop,
  faVolumeHigh,
} from "@fortawesome/free-solid-svg-icons";
import Highlighter from "react-highlight-words";
// import AudioPlayer from "./audioPlayer";
// import "../../../../styles/text_highlight.module.css";
import "../../../styles/text_highlight.module.css";

const TextToSpeech = ({ text, setCurrentWord, currentWord, isActive }) => {
  const [IsTextToSpeechActive, setIsTextToSpeechActive] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [utterance, setUtterance] = useState(null);
  const [selectedVoice, setSelectedVoice] = useState(null);
  // const [ttsAudioData, setTTSAudioData] = useState(null);

  // const u = new SpeechSynthesisUtterance(text);

  console.log("is button paused:", isPaused);

  // const saveTTSData = (audioData) => {
  //   setTTSAudioData(audioData);
  // };

  useEffect(() => {
    const synth = window.speechSynthesis;

    const handleVoicesChanged = () => {
      const voices = synth.getVoices();
      if (voices.length > 0) {
        setSelectedVoice(voices[0]);
        const u = new SpeechSynthesisUtterance(text);
        u.voice = voices[0];
        setUtterance(u);
      }
    };

    synth.addEventListener("voiceschanged", handleVoicesChanged);

    return () => {
      synth.cancel();
      synth.removeEventListener("voiceschanged", handleVoicesChanged);
    };
  }, [text]);

  useEffect(() => {
    if (utterance) {
      const handleBoundary = (event) => {
        if (event.name === "word" && event.charIndex !== undefined) {
          const word = text.slice(
            event.charIndex,
            event.charIndex + event.charLength
          );
          setCurrentWord(word);
        }
      };

      utterance.addEventListener("boundary", handleBoundary);

      return () => {
        utterance.removeEventListener("boundary", handleBoundary);
      };
    }
  }, [utterance, text, setCurrentWord, currentWord]);

  const handlePlay = () => {
    const synth = window.speechSynthesis;
    console.log("Handle Play called");

    if (isPaused) {
      if (synth.paused) {
        synth.resume();
      } else {
        const u = new SpeechSynthesisUtterance(text);
        synth.speak(u);
      }
    } else {
      synth.pause();
    }

    setIsPaused(!isPaused);
  };

  // const sendTTSDataToServer = (audioData) => {
  //   const formData = new FormData();
  //   formData.append("ttsAudio", audioData);

  //   fetch("http://127.0.0.1:5001/upload-audio", {
  //     method: "POST",
  //     body: formData,
  //   })
  //     .then((response) => {
  //       if (response.ok) {
  //         console.log("TTS audio sent to the server successfully.");
  //       } else {
  //         console.error("Failed to send TTS audio to the server.");
  //       }
  //     })
  //     .catch((error) => {
  //       console.error("Error sending TTS audio:", error);
  //     });
  // };

  const handlePause = () => {
    const synth = window.speechSynthesis;
    synth.pause();
    setIsPaused(true);
  };

  const handleStop = () => {
    const synth = window.speechSynthesis;
    synth.cancel();
    setIsPaused(true);
    setUtterance(new SpeechSynthesisUtterance(text));
  };

  return (
    <div className="text-md md:text-2xl lg:text-2xl">
      <div
        className={`flex space-x-4 fixed 
        bottom-1 right-1 px-2 py-2 text-md md:text-2xl lg:text-2xl`}
        onMouseEnter={() => setIsTextToSpeechActive(true)}
        onMouseLeave={() => setIsTextToSpeechActive(false)}
      >
        <div className="justify-center p-auto text-slate-900 text-md md:text-2xl lg:text-2xl ">
          <FontAwesomeIcon icon={faVolumeHigh} />{" "}
        </div>
        {IsTextToSpeechActive ? (
          <div className="justify-center space-x-4">
            <button
              className={`${
                isActive
                  ? "px-2 py-1"
                  : "px-2 py-1 text-md md:text-3xl lg:text-3xl"
              } rounded-md ${
                isPaused
                  ? "bg-blue-500"
                  : "bg-yellow-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 text-md md:text-3xl lg:text-3xl"
              }`}
              onClick={isPaused ? handlePlay : handlePause}
            >
              {isPaused ? (
                <FontAwesomeIcon icon={faPlay} />
              ) : (
                <FontAwesomeIcon icon={faPause} />
              )}
            </button>
            <button
              className={`text-md md:text-3xl lg:text-3xl ${
                isActive
                  ? "px-2 py-1"
                  : "px-2 py-1 text-md md:text-3xl lg:text-3xl"
              } rounded-md  bg-red-500 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-opacity-50 ${
                isPaused
                  ? "opacity-0.7 cursor-not-allowed text-md md:text-3xl lg:text-3xl"
                  : ""
              }`}
              onClick={handleStop}
              style={{ opacity: isPaused ? 0.7 : 1 }}
              disabled={isPaused}
            >
              <FontAwesomeIcon icon={faStop} />
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default TextToSpeech;
