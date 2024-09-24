import React, { useEffect, useState } from "react";
import Head from "next/head";
import ReactMarkdown from "react-markdown";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faXmark,
  faFeather,
  faEye,
  faPlay,
  faPause,
  faStop,
} from "@fortawesome/free-solid-svg-icons";
import { faDownload } from "@fortawesome/free-solid-svg-icons";

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
import { marked } from "marked";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

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
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloadingAudio, setIsDownloadingAudio] = useState(false);
  const [currentWord, setCurrentWord] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [blogSpaceData, setBlogSpaceData] = useState("");
  const [images, setImages] = useState([]);
  const [plainText, setPlainText] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isStopped, setIsStopped] = useState(true);
  const [wordCount200, setWordCount200] = useState(false);
  const [isBlogLengthy, setIsBlogLengthy] = useState(false);

  const handleDownload = async (e) => {
    e.preventDefault();
    setIsDownloading(true);

    const formData = new FormData();
    formData.append("text_data", plainText);
    // formData.append("image_urls[]", images);
    images.forEach(url => {
  formData.append('image_urls[]', url);
});

    if (wordCount200 == true) {
      try {
        const response = await fetch(
          "https://1547b30e-b2a6-4d2d-9122-6d371be8f3d3-00-2iyc3gxjp1bz.sisko.replit.dev/",
          // "https://text-to-video-api.onrender.com/",
          {
            method: "POST",
            body: formData,
          }
        );

        if (response.ok) {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `${metadata.title}.mp4`;
          document.body.appendChild(a);
          a.click();
          a.remove();
          window.URL.revokeObjectURL(url);
        } else {
          const errorText = await response.text();
          console.error("Error:", errorText);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsDownloading(false);
      }
    } else {
      console.log("text is too lengthy to convert into video");
      setIsBlogLengthy(true);
    }
  };

  const handleDownloadaudio = async () => {
    setIsDownloadingAudio(true);
    try {
      const response = await fetch(
        "https://1547b30e-b2a6-4d2d-9122-6d371be8f3d3-00-2iyc3gxjp1bz.sisko.replit.dev/"
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `${metadata.title}.mp4`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading the video:", error.message);
    } finally {
      setIsDownloadingAudio(false);
    }
  };

  useEffect(() => {
    // console.log("description:", metadata.description);
    const htmlContent = marked(metadata.description);
    // console.log("htmlContent:", htmlContent);
    const temporaryElement = document.createElement("div");
    // console.log("temporaryElement:", temporaryElement);

    temporaryElement.innerHTML = htmlContent;
    // console.log("temporaryElement.innerHTML:", temporaryElement.innerHTML);
    // console.log("temporaryElement.innerText:", temporaryElement.innerText);
    const text = temporaryElement.innerText;
    // console.log(text);
    setPlainText(text);
    const wordCount = text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
    console.log("wordCount of text :", wordCount);
    if (wordCount <= 200) {
      setWordCount200(true);
    }

    // Parse the HTML content
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");

    // Get all the img tags
    const imgTags = doc.querySelectorAll("img");

    // Extract the src attributes (image URLs)
    const imageUrls = Array.from(imgTags).map((img) => img.src);

    console.log("imageUrls", imageUrls);
    const combinedImageUrls = [metadata.imageUrl, ...imageUrls];
    setImages(combinedImageUrls);
  }, [metadata]);
  console.log("text:", plainText);
  console.log("image_url:", images);

  useEffect(() => {
    fetch(
      `https://diaryblogapi-eul3.onrender.com/api/blogSpace/${blogspace_id}`,
      {
        method: "GET",
      }
    )
      .then((response) => response.json())
      .then((data) => {
        // console.log("post_views", data);
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
    <code
      style={{
        backgroundColor: "#f5f5f5",
        color: "#d63384",
        padding: "2px 4px",
        borderRadius: "4px",
        fontFamily: "monospace",
      }}
    >
      {children}
    </code>
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
    console.log("wordcount:", wordCount);
    const minutes = wordCount / wordsPerMinute;
    return Math.ceil(minutes);
  };

  const word_count = metadata.description.split(" ").length;
  const timeToRead = calculateTimeToRead(word_count);

  // const formatDate = (dateString) => {
  //   const options = { year: "numeric", month: "long", day: "numeric" };
  //   return new Date(dateString).toLocaleDateString(undefined, options);
  // };

  const formatDate = (date) => {
    return format(new Date(date), "MMMM d, yyyy"); // Format the date as "Month day, year"
  };

  const handleHighlight = (text, from, to) => {
    let replacement = `<span style="background-color:yellow;">${text.slice(
      from,
      to
    )}</span>`;
    return text.substring(0, from) + replacement + text.substring(to);
  };

  const handlePlay = () => {
    const synth = window.speechSynthesis;
    if (!synth) {
      console.error("no tts");
      return;
    }
    let text = document.getElementById("text");
    let originalText = text.innerText;
    let utterance = new SpeechSynthesisUtterance(originalText);
    utterance.addEventListener("boundary", (event) => {
      text.innerHTML = handleHighlight(
        originalText,
        event.charIndex,
        event.charIndex + event.charLength
      );
    });
    utterance.onend = () => {
      text.innerHTML = originalText;
      setIsPlaying(false);
      setIsPaused(false);
      setIsStopped(true);
    };
    synth.speak(utterance);
    setIsPlaying(true);
    setIsPaused(false);
    setIsStopped(false);
  };

  const handlePause = () => {
    const synth = window.speechSynthesis;
    if (synth && isPlaying) {
      synth.pause();
      setIsPaused(true);
      setIsPlaying(false);
    }
  };

  const handleResume = () => {
    const synth = window.speechSynthesis;
    if (synth && isPaused) {
      synth.resume();
      setIsPaused(false);
      setIsPlaying(true);
    }
  };

  const handleStop = () => {
    const synth = window.speechSynthesis;
    if (synth) {
      synth.cancel();
      setIsPlaying(false);
      setIsPaused(false);
      setIsStopped(true);
    }
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
            <div className="flex flex-wrap justify-center md:justify-start space-x-4">
              <button
                onClick={handlePlay}
                className={`bg-blue-500 text-white hover:bg-blue-700 active:bg-blue-800 px-4 py-2 rounded ${
                  isPlaying || !isStopped ? "opacity-50 cursor-not-allowed" : ""
                } ${"md:flex md:items-center md:space-x-2"} ${"flex items-center justify-center"}`}
                disabled={isPlaying || !isStopped}
              >
                <FontAwesomeIcon icon={faPlay} className="mr-1 text-lg" />
                <span className="hidden md:inline">Play</span>
              </button>
              <button
                onClick={handlePause}
                className={`bg-yellow-500 text-white hover:bg-yellow-700 active:bg-yellow-800 px-4 py-2 rounded ${
                  !isPlaying ? "opacity-50 cursor-not-allowed" : ""
                } ${"md:flex md:items-center md:space-x-2"} ${"flex items-center justify-center"}`}
                disabled={!isPlaying}
              >
                <FontAwesomeIcon icon={faPause} className="mr-1 text-lg" />
                <span className="hidden md:inline">Pause</span>
              </button>
              <button
                onClick={handleResume}
                className={`bg-green-500 text-white hover:bg-green-700 active:bg-green-800 px-4 py-2 rounded ${
                  !isPaused ? "opacity-50 cursor-not-allowed" : ""
                } ${"md:flex md:items-center md:space-x-2"} ${"flex items-center justify-center"}`}
                disabled={!isPaused}
              >
                <FontAwesomeIcon icon={faPlay} className="mr-1 text-lg" />
                <span className="hidden md:inline">Resume</span>
              </button>
              <button
                onClick={handleStop}
                className={`bg-red-500 text-white hover:bg-red-700 active:bg-red-800 px-4 py-2 rounded ${
                  !isPlaying && !isPaused ? "opacity-50 cursor-not-allowed" : ""
                } ${"md:flex md:items-center md:space-x-2"} ${"flex items-center justify-center"}`}
                disabled={!isPlaying && !isPaused}
              >
                <FontAwesomeIcon icon={faStop} className="mr-1 text-lg" />
                <span className="hidden md:inline">Stop</span>
              </button>

              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className={`${
                  isDownloading ? "opacity-50 cursor-not-allowed" : ""
                } bg-blue-500 text-white px-4 py-2 rounded-md flex items-center ${
                  isDownloading ? "space-x-2" : "space-x-2 md:space-x-2"
                }`}
              >
                {isDownloading ? (
                  <FontAwesomeIcon icon={faSpinner} spin className="text-lg" />
                ) : (
                  <FontAwesomeIcon icon={faDownload} className="text-lg" />
                )}
                <span className={`hidden md:inline`}>
                  {isDownloading ? "Downloading Video..." : "Download Video"}
                </span>
              </button>
              <button
                onClick={handleDownloadaudio}
                disabled={isDownloadingAudio}
                className={`bg-blue-500 text-white px-4 py-2 rounded-md flex items-center ${
                  isDownloadingAudio
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-blue-700 active:bg-blue-800"
                }`}
              >
                {isDownloadingAudio ? (
                  <FontAwesomeIcon icon={faSpinner} spin className="text-lg" />
                ) : (
                  <FontAwesomeIcon icon={faDownload} className="text-lg" />
                )}
                <span className={`hidden md:inline`}>
                  {isDownloadingAudio
                    ? "Downloading Audio..."
                    : "Download Audio"}
                </span>
              </button>
              {isBlogLengthy == true && (
                <p className="text-red-500">
                  Blog is lengthy and cannot be downloaded
                </p>
              )}
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
