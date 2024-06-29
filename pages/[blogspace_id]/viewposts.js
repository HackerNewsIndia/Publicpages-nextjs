import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import CustomLink from "../../components/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { faPeopleGroup } from "@fortawesome/free-solid-svg-icons";
// import { faPeopleGroup } from "@fortawesome/pro-light-svg-icons";
import "material-icons/iconfont/material-icons.css";
import Header from "../../components/header";
import Footer from "../../components/footer";
import debounce from "lodash.debounce";
import { BeatLoader } from "react-spinners";
import Markdown from "markdown-to-jsx";

const ViewPosts = () => {
  const router = useRouter();
  const blog_id = router.query.blogspace_id;
  const blog_name = router.query.blogspace_name;

  const [posts, setPosts] = useState([]);
  const [postSearch, setPostSearch] = useState("");
  const { blogspace_id, blogspace_name } = router.query;
  const [sortedPosts, setSortedPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingMore, setFetchingMore] = useState(false);
  const [allPostsLoaded, setAllPostsLoaded] = useState(false);
  const [lastPostId, setLastPostId] = useState("");
  const [blogSpaceData, setBlogSpaceData] = useState("");
  const [username, setUsername] = useState("");
  const [userImage, setUserImage] = useState("");
  const [email, setEmail] = useState("");
  const [emailAdded, setEmailAdded] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [emailError, setEmailError] = useState("");

  useEffect(() => {
    fetch(`https://diaryblogapi-eul3.onrender.com/api/blogSpace/${blog_id}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("blogSpaceData:", data);
        setBlogSpaceData(data);
      });
  }, [blog_id, emailAdded]);

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

  useEffect(() => {
    if (blog_id && blog_id !== "undefined") {
      fetch_latest_5_Posts();
    } else {
      console.error("blog_id is undefined!");
    }
  }, [blog_id]);

  const getUsernameById = async (userId) => {
    try {
      const response = await fetch(
        `https://usermgtapi-msad.onrender.com/api/get_user/${userId}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setUsername(data.username);
      setUserImage(data.image_base64);
      return {
        username: data.username,
        image_base64: data.image_base64,
      };
    } catch (error) {
      console.error("Error fetching username:", error.message);
      return ""; // Return an empty string or handle the error as needed
    }
  };

  const fetch_latest_5_Posts = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://diaryblogapi-eul3.onrender.com/api/blogspace/${blog_id}/posts`
        // `http://127.0.0.1:5001/api/blogspace/${blog_id}/posts`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();

      const sortedPosts = data.sort((a, b) => {
        const dateA = new Date(a.createDate);
        const dateB = new Date(b.createDate);
        return dateB - dateA;
      });

      const postsWithUsernames = await Promise.all(
        sortedPosts.map(async (post) => {
          const username = await getUsernameById(post.author);
          return { ...post, username };
        })
      );

      setPosts(postsWithUsernames);
      const lastPostId =
        postsWithUsernames.length > 0
          ? postsWithUsernames[postsWithUsernames.length - 1]._id
          : null;
      setLastPostId(lastPostId);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching posts:", error.message);
      setLoading(false);
      // You can also set an error state here if you want to show an error message to the user
    }
  };

  const fetch_5_more_posts = async (lastPostId) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://diaryblogapi-eul3.onrender.com/api/blogspace/${blog_id}/5_more_posts?last_post_id=${lastPostId}`
        // `http://127.0.0.1:5001/api/blogspace/${blog_id}/5_more_posts?last_post_id=${lastPostId}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();

      const sortedPosts = data.sort((a, b) => {
        const dateA = new Date(a.createDate);
        const dateB = new Date(b.createDate);
        return dateB - dateA;
      });

      const postsWithUsernames = await Promise.all(
        sortedPosts.map(async (post) => {
          const username = await getUsernameById(post.author);
          return { ...post, username };
        })
      );
      if (postsWithUsernames.length < 1) {
        setAllPostsLoaded(true);
      } else {
        setPosts((prevPosts) => {
          const updatedPosts = [...prevPosts, ...postsWithUsernames];
          const lastPostId =
            updatedPosts.length > 0
              ? updatedPosts[updatedPosts.length - 1]._id
              : null;
          setLastPostId(lastPostId);
          return updatedPosts;
        });
      }
    } catch (error) {
      console.error("Error fetching more blog posts:", error);
    } finally {
      setLoading(false);
      setFetchingMore(false);
    }
  };

  const fetch_more_posts = () => {
    if (!loading && lastPostId) {
      setFetchingMore(true);
      fetch_5_more_posts(lastPostId);
    }
  };

  const handleScroll = debounce(() => {
    const isAtBottom =
      window.innerHeight + document.documentElement.scrollTop + 100 >=
      document.documentElement.offsetHeight;

    if (isAtBottom && !fetchingMore && !allPostsLoaded) {
      fetch_more_posts();
    }
  }, 200);

  useEffect(() => {
    // Add scroll event listener when component mounts
    window.addEventListener("scroll", handleScroll);
    return () => {
      // Remove scroll event listener when component unmounts
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  const handleChange = (e) => {
    setPostSearch(e.target.value);
  };

  // const handlePostClick = (post) => {
  //   console.log(post);
  //   const postId = post._id;
  //   // router.push(
  //   //   `/${router.query.blogspace_id}/${router.query.blogspace_name}/${postId}/post`
  //   // );

  //   fetch(`https://diaryblogapi-eul3.onrender.com/api/posts/${postId}/views`, {
  //     method: "PUT",
  //   })
  //     .then((response) => response.json())
  //     .then((data) => {
  //       console.log(data.message);
  //       // Update the view count locally for the post that was clicked.
  //       // const updatedPosts = posts.map((postItem) => {
  //       //   if (postItem._id === postId) {
  //       //     postItem.views = data.views; // Assuming data.views contains the updated view count.
  //       //   }
  //       //   return postItem;
  //       // });
  //       // setPosts(updatedPosts); // Update the state with the new post views.
  //     })
  //     .catch((error) => {
  //       console.error("Error incrementing views:", error);
  //     });
  // };

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(postSearch.toLowerCase())
  );

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  function truncateText(text, limit) {
    const words = text.split(" ");
    const truncated = words.slice(0, limit).join(" ");
    return `${truncated}${words.length > limit ? "..." : ""}`;
  }

  const wordsPerMinute = 200; // Average reading speed in words per minute

  const calculateTimeToRead = (wordCount) => {
    const minutes = wordCount / wordsPerMinute;
    return Math.ceil(minutes);
  };

  const timeToRead = (post) => {
    const wordCount = post.description.split(" ").length;
    const time = calculateTimeToRead(wordCount);
    return time;
  };

  const handleBlur = () => {
    setEmailError("");
  };

  const handleEmail = (e) => {
    const emailValue = e.target.value;
    setEmail(emailValue);
    const isValid = isValidEmail(emailValue);
    if (!isValid) {
      setEmailError("Enter a valid Email");
    } else {
      setEmailError("");
    }
    setResponseMessage("");
  };

  const isValidEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email === "") {
      setEmailError("Enter your Email");
    } else {
      await fetch(
        `https://diaryblogapi-eul3.onrender.com/api/blogSpace/${blogspace_id}/follow`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: email }),
        }
      )
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else if (response.status === 400) {
            throw new Error("Email is already subscribed");
          } else {
            throw new Error("Network response was not ok");
          }
        })
        .then((data) => {
          console.log(data);
          setResponseMessage(data.message);
          setEmail("");
          setEmailAdded(true);
          console.log(data.message);
        })
        .catch((error) => {
          console.error("Error:", error);
          setResponseMessage(error.message);
          setEmail("");
        });
    }
  };

  const generateRandomImageUrls = (count) => {
    const imageUrls = [];
    for (let i = 0; i < count; i++) {
      imageUrls.push(`https://picsum.photos/200/200?random=${i}`);
    }
    return imageUrls;
  };

  const randomImageUrl = generateRandomImageUrls(1);

  return (
    <>
      <Head>
        <title>DiaryBlog - {blog_name}</title>
        <meta property="og:title" content={blog_name} />
        <meta
          property="og:description"
          content="Writing and publishing articles or posts online, sharing thoughts, opinions, and expertise on various topics to engage with an audience or community"
        />
        <meta
          property="og:image"
          content="https://diaryblog.connectingpeopletech.com/DBlogo.png"
        />
      </Head>
      <div>
        <Header />
        <div>
          <div className="bg-white flex flex-col pl-4 pr-4 pb-3 mx-auto md:pl-20 md:pr-5 lg:mx-4 xl:mx-4">
            <div className="flex flex-row justify-between flex-wrap pb-4">
              <div className="w-full md:w-3/5 p-2 md:pr-0 md:pb-2">
                <div className="flex flex-col text-wrap">
                  <h1 className="text-3xl text-slate-900 font-bold my-4">
                    {blogSpaceData.name}
                  </h1>
                  <p className="text-md text-slate-500 mb-4 text-pretty text-ellipsis overflow-hidden">
                    {blogSpaceData.url}
                  </p>
                  <div className="flex flex-row text-slate-900 space-x-10 items-center">
                    <div className="flex flex-row space-x-3 items-center">
                      <span>
                        <img
                          src={
                            `data:image/jpeg;base64, ${userImage}` ||
                            `data:image/jpeg;base64, ${randomImageUrl}`
                          }
                          alt="user_image"
                          className="object-cover w-10 h-10 mx-2 rounded-full"
                        />
                      </span>
                      <a
                        href={`/profile?user_id=${encodeURIComponent(
                          blogSpaceData.owner
                        )}`}
                        className="font-bold underline decoration-1"
                      >
                        {username}
                      </a>
                    </div>
                    <div className="flex flex-row items-center space-x-2">
                      <span>
                        <FontAwesomeIcon icon={faPeopleGroup} />
                      </span>
                      <span>{blogSpaceData.followers || 0} Followers </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center w-full  md:w-2/5 p-2 ">
                <img
                  src={blogSpaceData.image_url || `${randomImageUrl}`}
                  alt="Logo of blogSpace"
                  className="rounded-md w-96 h-56 border-2 border-slate-200 object-cover"
                  // style={{ width: "100%", height: "auto" }}
                />
              </div>
            </div>
            <div className="flex justify-center items-center space-x-5 w-full mx-auto pt-3 mb-5">
              <form
                onSubmit={(e) => handleSubmit(e)}
                className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-5"
              >
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="border-2 border-gray-300 bg-white text-slate-900 rounded-md w-full md:w-3/4 p-2"
                  onChange={(e) => handleEmail(e)}
                  onBlur={handleBlur}
                  value={email}
                />
                <button
                  type="submit"
                  className="bg-slate-800 text-white px-4 py-1 rounded-md w-full md:w-auto"
                >
                  Subscribe
                </button>
              </form>
            </div>
            {responseMessage && (
              <p className="flex items-center justify-center text-green-500">
                {responseMessage}
              </p>
            )}
            {emailError && (
              <p className="flex items-center justify-center text-red-500">
                {emailError}
              </p>
            )}
          </div>
          <div className="bg-white">
            <section className="bg-white py-6 sm:py-6 text-slate-900 mx-4 md:mx-10 lg:mx-20 xl:mx-40">
              <div className="container mx-auto space-y-8">
                <div className="space-y-2 text-center">
                  <h2 className="text-3xl font-bold">{blog_name}</h2>
                </div>
              </div>
              <div className="container mx-auto flex flex-col items-center justify-center p-4  space-y-8 md:p-4 lg:space-y-0 lg:flex-row lg:justify-between">
                <h1 className="text-3xl sm:text-xl md:text-3xl font-semibold text-center lg:text-left">
                  {posts.length} posts in 5 categories
                </h1>
              </div>
              <div className="flex flex-row items-center justify-center">
                <div className="relative">
                  <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-500"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 20"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                      />
                    </svg>
                  </div>
                  <input
                    type="search"
                    name="Search"
                    placeholder="Search..."
                    value={postSearch}
                    onChange={handleChange}
                    className="w-32 py-2 pl-10 bg-white border-2 text-sm text-slate-900 rounded-md sm:w-auto focus:outline"
                  />
                </div>
              </div>
            </section>
            <div className="flex flex-wrap items-start text-slate-900 justify-center p-6 md:mx-10 lg:mx-20 xl:mx-40">
              <button
                type="button"
                className="relative px-3 py-1 m-1 text-sm border rounded-md shadow-sm sm:py-2 sm:text-base ring ring-transparent group md:px-4 hover:ring hover:ring-opacity-50 focus:ring-opacity-50"
              >
                Lifestyle
              </button>
              <button
                type="button"
                className="relative px-3 py-1 m-1 text-sm border rounded-md shadow-sm sm:py-2 sm:text-base ring ring-transparent group md:px-4 hover:ring hover:ring-opacity-50 focus:ring-opacity-50"
              >
                Technology
              </button>
              <button
                type="button"
                className="relative px-3 py-1 m-1 text-sm border rounded-md shadow-sm sm:py-2 sm:text-base ring ring-transparent group md:px-4 hover:ring hover:ring-opacity-50 focus:ring-opacity-50"
              >
                Food and Recipes
              </button>

              <button
                type="button"
                className="relative px-3 py-1 m-1 text-sm border rounded-md shadow-sm sm:py-2 sm:text-base ring ring-transparent group md:px-4 hover:ring hover:ring-opacity-50 focus:ring-opacity-50"
              >
                Personal Finance
              </button>
              <button
                type="button"
                className="relative px-3 py-1 m-1 text-sm border rounded-md shadow-sm sm:py-2 sm:text-base ring ring-transparent group md:px-4 hover:ring hover:ring-opacity-50 focus:ring-opacity-50"
              >
                Parenting and Family
              </button>
            </div>

            <div className="mx-1 md:mx-10 lg:mx-20 xl:mx-40 bg-white">
              <ul className="divide-y divide-gray-400 mx-2 sm:mx-4 md:mx-6 lg:mx-8 xl:mx-10 mt-5 mb-5">
                {filteredPosts.map((post, index) =>
                  post.status === "published" ? (
                    <li key={index} className="py-5 divide-slate-900">
                      <article className="flex flex-col md:flex-row">
                        <div className="flex flex-row p-2 md:w-1/5">
                          <img
                            src={post.imageUrl}
                            alt="Logo"
                            width={250}
                            height={250}
                            objectFit="fit"
                            className="rounded-md w-full"
                          />
                        </div>
                        <div className="flex flex-col p-2 md:w-4/5">
                          <div className="flex flex-row justify-between items-center text-center">
                            <div className="flex flex-row space-x-3 text-gray-500">
                              <div>
                                <dl className="md:flex md:items-center md:justify-between">
                                  <dt className="sr-only">Published on</dt>
                                  <dd className="text-base font-medium leading-6 text-gray-500  md:mr-4">
                                    <time dateTime={post.createDate}>
                                      {formatDate(post.createDate)}
                                    </time>
                                  </dd>
                                </dl>
                              </div>
                              <div>
                                <FontAwesomeIcon
                                  className="text-sm text-gray-500"
                                  icon={faEye}
                                />
                                : {post.views}
                              </div>
                            </div>
                            <div className="flex flex-row space-x-3 text-gray-500">
                              <div className="italic text-gray-500">
                                {timeToRead(post)} min
                              </div>
                            </div>
                          </div>
                          <div className="space-y-5 md:col-span-3">
                            <div className="space-y-4">
                              <div className="space-y-1">
                                <h2 className="text-2xl font-bold leading-8 tracking-tight text-gray-900 ">
                                  {post.title}
                                </h2>

                                <div className="flex flex-wrap"></div>
                              </div>
                              <div className="prose max-w-none text-gray-500 ">
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
                                  {truncateText(post.description, 10)}
                                </Markdown>
                              </div>
                            </div>
                            <div className="flex items-center justify-between mt-4 text-slate-900">
                              <div className="text-base font-medium leading-6 hover:text-orange-600">
                                <CustomLink
                                  href={`/${router.query.blogspace_id}/${post._id}/post`}
                                  className="text-primary-500 hover:text-orange-600 "
                                  aria-label={`Read more: "${post.title}"`}
                                  // onClick={() => handlePostClick(post)}
                                >
                                  Read more &rarr;
                                </CustomLink>
                              </div>
                              <CustomLink
                                href={`/profile?user_id=${encodeURIComponent(
                                  post.author
                                )}`}
                                className="text-primary-500 hover:text-primary-600"
                              >
                                <div className="flex items-center">
                                  {/* Display the user's avatar if available */}
                                  {post.username &&
                                    post.username.image_base64 && (
                                      <img
                                        src={`data:image/jpeg;base64, ${post.username.image_base64}`}
                                        alt="avatar"
                                        className="object-cover w-10 h-10 mx-2 rounded-full"
                                      />
                                    )}
                                  {/* Display the user's username */}
                                  <span>
                                    {post.username && post.username.username}
                                  </span>
                                </div>
                              </CustomLink>
                            </div>
                          </div>
                        </div>
                      </article>
                    </li>
                  ) : null
                )}
              </ul>

              {loading && (
                <div className="flex justify-center items-center py-5">
                  <BeatLoader color="hsla(168, 4%, 75%, 1)" />
                </div>
              )}
              {allPostsLoaded && (
                <p className="text-center mt-5 mb-5 font-medium text-gray-500">
                  ** All posts loaded **
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

export default ViewPosts;
