import React, { useState, useEffect } from "react";
// import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { jwtDecode } from "jwt-decode";

const Postsentiment = ({ postId, blogId, postlikes }) => {
  const [isSentimentActive, setIsSentimentActive] = useState(false);
  const [selectedSentimentIcon, setSelectedSentimentIcon] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);

  console.log("postlikes :", postlikes);

  useEffect(() => {
    // Fetch comments using the post ID
    // const fetchComments = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    if (token) {
      setIsLoggedIn(true);
      const decoded_token = jwtDecode(token);
      const userId = decoded_token.id;
      console.log(userId);
      setUserId(userId);
    }

    // try {
    //   const response = await fetch(
    //     `https://typeit-api.onrender.com/get_comments/${postId}`
    //     // `http://127.0.0.1:5000/get_comments/${postId}`
    //   );
    //   if (!response.ok) {
    //     throw new Error("Network response was not ok");
    //   }

    //   const data = await response.json();
    //   // Assuming the response structure is { comments: [...] }
    //   console.log("commentData:", data);
    //   setCommentData(data);
    //   setComments(data.comments);
    //   setSentiments(data.comments.sentiments);
    // } catch (error) {
    //   console.error("error in fetching comments", error.message);
    // }

    // };

    // fetchComments();
  }, [postId]);

  const handleSentimentIcon = (icon) => {
    // Your logic to handle sentiment changes
    setSelectedSentimentIcon(icon);
    if (!isLoggedIn) {
      const currentUrl = window.location.href;
      // Redirect the user to the login page with the current URL as a query parameter
      window.location.href = `https://universal-jikv.onrender.com/login?redirectUrl=${encodeURIComponent(
        currentUrl
      )}`;
    } else {
      fetch("https://diaryblogapi2.onrender.com/api/sentimentforpost", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          blogId: blogId,
          postId: postId,
          icon: icon,
          user_who_selected_this_icon: userId,
        }),
      })
        .then((response) => response.json())
        .then((data) => console.log(data))
        .catch((error) => {
          console.log("Error:", error);
        });
    }
  };

  return (
    <div
      className="text-md italic text-pink-400 md:text-xl lg:text-xl justify-center"
      onMouseEnter={() => setIsSentimentActive(true)}
      onMouseLeave={() => setIsSentimentActive(false)}
    >
      <div className="flex flex-col">
        <div>
          {isSentimentActive ? (
            <div className="flex text-md md:text-md lg:text-md bg-transparent rounded-md items-center">
              <FontAwesomeIcon
                id="faHeart"
                className="pt-2 pb-2 pr-1 pl-1  hover:text-pink-700 duration-300 cursor-pointer"
                onClick={() => handleSentimentIcon("faHeart")}
                icon={faHeart}
              />
            </div>
          ) : selectedSentimentIcon ? (
            <FontAwesomeIcon
              icon={selectedSentimentIcon === "faHeart" ? faHeart : null}
              className={`text-md md:text-2xl lg:text-2xl ${
                selectedSentimentIcon === "faHeart" ? "text-pink-700" : ""
              }`}
            />
          ) : (
            <FontAwesomeIcon icon={faHeart} />
          )}
        </div>
        <div>
          <div className="text-xs text-slate-900">
            {postlikes
              ? `${postlikes} ${postlikes > 1 ? "likes" : "like"}`
              : ""}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Postsentiment;
