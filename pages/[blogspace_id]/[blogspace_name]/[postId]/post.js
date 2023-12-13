import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
// import { useParams, useNavigate } from "react-router-dom";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { faFeather } from "@fortawesome/free-solid-svg-icons";
import Markdown from "markdown-to-jsx";
import TextToSpeech from "./TextToSpeech";
import AudioPlayer from "./AudioPlayer";
import Comments from "./comments";

const Post = () => {
  const router = useRouter();
  const { blogspace_id, postId } = router.query || {};
  const [currentWord, setCurrentWord] = useState("");

  const [post, setPost] = useState(null);
  const [isActive, setIsActive] = useState(false);

  const showCommentBar = () => {
    setIsActive(true);
  };

  const hideCommentBar = () => {
    setIsActive(false);
  };

  const closeCommentBar = () => {
    setIsActive(false);
  };

  const H1 = ({ children }) => (
    <h1 className="text-2xl font-bold mb-4">{children}</h1>
  );
  const H2 = ({ children }) => (
    <h2 className="text-xl font-bold mb-4">{children}</h2>
  );
  const H3 = ({ children }) => (
    <h3 className="text-lg font-bold mb-4">{children}</h3>
  );
  const P = ({ children }) => <p className="mb-4">{children}</p>;
  const Hr = () => <hr />;

  // Define custom components for images
  const Img = ({ alt, src }) => (
    <div style={{ textAlign: "center" }}>
      <img
        alt={alt}
        src={src}
        style={{
          width: "70%",
          maxWidth: "500px",
          maxHeight: "300px",
          display: "block",
          margin: "0 auto",
          borderRadius: "5px",
        }}
      />
    </div>
  );

  const blogId = router.query.blogspace_id;
  const post_id = router.query.postId;
  useEffect(() => {
    // Fetch the post details here using the companyName and postId
    console.log("Company:", blogId, "PostId:", post_id);
    fetch(
      `https://diaryblogapi2.onrender.com/api/companies/${blogId}/posts/${post_id}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch post details");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setPost(data);
      })
      .catch((error) => {
        console.log("Error fetching post details", error);
      });
  }, [blogspace_id, postId]);

  const handleBackClick = () => {
    router.back();
  };

  if (!post) {
    return <div>Loading...</div>;
  }

  const stripMarkdown = (md) => {
    // Remove headers
    let content = md.replace(/#+\s+/g, "");
    //Remove separation line
    content = content.replace(/---/g, "");
    // Remove images
    content = content.replace(/\!\[.*\]\(.*\)/g, "");
    // Remove inline links
    content = content.replace(/\[.*\]\(.*\)/g, "");
    // Remove bold, italics, etc.
    content = content.replace(/(\*\*|__)?\*.*\*\*(\*\*|__)?/g, "");
    // Remove any other markdown symbols you want

    return content;
  };

  return (
    <div className=" h-full pt-4 bg-gray-200 ">
      <div
        className={`bg-white text-black border border-slate-900 p-1 mt-4 ${
          isActive
            ? "fixed top-15 right-0 w-1/6 h-5/6 bg-gray-100 rounded-md p-2 transition-transform duration-10000 ease-in-out shadow-md z-50"
            : "fixed top-20 right-[-1%] bg-gray-100 rounded-full p-2 shadow-md text-2xl"
        } `}
        onMouseEnter={showCommentBar}
        // onMouseLeave={hideCommentBar}
      >
        <div>
          {isActive ? (
            <button
              onClick={closeCommentBar}
              className="absolute top-[-2%] right-[-1%] bg-white border border-slate-900 w-6 h-6 rounded-full hover:bg-black hover:text-white "
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
          ) : null}
        </div>
        <div className="m-1 font-mono text-2xl">
          {isActive ? (
            <h1>
              Type IT <FontAwesomeIcon icon={faFeather} />
            </h1>
          ) : (
            <FontAwesomeIcon icon={faFeather} />
          )}
        </div>

        {isActive ? (
          <Comments blogId={blogId} postId={post_id} post_title={post.title} />
        ) : null}
      </div>

      <div
        className={` my-8 mt-5 w-4/5 shadow-2xl shadow-slate-950 border border-slate-500 bg-white ${
          isActive ? "ml-4 mr-1" : "mx-auto"
        }  transition-shadow duration-300 ease-in-out rounded-lg overflow-hidden mb-8 hover:shadow-2xl hover:shadow-slate-950`}
      >
        <div className="relative ">
          <img
            src={post.imageUrl || "path-to-default-image.jpg"}
            alt={`Image for ${post.title}`}
            className="w-fit h-max mx-auto object-cover rounded-md justify-center transform transition-transform duration-300 ease-in-out "
          />
          <button
            className="absolute top-2 left-8 hover:bg-transparent transform transition-transform duration-300 ease-in-out hover:scale-105 z-10"
            onClick={handleBackClick}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
        </div>
        <div className="p-5">
          <h1 className="text-2xl mb-4 text-black font-semibold">
            {post.title}
          </h1>
          <div className="text-black leading-6">
            <Markdown
              options={{
                overrides: {
                  h1: { component: H1 },
                  h2: { component: H2 },
                  h3: { component: H3 },
                  p: { component: P },
                  img: { component: Img },
                  hr: { component: Hr },
                },
              }}
            >
              {post.description}
            </Markdown>
            <TextToSpeech
              text={stripMarkdown(post.description)}
              setCurrentWord={setCurrentWord}
              currentWord={currentWord}
              isActive={isActive}
            />
            {/* <AudioPlayer audioSrc={''}/> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
