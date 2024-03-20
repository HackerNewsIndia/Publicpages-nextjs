import React, { useEffect, useState } from "react";
import Head from "next/head";
import ReactMarkdown from "react-markdown";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { faFeather } from "@fortawesome/free-solid-svg-icons";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { faBookmark } from "@fortawesome/free-regular-svg-icons";
import Markdown from "markdown-to-jsx";
import TextToSpeech from "./texttospeech";
import Comments from "./comments";
import Header from "../../../components/header";
import Postsentiment from "./postsentiment";
import Sharepost from "./sharepost";
import Footer from "../../../components/footer";
import ImageResizer from "react-image-file-resizer";
import { NextSeo } from "next-seo";
import { format } from "date-fns";

const getUsernameById = async (userId) => {
  try {
    const response = await fetch(
      `https://usermgtapi3.onrender.com/api/get_user/${userId}`
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
  const [currentWord, setCurrentWord] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [sortedPosts, setSortedPosts] = useState([]);
  const [blogSpaceData, setBlogSpaceData] = useState("");

  useEffect(() => {
    fetch(`https://diaryblogapi2.onrender.com/api/blogSpace/${blogspace_id}`, {
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
  const a = ({ children }) => <a style={{ color: "blue" }}>{children}</a>;
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
              <div className="pt-8 text-black leading-6 text-justify">
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
                    },
                  }}
                >
                  {metadata.description}
                </Markdown>
                <TextToSpeech
                  text={stripMarkdown(metadata.description)}
                  setCurrentWord={setCurrentWord}
                  currentWord={currentWord}
                  isActive={isActive}
                />
              </div>
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
    `https://diaryblogapi2.onrender.com/api/companies/${blogspace_id}/posts/${postId}`
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
    `https://diaryblogapi2.onrender.com/api/posts/${postId}/views`,
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
