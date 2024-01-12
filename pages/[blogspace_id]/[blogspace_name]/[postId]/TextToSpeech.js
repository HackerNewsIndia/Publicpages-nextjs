import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause, faStop } from "@fortawesome/free-solid-svg-icons";
import Highlighter from "react-highlight-words";
import AudioPlayer from "./AudioPlayer";
import "../../../../styles/text_highlight.module.css";

const TextToSpeech = ({ text, setCurrentWord, currentWord, isActive }) => {
  const [isPaused, setIsPaused] = useState(false);
  const [utterance, setUtterance] = useState(null);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [ttsAudioData, setTTSAudioData] = useState(null);

  const u = new SpeechSynthesisUtterance(text);

  const saveTTSData = (audioData) => {
    setTTSAudioData(audioData);
  };

  useEffect(() => {
    const synth = window.speechSynthesis;

    const handleVoicesChanged = () => {
      const voices = synth.getVoices();
      if (voices.length > 0) {
        setSelectedVoice(voices[0]);
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
            event.charIndex + event.charLength,
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

    if (isPaused) {
      synth.resume();
    } else {
      if (selectedVoice) {
        u.voice = selectedVoice;
      }
      synth.speak(u);
      const audioData = synth.speak(u);
      saveTTSData(audioData);
      sendTTSDataToServer(audioData);
    }

    setIsPaused(false);
  };

  const sendTTSDataToServer = (audioData) => {
    const formData = new FormData();
    formData.append("ttsAudio", audioData);

    fetch("http://127.0.0.1:5001/upload-audio", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          console.log("TTS audio sent to the server successfully.");
        } else {
          console.error("Failed to send TTS audio to the server.");
        }
      })
      .catch((error) => {
        console.error("Error sending TTS audio:", error);
      });
  };

  const handlePause = () => {
    const synth = window.speechSynthesis;
    synth.pause();
    setIsPaused(true);
  };

  const handleStop = () => {
    const synth = window.speechSynthesis;
    synth.cancel();
    setIsPaused(false);
  };

  return (
    <div>
      <div
        className={`flex space-x-4 fixed ${isActive ? "w-1/6" : ""} ${
          isActive ? "space-x-6" : "space-x-4"
        }  bottom-4 right-1 border-2 border-black bg-white bg-opacity-50  rounded-md px-2 py-2`}
      >
        <button
          className={`${isActive ? "px-3 py-2" : "px-2 py-1"} rounded-md ${
            isPaused ? "bg-yellow-500" : "bg-blue-500"
          } text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50`}
          onClick={handlePlay}
        >
          <FontAwesomeIcon icon={isPaused ? faPlay : faPause} />
        </button>
        <button
          className={`${
            isActive ? "px-3 py-2" : "px-2 py-1"
          } rounded-md bg-yellow-500 text-white hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-opacity-50`}
          onClick={handlePause}
        >
          <FontAwesomeIcon icon={faPause} />
        </button>
        <button
          className={`${
            isActive ? "px-3 py-1" : "px-2 py-1"
          } rounded-md bg-red-500 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-opacity-50`}
          onClick={handleStop}
        >
          <FontAwesomeIcon icon={faStop} />
        </button>
      </div>
      <Highlighter
        highlightClassName="highlighted-text"
        searchWords={[currentWord]}
        autoEscape={true}
        textToHighlight={text}
      />
    </div>
  );
};

export default TextToSpeech;
