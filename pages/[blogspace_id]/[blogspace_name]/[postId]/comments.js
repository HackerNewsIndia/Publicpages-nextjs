// CommentBar.js

import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { faFaceLaughSquint } from "@fortawesome/free-solid-svg-icons";
import { faThumbsDown } from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-svg-core/styles.css";
const Comments = ({ blogId, postId, post_title }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isSentimentActive, setIsSentimentActive] = useState(false);
  // const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch comments using the post ID
    const fetchComments = async () => {
      try {
        const response = await fetch(
          `https://typeit-api.onrender.com/get_comments/${postId}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        // Assuming the response structure is { comments: [...] }
        console.log("commentData:", data);
        setComments(data.comments);
      } catch (error) {
        console.error("error in fetching comments", error.message);
      }
    };

    fetchComments();
  }, [postId]);

  console.log(comments);

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const sentimentsActive = () => {
    setIsSentimentActive(true);
  };
  const sentimentsInactive = () => {
    setIsSentimentActive(false);
  };

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
          />
          <button type="submit" className=" text-black p-1 m-1">
            <FontAwesomeIcon icon={faPaperPlane} />{" "}
          </button>
        </form>
      </div>
      <div className=" relative h-full border-t border-r border-gray-300 rounded-md shadow-2xl  p-1 pb-2 m-1">
        {comments.length > 0 ? (
          <ul>
            {comments.map((commentData, index) => (
              <div key={index}>
                <li className="m-1 p-1 pb-2 relative">
                  {commentData.comment}
                  <div
                    className="text-xs italic text-slate-300  absolute left-1 mb-1 cursor-pointer"
                    onMouseEnter={sentimentsActive}
                    onMouseLeave={sentimentsInactive}
                  >
                    {isSentimentActive ? (
                      <div className="flex text-lg text-slate-900 border border-slate-400 bg-white rounded-md  absolute left-1 mb-1 z-10">
                        {console.log("sentimentActive")}
                        <span>
                          <FontAwesomeIcon
                            className="pt-2 pb-2 pr-1 pl-1"
                            icon={faHeart}
                          />
                        </span>{" "}
                        <span>
                          <FontAwesomeIcon
                            className="pt-2 pb-2 pr-1 pl-1"
                            icon={faThumbsUp}
                          />
                        </span>{" "}
                        <span>
                          <FontAwesomeIcon
                            className="pt-2 pb-2 pr-1 pl-1"
                            icon={faFaceLaughSquint}
                          />
                        </span>{" "}
                        <span>
                          <FontAwesomeIcon
                            className="pt-2 pb-2 pr-1 pl-1"
                            icon={faThumbsDown}
                          />
                        </span>
                      </div>
                    ) : (
                      <FontAwesomeIcon icon={faHeart} />
                    )}
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
        )}
      </div>
    </div>
  );
};

export default Comments;
