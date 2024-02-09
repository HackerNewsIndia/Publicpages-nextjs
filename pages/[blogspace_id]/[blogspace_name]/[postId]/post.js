import React, { useEffect, useState } from "react";
import Head from "next/head";
import ReactMarkdown from "react-markdown";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { faFeather } from "@fortawesome/free-solid-svg-icons";
import Markdown from "markdown-to-jsx";
import TextToSpeech from "./texttospeech";
import Comments from "./comments";
import Header from "../../../../components/header";
import Postsentiment from "./postsentiment";
import Sharepost from "./sharepost";
import Footer from "../../../../components/footer";

const Post = ({ metadata }) => {
  const router = useRouter();
  const { blogspace_id, postId } = router.query || {};
  const [currentWord, setCurrentWord] = useState("");
  // const [post, setPost] = useState(null);
  const [isActive, setIsActive] = useState(false);
  console.log(metadata);
  const showCommentBar = () => {
    setIsActive(true);
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
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const params = { blogspace_id, postId };
  //       const metadata = await generateMetadata(params);
  //       setMetadata(metadata);
  //     } catch (error) {
  //       console.error("Error fetching metadata:", error);
  //     }
  //   };
  //   fetchData();
  // }, [blogspace_id, postId]);
  const handleBackClick = () => {
    router.back();
  };
  // if (!metadata) {
  //   return <div>Loading...</div>;
  // }
  const stripMarkdown = (md) => {
    let content = md.replace(/#+\s+/g, "");
    content = content.replace(/---/g, "");
    content = content.replace(/\!\[.*\]\(.*\)/g, "");
    content = content.replace(/\[.*\]\(.*\)/g, "");
    content = content.replace(/(\*\*|__)?\*.*\*\*(\*\*|__)?/g, "");
    return content;
  };
  return (
    <>
      <Head>
        <title>{metadata.title}</title>
        <meta property="og:title" content={metadata.title} />
        <meta property="og:description" content={metadata.description} />
        <meta property="og:image" content={metadata.imageUrl} />
        <meta
          name="image"
          property="og:image"
          content={metadata.imageUrl}
        ></meta>
         <meta property="og:locale" content="en_US" />
         <meta property="og:image:url" content={metadata.imageUrl} />
         <meta property="og:image:width" content="800" />
         <meta property="og:image:height" content="600" />
         <meta property="og:image:url" content={metadata.imageUrl} />
         <meta property="og:image:width" content="1800" />
         <meta property="og:image:height" content="1600" />
         <meta property="og:image:alt" content="Diary Blog" />
          
        <meta property="og:type" content="article" />
        <meta property="og:url" content={router.asPath} />
        <meta property="og:type" content="article" />
        <meta property="og:article:author" content={metadata.author} />
        <meta
          property="og:article:published_time"
          content={metadata.createDate}
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@diaryblogUnv" />
        <meta name="twitter:title" content={metadata.title} />
        <meta name="twitter:description" content={metadata.description} />
        <meta name="twitter:image" content={metadata.imageUrl} />
      </Head>
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
              <h1 className="text-2xl mb-2 text-black font-semibold">
                {metadata.title}
              </h1>
              <h3 className="text-slate-900">{metadata.author}</h3>
              <div className="flex text-md md:text-2xl lg:text-2xl ">
                <span className="w-10 flex-row text-md md:text-2xl lg:text-2xl">
                  <Postsentiment
                    postId={postId}
                    blogId={blogspace_id}
                    postlikes={metadata.likes ? metadata.likes.length : ""}
                  />
                </span>
                <span className="w-10 flex-row text-md md:text-2xl lg:text-2xl">
                  <Sharepost
                    post_title={metadata.title}
                    post_image={metadata.imageUrl}
                    post_description={metadata.description}
                  />
                </span>
              </div>
              <div className="text-black leading-6 text-justify">
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
  console.log(post);

  return post;
}

export async function getServerSideProps(context) {
  const { params } = context;
  const metadata = await generateMetadata(params);
  return {
    props: {
      metadata,
    },
  };
}
export default Post;
