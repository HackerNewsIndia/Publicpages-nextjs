// CommentBar.js

import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { faFaceLaughSquint } from "@fortawesome/free-solid-svg-icons";
import { faThumbsDown } from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { icon } from "@fortawesome/fontawesome-svg-core";
import { jwtDecode } from "jwt-decode";

const Comments = ({ blogId, postId, post_title }) => {
  const [comments, setComments] = useState([]);
  const [sentiments, setSentiments] = useState([]);
  const [commentData, setCommentData] = useState();
  const [newComment, setNewComment] = useState("");
  const [isSentimentActive, setIsSentimentActive] = useState(false);
  const [selectedSentimentIcon, setSelectedSentimentIcon] = useState("");
  const [selectedIndex, setSelectedIndex] = useState();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  // const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch comments using the post ID
    const fetchComments = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");
      if (token) {
        setIsLoggedIn(true);
        const decoded_token = jwtDecode(token);
        const userId = decoded_token.id;
        console.log(userId);
        setUserId(userId);

        try {
          const response = await fetch(
            `https://typeit-api.onrender.com/get_comments/${postId}`
            // `http://127.0.0.1:5000/get_comments/${postId}`
          );
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }

          const data = await response.json();
          // Assuming the response structure is { comments: [...] }
          console.log("commentData:", data);
          setCommentData(data);
          setComments(data.comments);
          setSentiments(data.comments.sentiments);
        } catch (error) {
          console.error("error in fetching comments", error.message);
        }
      }
    };

    fetchComments();
  }, [postId]);

  useEffect(() => {
    // Initialize sentimentsActive array with false values for each comment
    setIsSentimentActive(Array(comments.length).fill(false));
  }, [comments]);

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const setSentimentsActiveForComment = (index, isActive) => {
    setIsSentimentActive((prev) => {
      const newState = [...prev];
      newState[index] = isActive;
      return newState;
    });
  };

  const handleSentimentIcon = (index, iconId, commentId) => {
    // setSelectedSentimentIcon((prev) => {
    //   const newState = [...prev];
    //   newState[index] = iconId;
    //   return newState;
    // });
    setSelectedSentimentIcon(iconId);
    setSelectedIndex(index);
    console.log("selected icon:", iconId);
    console.log("commentId:", commentId);

    fetch(
      "https://typeit-api.onrender.com/post_sentiment",
      // "http://127.0.0.1:5000/post_sentiment",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          blog_id: blogId,
          post_id: postId,
          comment_id: commentId,
          sentiment_type: iconId,
          user_who_selected_this_icon: userId,
        }),
      }
    )
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => {
        console.log("Error:", error);
      });
  };
  console.log(selectedSentimentIcon);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim() !== "") {
      fetch("https://typeit-api.onrender.com/post_comment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          blog_id: blogId,
          post_id: postId,
          post_title: post_title,
          comment: newComment,
          commented_user: userId,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("comment_data:", data); // Log the response data
          // Assuming setComments is a function to update the comments state
          setComments((prevComments) => [...prevComments, newComment]);
          setNewComment(""); // Reset the input field
        })
        .catch((error) => {
          console.error("Error:", error); // Log the error
          // Handle the error, show a user-friendly message, etc.
        });
    }
  };

  function timeSince(timeString) {
    if (!timeString) return "Invalid timestamp";

    const now = new Date();
    const timestamp = new Date(timeString); // Convert the ISO string to a Date object

    if (isNaN(timestamp.getTime())) return "Invalid date";

    const secondsPast = Math.floor((now - timestamp) / 1000);

    if (secondsPast < 60) return `${secondsPast} sec ago`;
    if (secondsPast < 3600) return `${Math.floor(secondsPast / 60)} min ago`;
    if (secondsPast <= 86400)
      return `${Math.floor(secondsPast / 3600)} hours ago`;
    if (secondsPast <= 86400 * 30) {
      const days = Math.floor(secondsPast / 86400);
      return `${days} day${days !== 1 ? "s" : ""} ago`;
    }
    if (secondsPast <= 86400 * 365) {
      const months = Math.floor(secondsPast / (86400 * 30));
      return `${months} month${months !== 1 ? "s" : ""} ago`;
    }
    const years = Math.floor(secondsPast / (86400 * 365));
    return `${years} year${years !== 1 ? "s" : ""} ago`;
  }

  const handleLogin = () => {
    console.log("handleLogin called");
    const currentUrl = window.location.href;
    // Redirect the user to the login page with the current URL as a query parameter
    window.location.href = `https://universal-jikv.onrender.com/login?redirectUrl=${encodeURIComponent(
      currentUrl
    )}`;
  };

  return (
    <div>
      <div>
        <form onSubmit={handleSubmit} className="flex flex-row justify-between">
          <input
            type="text"
            value={newComment} // Use newComment instead of e.target.value
            onChange={handleCommentChange}
            placeholder="Type your comment"
            className="border p-2 m-1 w-full border-slate-900 rounded-full"
            disabled={!isLoggedIn}
          />
          <button type="submit" className=" text-black p-1 m-1">
            <FontAwesomeIcon icon={faPaperPlane} />{" "}
          </button>
        </form>
      </div>
      <div className=" relative max-h-full border-t border-r border-gray-300 rounded-md shadow-2xl  p-1 pb-2 m-1">
        {isLoggedIn ? (
          comments.length > 0 ? (
            <ul>
              {comments.map((commentData, index) => (
                <div key={index}>
                  <li
                    key={commentData._id}
                    className={`m-1 p-1  ${
                      isSentimentActive ? "pb-4" : "pb-2"
                    } relative`}
                  >
                    {commentData.comment}
                    <div
                      className="text-xs italic text-slate-300  absolute left-1 mb-1 cursor-pointer"
                      onMouseEnter={() => {
                        setSentimentsActiveForComment(index, true);
                      }}
                      onMouseLeave={() => {
                        setSentimentsActiveForComment(index, false);
                      }}
                    >
                      <div className="flex">
                        <span className="flex-row">
                          {isSentimentActive[index] ? (
                            <div className="flex text-lg bg-transparent rounded-md  absolute left-1 mb-1 z-10">
                              <span>
                                <FontAwesomeIcon
                                  id="faHeart"
                                  className="pt-2 pb-2 pr-1 pl-1 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 hover:text-pink-400 duration-300"
                                  onClick={(event) =>
                                    handleSentimentIcon(
                                      index,
                                      event.currentTarget.id,
                                      commentData._id
                                    )
                                  }
                                  icon={faHeart}
                                />
                              </span>{" "}
                              <span>
                                <FontAwesomeIcon
                                  id="faThumbsUp"
                                  className="pt-2 pb-2 pr-1 pl-1 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 hover:text-blue-400 duration-300"
                                  onClick={(event) =>
                                    handleSentimentIcon(
                                      index,
                                      event.currentTarget.id,
                                      commentData._id
                                    )
                                  }
                                  icon={faThumbsUp}
                                />
                              </span>{" "}
                              <span>
                                <FontAwesomeIcon
                                  id="faFaceLaughSquint"
                                  className="pt-2 pb-2 pr-1 pl-1 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 hover:text-yellow-400 duration-300"
                                  onClick={(event) =>
                                    handleSentimentIcon(
                                      index,
                                      event.currentTarget.id,
                                      commentData._id
                                    )
                                  }
                                  icon={faFaceLaughSquint}
                                />
                              </span>{" "}
                              <span>
                                <FontAwesomeIcon
                                  id="faThumbsDown"
                                  className="pt-2 pb-2 pr-1 pl-1 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 hover:text-blue-400 duration-300"
                                  onClick={(event) =>
                                    handleSentimentIcon(
                                      index,
                                      event.currentTarget.id,
                                      commentData._id
                                    )
                                  }
                                  icon={faThumbsDown}
                                />
                              </span>
                            </div>
                          ) : index === selectedIndex ? (
                            <FontAwesomeIcon
                              icon={
                                selectedSentimentIcon === "faHeart"
                                  ? faHeart
                                  : selectedSentimentIcon === "faThumbsUp"
                                  ? faThumbsUp
                                  : selectedSentimentIcon ===
                                    "faFaceLaughSquint"
                                  ? faFaceLaughSquint
                                  : selectedSentimentIcon === "faThumbsDown"
                                  ? faThumbsDown
                                  : null
                              }
                              className={`text-lg ${
                                selectedSentimentIcon === "faHeart"
                                  ? "text-pink-400"
                                  : selectedSentimentIcon === "faThumbsUp"
                                  ? "text-blue-400"
                                  : selectedSentimentIcon ===
                                    "faFaceLaughSquint"
                                  ? "text-yellow-400"
                                  : selectedSentimentIcon === "faThumbsDown"
                                  ? "text-blue-400"
                                  : ""
                              }`}
                            />
                          ) : (
                            <div>
                              {commentData.sentiments ? (
                                Object.keys(commentData.sentiments).map(
                                  (sentimentKey) => {
                                    console.log("Sentiment Key:", sentimentKey);
                                    console.log(
                                      "Type of Sentiment Key:",
                                      typeof sentimentKey
                                    );
                                    return commentData.sentiments[
                                      sentimentKey
                                    ].includes(userId) ? (
                                      <div key={sentimentKey}>
                                        {sentimentKey === "faHeart" ? (
                                          <FontAwesomeIcon
                                            className="text-xs text-pink-400"
                                            icon={faHeart}
                                          />
                                        ) : sentimentKey === "faThumbsUp" ? (
                                          <FontAwesomeIcon
                                            className="text-xs text-blue-400"
                                            icon={faThumbsUp}
                                          />
                                        ) : sentimentKey ===
                                          "faFaceLaughSquint" ? (
                                          <FontAwesomeIcon
                                            className="text-xs text-yellow-400"
                                            icon={faFaceLaughSquint}
                                          />
                                        ) : sentimentKey === "faThumbsDown" ? (
                                          <FontAwesomeIcon
                                            className="text-xs text-blue-400"
                                            icon={faThumbsDown}
                                          />
                                        ) : null}
                                      </div>
                                    ) : (
                                      <div key={sentimentKey}>
                                        <FontAwesomeIcon icon={faHeart} />
                                      </div>
                                    );
                                  }
                                )
                              ) : (
                                <FontAwesomeIcon icon={faHeart} />
                              )}
                            </div>
                          )}
                        </span>

                        <span className="flex-row text-slate-900">
                          {"("}
                          {commentData.sentiments
                            ? Object.values(commentData.sentiments).reduce(
                                (accumulator, usersArray) =>
                                  accumulator + usersArray.length,
                                0
                              )
                            : null}
                          {")"}
                        </span>
                      </div>
                    </div>
                    <div className="text-xs italic text-slate-400 absolute right-1 mb-1 ">
                      {timeSince(commentData.timestamp)}
                    </div>
                  </li>
                </div>
              ))}
            </ul>
          ) : (
            <p>No comments available.</p>
          )
        ) : (
          <div>
            <button
              className="flex bg-slate-900 text-white p-1 justify-center mt-2 mb-auto  mx-auto my-auto rounded-md transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110"
              onClick={() => handleLogin()}
            >
              login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Comments;
