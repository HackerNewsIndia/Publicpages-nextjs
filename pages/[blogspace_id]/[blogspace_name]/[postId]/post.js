import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
// import { useParams, useNavigate } from "react-router-dom";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Markdown from "markdown-to-jsx";
import TextToSpeech from "./TextToSpeech";
import AudioPlayer from "./AudioPlayer";

const Post = () => {
  const router = useRouter();
  const { blogspace_id, postId } = router.query || {};
  const [currentWord, setCurrentWord] = useState("");

  const [post, setPost] = useState(null);

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
    <div className="bg-gray-200 h-full mt-4 pt-4 ">
      <div className="mx-auto my-8 mt-5 w-4/5 shadow-2xl transition-shadow duration-300 ease-in-out bg-white rounded-lg overflow-hidden mb-8 hover:shadow-lg">
        <div className="relative">
          <button
            className="mt-1 mr-24 ml-8 hover:bg-transparent transform transition-transform duration-300 ease-in-out hover:scale-105"
            onClick={handleBackClick}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <img
            src={post.imageUrl || "path-to-default-image.jpg"}
            alt={`Image for ${post.title}`}
            className="w-3/4 h-3/5 mx-auto object-cover rounded-md justify-center transform transition-transform duration-300 ease-in-out hover:scale-105"
          />
        </div>
        <div className="p-5">
          <h1 className="text-2xl mb-4 text-gray-800 font-semibold">
            {post.title}
          </h1>
          <div className="text-gray-500 leading-6">
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
            />
            {/* <AudioPlayer audioSrc={''}/> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
