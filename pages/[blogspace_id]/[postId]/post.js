import React, { useEffect, useState } from "react";
import Head from "next/head";
import ReactMarkdown from "react-markdown";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faXmark, faFeather, faEye, faPlay, faPause, faStop } from "@fortawesome/free-solid-svg-icons";

import { faBookmark } from "@fortawesome/free-regular-svg-icons";
import Markdown from "markdown-to-jsx";
import MarkdownIt from "markdown-it";
// import ReactMarkdown from "react-markdown";
import TextToSpeech from "./texttospeech";
import Comments from "./comments";
import Header from "../../../components/header";
import Postsentiment from "./postsentiment";
import Sharepost from "./sharepost";
import Footer from "../../../components/footer";
import ImageResizer from "react-image-file-resizer";
import { NextSeo } from "next-seo";
import { format } from "date-fns";
// import { MarkdownBlock, MarkdownSpan } from "md-block";

const mdparser = new MarkdownIt();

const getUsernameById = async (userId) => {
  try {
    const response = await fetch(
      `https://usermgtapi-msad.onrender.com/api/get_user/${userId}`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return {
      username: data.username,
      image_base64: data.image_base64,
    };
  } catch (error) {
    console.error("Error fetching username:", error.message);
    return { username: "", image_base64: "" };
  }
};

const Post = ({ metadata, sorted, postViews }) => {
  const router = useRouter();
  const { blogspace_id, postId } = router.query || {};
  const [isPaused, setIsPaused] = useState(true);
  const [mediaStream, setMediaStream] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [chunks, setChunks] = useState([]);
  const [currentWord, setCurrentWord] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [sortedPosts, setSortedPosts] = useState([]);
  const [blogSpaceData, setBlogSpaceData] = useState("");

  useEffect(() => {
    fetch(`https://diaryblogapi-eul3.onrender.com/api/blogSpace/${blogspace_id}`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("post_views", data);
        setBlogSpaceData(data);
      })
      .catch((error) => {
        console.error("Error incrementing views:", error);
      });
  }, [blogspace_id]);

  const showCommentBar = () => {
    setIsActive(true);
  };

  const closeCommentBar = () => {
    setIsActive(false);
  };

  const width = 1200;
  const height = 627;

  const H1 = ({ children, id }) => (
    <h1 className="text-2xl font-bold mb-4" id={id}>
      {children}
    </h1>
  );
  const H2 = ({ children, id }) => (
    <h2 className="text-xl font-bold mb-4" id={id}>
      {children}
    </h2>
  );
  const H3 = ({ children, id }) => (
    <h3 className="text-lg font-bold mb-4" id={id}>
      {children}
    </h3>
  );
  const P = ({ children }) => <p className="mb-4">{children}</p>;
  const a = ({ children, href }) => (
    <a className="ml-4" style={{ color: "blue" }} href={href}>
      {children}
    </a>
  );
  // const a = ({ children, href, id }) => (
  //   <a className="text-blue hover:underline" href={href} id={id}>
  //     {children}
  //   </a>)
  // const A = ({ children, ...props }) => (
  //   <a className="text-blue-500 hover:underline" {...props}>
  //     {children}
  //   </a>
  // );
  const Img = ({ alt, src }) => (
    <div style={{ textAlign: "center" }}>
      <img
        alt={alt}
        src={src}
        style={{
          width: "100%",
          maxWidth: "500px",
          maxHeight: "300px",
          display: "block",
          margin: "0 auto",
          borderRadius: "5px",
        }}
      />
    </div>
  );

  const CodeBlock = ({ children }) => {
    return (
      <pre
        className="overflow-x-auto mb-4"
        style={{
          backgroundColor: "#f3f4f6",
          padding: "10px",
          borderRadius: "5px",
        }}
      >
        {children}
      </pre>
    );
  };

  const Ul = ({ children, id }) => (
    <ul className="list-disc list-inside mb-4" id={id}>
      {children}
    </ul>
  );
  const Ol = ({ children, id }) => (
    <ol className="list-decimal list-inside mb-4" id={id}>
      {children}
    </ol>
  );
  const Li = ({ children, id }) => (
    <li className="mb-2" id={id}>
      {children}
    </li>
  );
  const Blockquote = ({ children }) => (
    <blockquote className="border-l-4 border-gray-400 pl-2 mb-4">
      {children}
    </blockquote>
  );
  const Hr = () => <hr className="my-4 border-gray-400" />;
  const InlineCode = ({ children }) => (
    <code className="bg-gray-200 px-1 py-0.5 rounded-md">{children}</code>
  );
  const Table = ({ children }) => (
    <table className="border-collapse border border-gray-300 mb-4">
      {children}
    </table>
  );
  const THead = ({ children }) => (
    <thead className="bg-gray-100">{children}</thead>
  );
  const TBody = ({ children }) => <tbody>{children}</tbody>;
  const Tr = ({ children }) => <tr>{children}</tr>;
  const Th = ({ children }) => (
    <th className="border border-gray-300 p-2">{children}</th>
  );
  const Td = ({ children }) => (
    <td className="border border-gray-300 p-2">{children}</td>
  );
  const Emphasis = ({ children }) => <em>{children}</em>;
  const Strong = ({ children }) => <strong>{children}</strong>;
  const H4 = ({ children }) => (
    <h4 className="text-lg font-bold mb-4">{children}</h4>
  );
  const H5 = ({ children }) => (
    <h5 className="text-base font-bold mb-4">{children}</h5>
  );
  const H6 = ({ children }) => (
    <h6 className="text-sm font-bold mb-4">{children}</h6>
  );
  // const Link = ({ children, href, id }) => (
  //   <a className="text-blue-500 hover:underline" href={href} id={id}>
  //     {children}
  //   </a>
  // );
  const Figure = ({ children }) => <figure className="mb-4">{children}</figure>;
  const Figcaption = ({ children }) => (
    <figcaption className="text-sm text-gray-500 mt-2">{children}</figcaption>
  );
  const Abbr = ({ children, title }) => <abbr title={title}>{children}</abbr>;
  const Dl = ({ children }) => <dl className="mb-4">{children}</dl>;
  const Dt = ({ children }) => <dt className="font-bold mb-1">{children}</dt>;
  const Dd = ({ children }) => <dd className="mb-2">{children}</dd>;
  const Strikethrough = ({ children }) => <del>{children}</del>;
  const Superscript = ({ children }) => <sup>{children}</sup>;
  const Subscript = ({ children }) => <sub>{children}</sub>;

  const handleBackClick = () => {
    router.back();
  };

  const stripMarkdown = (md) => {
    let content = md.replace(/#+\s+/g, "");
    content = content.replace(/---/g, "");
    content = content.replace(/\!\[.*\]\(.*\)/g, "");
    content = content.replace(/\[.*\]\(.*\)/g, "");
    content = content.replace(/(\*\*|__)?\*.*\*\*(\*\*|__)?/g, "");
    return content;
  };

  const wordsPerMinute = 200;

  const calculateTimeToRead = (wordCount) => {
    const minutes = wordCount / wordsPerMinute;
    return Math.ceil(minutes);
  };

  const wordCount = metadata.description.split(" ").length;
  const timeToRead = calculateTimeToRead(wordCount);

  // const formatDate = (dateString) => {
  //   const options = { year: "numeric", month: "long", day: "numeric" };
  //   return new Date(dateString).toLocaleDateString(undefined, options);
  // };

  const formatDate = (date) => {
    return format(new Date(date), "MMMM d, yyyy"); // Format the date as "Month day, year"
  };

  
  const handleHighlight = (text, from, to) => {
    let replacement = `<span style="background-color:yellow;">${text.slice(from, to)}</span>`;
    return text.substring(0, from) + replacement + text.substring(to);
  };

  const startScreenRecording = async () => {
    try {
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });

      const audioStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      const combinedStream = new MediaStream([
        ...displayStream.getTracks(),
        ...audioStream.getTracks(),
      ]);

      const recorder = new MediaRecorder(combinedStream, { mimeType: "video/webm" });

      recorder.ondataavailable = (event) => {
        setChunks((prevChunks) => [...prevChunks, event.data]);
      };

      recorder.start();
      setMediaRecorder(recorder);
      setMediaStream(displayStream);

      // setTimeout(() => {
      //   recorder.stop();
      //   stopScreenRecording();
      // }, 5000); // Recording duration
    } catch (error) {
      console.error("Error starting screen recording:", error);
    }
  };
  
  const handlePlay = () => {
    const synth = window.speechSynthesis;
    if (!synth) {
      console.error("Text-to-speech not supported");
      return;
    }
    let text = document.getElementById("text");
    let originalText = text.innerText;
    let utterance = new SpeechSynthesisUtterance(originalText);
    utterance.addEventListener("boundary", (event) => {
      text.innerHTML = handleHighlight(originalText, event.charIndex, event.charIndex + event.charLength);
      setCurrentWord(originalText.substring(event.charIndex, event.charIndex + event.charLength).trim());
    });
    synth.speak(utterance);
    setIsPaused(false);
  };
  const handlePause = () => {
    const synth = window.speechSynthesis;
    if (synth) {
      synth.pause();
      setIsPaused(true);
    }
  };

  const handleResume = () => {
    const synth = window.speechSynthesis;
    if (synth) {
      synth.resume();
      setIsPaused(false);
    }
  };

  const handleStop = () => {
    const synth = window.speechSynthesis;
    if (synth) {
      synth.cancel();
      setIsPaused(true);
    }
  };

 

  const stopScreenRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setMediaRecorder(null);
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
        setMediaStream(null);
      }
    }
  };

  const combineAndDownload = () => {
    if (chunks.length === 0) {
      console.error("No screen recording available");
      return;
    }

    const blob = new Blob(chunks, { type: "video/webm" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "recorded-video.webm";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // Optional: Create a video element to play back the recording
    // const videoElement = document.createElement("video");
    // videoElement.src = url;
    // videoElement.controls = true;
    // document.body.appendChild(videoElement);
    // videoElement.play();
  };


  return (
    <>
      <NextSeo
        title={metadata.title}
        description={metadata.description}
        openGraph={{
          title: metadata.title,
          description: metadata.description,
          images: [
            {
              url: metadata.imageUrl,
              width: 1200,
              height: 627,
              alt: "Diary Blog",
            },
          ],
          locale: "en_US",
          type: "article",
          url: router.asPath,
          article: {
            publishedTime: metadata.createDate,
            authors: [metadata.author],
          },
        }}
        twitter={{
          title: metadata.title,
          description: metadata.description,
          cardType: "summary",
          site: "@PeopleConInc",
          image: metadata.imageUrl,
        }}
        canonical={router.asPath}
      />

      <div>
        <Header />
        <div className="relative pt-3 bg-white p-3 md:p-0 lg:p-0">
          <div
            className={`bg-white text-black border border-slate-900 p-1 mt-4 ${
              isActive
                ? "fixed top-15 right-0 w-3/4 md:w-1/6 lg:w-1/6 h-2/3 md:h-3/4 lg:h-3/4 bg-gray-100 rounded-md p-2 transition-transform duration-10000 ease-in-out shadow-md z-999"
                : "fixed top-40 right-[-1%] bg-gray-100 rounded-full p-2 shadow-md text-md md:text-2xl lg:text-2xl"
            } `}
            onMouseEnter={showCommentBar}
            style={{ zIndex: 100 }}
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
            <div className="m-0 md:m-1 lg:m-1 font-mono text-md md:text-2xl lg:text-2xl">
              {isActive ? (
                <h1>
                  Type IT <FontAwesomeIcon icon={faFeather} />
                </h1>
              ) : (
                <FontAwesomeIcon icon={faFeather} />
              )}
            </div>
            {isActive ? (
              <Comments
                blogId={blogspace_id}
                postId={postId}
                post_title={metadata.title}
              />
            ) : null}
          </div>
          <div
            className={`my-5 mt-3 w-full md:w-4/5 mx-auto ${
              isActive ? "ml-4 mr-1" : "mx-auto"
            }`}
          >
            <div className="relative mx-auto justify-center flex items-center">
              <img
                className="w-full sm:w-11/12 md:w-4/5 lg:w-4/5 h-1/2 object-cover rounded-md mt-5 mb-1 mx-5 justify-center"
                src={metadata.imageUrl || "path-to-default-image.jpg"}
                alt={`Image for ${metadata.title}`}
              />
              <button
                className="hidden sm:block absolute top-4 left-11 hover:bg-transparent transform transition-transform duration-300 ease-in-out hover:scale-105 z-10"
                onClick={handleBackClick}
              >
                <FontAwesomeIcon icon={faArrowLeft} />
              </button>
            </div>
            <div className="p-5 pt-0">
              <div className="mb-2">
                <h1 className="text-2xl mb-5 text-black font-semibold">
                  {metadata.title}
                </h1>
                <div className="flex flex-col md:flex-row md:justify-between md:items-center text-primary-500">
                  <div className="flex items-center text-slate-900 mb-2 md:mb-0">
                    <img
                      src={`data:image/jpeg;base64, ${metadata.image_base64}`}
                      alt="avatar"
                      className="object-cover w-10 h-10 mx-2 rounded-full"
                    />
                    <span className="flex flex-col">
                      <a
                        href={`/profile?user_id=${encodeURIComponent(
                          metadata.author
                        )}`}
                        className="text-lg hover:underline hover:decoration-1"
                      >
                        {metadata.username}
                      </a>
                      <div className="flex flex-row text-slate-900 text-sm text-center items-center space-x-2">
                        <p className="hidden md:block">Published in</p>
                        <img
                          className="object-fill w-4 h-4 rounded-full"
                          src={blogSpaceData.image_url}
                          alt="Blog Space"
                        />
                        <a href={`/${blogspace_id}/viewposts`}>
                          {blogSpaceData.name}
                        </a>
                        <a
                          href={`/${blogspace_id}/subscribe`}
                          className="text-blue-400 font-bold underline decoration-1"
                        >
                          Follow
                        </a>
                      </div>
                    </span>
                  </div>
                  <div className="text-sm font-medium leading-6 text-gray-500">
                    <div>{formatDate(metadata.createDate)}</div>
                  </div>
                </div>
              </div>
              <div className="flex flex-row text-sm md:text-sm lg:text-sm justify-between items-center text-center ">
                <div className="flex flex-row">
                  <span className="w-10 flex-row text-sm md:text-sm lg:text-sm">
                    <Postsentiment
                      postId={postId}
                      blogId={blogspace_id}
                      postlikes={metadata.likes ? metadata.likes.length : ""}
                      postStatus={metadata.status}
                    />
                  </span>
                  <span className="w-10 flex-row text-sm md:text-sm lg:text-sm">
                    <Sharepost
                      post_title={metadata.title}
                      post_image={metadata.imageUrl}
                      post_description={metadata.description}
                      postStatus={metadata.status}
                    />
                  </span>
                </div>
                <div className="flex flex-row text-slate-900 text-sm space-x-4">
                  <div className="flex flex-row text-sm items-center text-center justify-center space-x-1 ">
                    <FontAwesomeIcon className="text-md" icon={faEye} />
                    {/* {metadata.views} */}
                    <p>{postViews}</p>
                  </div>

                  <div className="bg-white">
                    <FontAwesomeIcon icon={faBookmark} />
                  </div>

                  <div className="italic">{timeToRead} min</div>
                </div>
              </div>
              <div id="text" className="pt-8 text-black leading-6 text-justify">
                <Markdown
                  options={{
                    overrides: {
                      h1: { component: H1 },
                      h2: { component: H2 },
                      h3: { component: H3 },
                      p: { component: P },
                      img: { component: Img },
                      hr: { component: Hr },
                      a: { component: a },
                      code: { component: CodeBlock },
                      ul: { component: Ul },
                      ol: { component: Ol },
                      li: { component: Li },
                      blockquote: { component: Blockquote },
                      inlineCode: { component: InlineCode },
                      table: { component: Table },
                      thead: { component: THead },
                      tbody: { component: TBody },
                      tr: { component: Tr },
                      th: { component: Th },
                      td: { component: Td },
                      em: { component: Emphasis },
                      strong: { component: Strong },
                      h4: { component: H4 },
                      h5: { component: H5 },
                      h6: { component: H6 },
                      // link: { component: Link },
                      figure: { component: Figure },
                      figcaption: { component: Figcaption },
                      abbr: { component: Abbr },
                      dl: { component: Dl },
                      dt: { component: Dt },
                      dd: { component: Dd },
                      del: { component: Strikethrough },
                      sup: { component: Superscript },
                      sub: { component: Subscript },
                    },
                  }}
                >

                  {metadata.description}
                 
                </Markdown>
                {/* <pre>
                  <code>{metadata.description}</code>
                </pre> */}
                {/* <ReactMarkdown>{metadata.description}</ReactMarkdown> */}
                {/* <MarkdownBlock>{metadata.description}</MarkdownBlock> */}
                <TextToSpeech
                  text={stripMarkdown(metadata.description)}
                  setCurrentWord={setCurrentWord}
                  currentWord={currentWord}
                  isActive={isActive}
                />
              </div>
             
            </div>
            <div className="mt-4 flex space-x-4">
  <button
onClick={() => {
  handlePlay();
  startScreenRecording();
}}    className="bg-blue-500 text-white hover:bg-blue-700 active:bg-blue-800 px-4 py-2 rounded"
  >
    <FontAwesomeIcon icon={faPlay} className="mr-1" />
    Play
  </button>
  <button
    onClick={handlePause}
    className="bg-yellow-500 text-white hover:bg-yellow-700 active:bg-yellow-800 px-4 py-2 rounded"
  >
    <FontAwesomeIcon icon={faPause} className="mr-1" />
    Pause
  </button>
  <button
    onClick={handleStop}
    className="bg-red-500 text-white hover:bg-red-700 active:bg-red-800 px-4 py-2 rounded"
  >
    <FontAwesomeIcon icon={faStop} className="mr-1" />
    Stop
  </button>
  <button
          onClick={stopScreenRecording}
          className="bg-red-500 text-white hover:bg-red-700 active:bg-red-800 px-4 py-2 rounded"
        >
          <FontAwesomeIcon icon={faStop} className="mr-1" />
          Stop Recording
        </button>
        <button
          onClick={combineAndDownload}
          className="bg-green-500 text-white hover:bg-green-700 active:bg-green-800 px-4 py-2 rounded"
        >
          Download Video
        </button>
</div>

          </div>
        </div>
        
        <Footer />
      </div>
    </>
  );
};

export async function generateMetadata(params) {
  const { blogspace_id, postId } = params;
  const response = await fetch(
    `https://diaryblogapi-eul3.onrender.com/api/companies/${blogspace_id}/posts/${postId}`
  );
  const post = await response.json();
  return post;
}

export async function getServerSideProps(context) {
  const { params } = context;
  const metadata = await generateMetadata(params);
  const userData = await getUsernameById(metadata.author);

  const postId = metadata._id;
  const response = await fetch(
    `https://diaryblogapi-eul3.onrender.com/api/posts/${postId}/views`,
    {
      method: "PUT",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update post views");
  }

  const postViewsData = await response.json();
  const postViews = postViewsData.views;

  metadata.username = userData.username;
  metadata.image_base64 = userData.image_base64;

  const sorted = []; // Replace this with your actual sorted array
  return {
    props: {
      metadata,
      sorted,
      postViews,
    },
  };
}

export default Post;
