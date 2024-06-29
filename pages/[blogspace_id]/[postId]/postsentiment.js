import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

const Postsentiment = ({ postId, blogId, postlikes, postStatus }) => {
  const [isSentimentActive, setIsSentimentActive] = useState(false);
  const [selectedSentimentIcon, setSelectedSentimentIcon] = useState(null);
  const [likesCount, setLikesCount] = useState(postlikes || 0); // Define likesCount state

  const handleSentimentIcon = (icon) => {
    setSelectedSentimentIcon(icon);
    fetch("https://diaryblogapi-eul3.onrender.com/api/sentimentforpost", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        blogId: blogId,
        postId: postId,
        icon: icon,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "Sentiment recorded successfully.") {
          setLikesCount((prevLikesCount) => prevLikesCount + 1); // Increment the likes count
        } else {
          console.log(data.message);
        }
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  };

  return (
    <div
      className="text-xl italic text-pink-400 md:text-xl lg:text-xl items-center justify-center"
      onMouseEnter={() => setIsSentimentActive(true)}
      onMouseLeave={() => setIsSentimentActive(false)}
    >
      {postStatus === "preview" ? null : (
        <div className="flex flex-col">
          <div>
            {isSentimentActive ? (
              <div className="flex text-xl md:text-xl lg:text-xl bg-transparent rounded-md items-center">
                <FontAwesomeIcon
                  id="faHeart"
                  className="pt-2 pb-2 pr-1 pl-1 hover:text-pink-700 cursor-pointer"
                  onClick={() => handleSentimentIcon("faHeart")}
                  icon={faHeart}
                />
              </div>
            ) : selectedSentimentIcon ? (
              <FontAwesomeIcon
                icon={selectedSentimentIcon === "faHeart" ? faHeart : null}
                className={`text-xl md:text-xl lg:text-xl ${
                  selectedSentimentIcon === "faHeart" ? "text-pink-700" : ""
                }`}
              />
            ) : (
              <FontAwesomeIcon icon={faHeart} />
            )}
          </div>
          <div className="text-xs text-slate-900">
            {likesCount
              ? `${likesCount} ${likesCount > 1 ? "likes" : "like"}`
              : ""}
          </div>
        </div>
      )}
    </div>
  );
};

export default Postsentiment;
