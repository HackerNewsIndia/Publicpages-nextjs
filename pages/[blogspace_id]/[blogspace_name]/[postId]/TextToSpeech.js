import React, { useState, useEffect } from "react";
import Highlighter from "react-highlight-words";
import AudioPlayer from "./AudioPlayer";
import "../../../../styles/text_highlight.module.css";

const TextToSpeech = ({ text, setCurrentWord, currentWord, isActive }) => {
  const [isPaused, setIsPaused] = useState(false);
  const [utterance, setUtterance] = useState(null);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [ttsAudioData, setTTSAudioData] = useState(null);

  const u = new SpeechSynthesisUtterance(text); // Define the utterance outside useEffect
  console.log("u:", u);

  const saveTTSData = (audioData) => {
    setTTSAudioData(audioData);
  };

  useEffect(() => {
    const synth = window.speechSynthesis;
    console.log("synth:", synth);

    const handleVoicesChanged = () => {
      const voices = synth.getVoices();
      console.log("voices", voices); // Log available voices for debugging

      // You can create a list of voices to display to the user and let them select one
      // For simplicity, you can select the first voice available here
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
        console.log("calling handleBoundary");
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

    if (isPaused) {
      synth.resume();
    }

    if (selectedVoice) {
      u.voice = selectedVoice;
    }

    // synth.speak(u); // Use the defined `u` variable here
    // Generate TTS audio
    const audioData = synth.speak(u);

    // Save TTS audio data
    saveTTSData(audioData);
    sendTTSDataToServer(audioData);

    setIsPaused(false);
  };

  const sendTTSDataToServer = (audioData) => {
    console.log("Audio Data:", audioData);
    // Create a FormData object and append the audio data to it
    const formData = new FormData();
    formData.append("ttsAudio", audioData);

    // Make a POST request to your server
    fetch("http://127.0.0.1:5001/upload-audio", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          // Handle a successful response
          console.log("TTS audio sent to the server successfully.");
        } else {
          // Handle errors
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

  if (currentWord) {
    console.log("current word:", currentWord);
  }

  return (
    <div>
      {/* <AudioPlayer
        audioSrc="http://127.0.0.1:5001/audio_files"
        isPaused={isPaused}
        handlePlay={handlePlay}
        handlePause={handlePause}
        handleStop={handleStop}
      /> */}
      <div
        className={`flex space-x-4 fixed ${isActive ? "w-1/6" : ""} ${
          isActive ? "space-x-6" : "space-x-4"
        }  bottom-4 right-1 border-2 border-black bg-white bg-opacity-50  rounded-md px-2 py-2`}
      >
        <button
          className={` ${isActive ? "px-3 py-2" : "px-2 py-1"} rounded-md ${
            isPaused ? "bg-blue-500" : "bg-gray-500"
          } text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50`}
          onClick={handlePlay}
        >
          {isPaused ? "Resume" : "Play"}
        </button>
        <button
          className={`${
            isActive ? "px-3 py-2" : "px-2 py-1"
          } rounded-md bg-gray-500 text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50`}
          onClick={handlePause}
        >
          Pause
        </button>
        <button
          className={`${
            isActive ? "px-3 py-1" : "px-2 py-1"
          } rounded-md bg-gray-500 text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50`}
          onClick={handleStop}
        >
          Stop
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
