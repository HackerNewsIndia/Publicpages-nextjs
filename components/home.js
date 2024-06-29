import React, { useState, useEffect } from "react";
import CustomLink from "./link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import debounce from "lodash.debounce";
import { BeatLoader } from "react-spinners";
import Markdown from "markdown-to-jsx";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastPostId, setLastPostId] = useState("");
  const [fetchingMore, setFetchingMore] = useState(false);
  const [allPostsLoaded, setAllPostsLoaded] = useState(false);

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
    fetch_latest_5_Posts();
  }, []);

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
      return ""; // Return an empty string or handle the error as needed
    }
  };

  const fetch_latest_5_Posts = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://diaryblogapi-eul3.onrender.com/api/latest_5_posts`
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
        `https://diaryblogapi-eul3.onrender.com/api/next_5_posts?last_post_id=${lastPostId}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
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

  // const handlePostClick = (post) => {
  //   const postId = post._id;

  //   fetch(`https://diaryblogapi-eul3.onrender.com/api/posts/${postId}/views`, {
  //     method: "PUT",
  //   })
  //     .then((response) => response.json())
  //     .then((data) => {
  //       console.log(data.message);
  //       // Update the view count locally for the post that was clicked.
  //       //   const updatedPosts = posts.map((postItem) => {
  //       //     if (postItem._id === postId) {
  //       //       postItem.views = data.views; // Assuming data.views contains the updated view count.
  //       //     }
  //       //     return postItem;
  //       //   });
  //       //   setPosts(updatedPosts); // Update the state with the new post views.
  //       // }
  //     })
  //     .catch((error) => {
  //       console.error("Error incrementing views:", error);
  //     });
  // };

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

  return (
    <div className="mx-1 md:mx-10 lg:mx-20 xl:mx-40 bg-white text-black">
      <div className="text-center pt-10">
        <h2 className="text-3xl text-slate-900 font-bold">Latest Post</h2>
      </div>

      <ul className="divide-y divide-gray-400 mx-2 sm:mx-4 md:mx-6 lg:mx-8 xl:mx-10 mt-5 mb-5">
        {posts.map((post, index) =>
          post.status === "published" ? (
            <li key={index} className="py-5 divide-slate-900">
              <article className="flex flex-col md:flex-row">
                <div className="flex flex-row p-2 md:w-1/5">
                  <img
                    src={post.imageUrl}
                    alt="Logo"
                    width={250}
                    height={250}
                    className="rounded-md w-full object-cover"
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
                    <div className="space-y-6">
                      <div>
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
                      <div className="text-base font-medium leading-6 hover:text-orange-600 cursor-pointer">
                        <CustomLink
                          href={`/${post.blogSpace}/${post._id}/post`}
                          className="text-primary-500 hover:text-primary-600 "
                          aria-label={`Read more: "${post.title}"`}
                          // onClick={() => handlePostClick(post)}
                        >
                          Read more &rarr;
                        </CustomLink>
                      </div>
                      <div className="flex items-center">
                        <CustomLink
                          href={`/profile?user_id=${encodeURIComponent(
                            post.author
                          )}`}
                          className="text-primary-500 hover:text-primary-600 hover:underline"
                        >
                          <div className="flex items-center">
                            {post.username && post.username.image_base64 && (
                              <img
                                src={`data:image/jpeg;base64, ${post.username.image_base64}`}
                                alt="avatar"
                                className="object-cover w-10 h-10 mx-2 rounded-full"
                              />
                            )}
                            <span>
                              {post.username && post.username.username}
                            </span>
                          </div>
                        </CustomLink>
                      </div>
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
  );
};

export default Home;
