import React, { useState, useEffect } from "react";
import CustomLink from "./link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import debounce from "lodash.debounce";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastPostId, setLastPostId] = useState("");
  const [fetchingMore, setFetchingMore] = useState(false);

  useEffect(() => {
    fetch_latest_10_Posts();
  }, [1]);

  const getUsernameById = async (userId) => {
    try {
      const response = await fetch(
        `https://usermgtapi3.onrender.com/api/get_user/${userId}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      return data.username;
    } catch (error) {
      console.error("Error fetching username:", error.message);
      return ""; // Return an empty string or handle the error as needed
    }
  };

  const fetch_latest_10_Posts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://127.0.0.1:5001/api/latest_10_posts`);

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

  const fetch_10_more_posts = async (lastPostId) => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://127.0.0.1:5001/api/next_10_posts?last_post_id=${lastPostId}`
        // `https://diaryblogapi2.onrender.com/api/next_10_posts`,
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

      setPosts((prevPosts) => {
        const updatedPosts = [...prevPosts, ...postsWithUsernames];
        const lastPostId =
          updatedPosts.length > 0
            ? updatedPosts[updatedPosts.length - 1]._id
            : null;
        setLastPostId(lastPostId);
        return updatedPosts;
      });
    } catch (error) {
      console.error("Error fetching more blog posts:", error);
    }
  };

  const fetch_more_posts = () => {
    if (!loading && hasMore) {
      fetch_10_more_posts(lastPostId);
    }
  };

  const handleScroll = debounce(() => {
    const isAtBottom =
      window.innerHeight + document.documentElement.scrollTop + 100 >=
      document.documentElement.offsetHeight;

    if (isAtBottom && !loading && hasMore && !fetchingMore) {
      setFetchingMore(true);
      fetch_more_posts();
    }
  }, 200);

  useEffect(() => {
    if (!loading && !hasMore) {
      setFetchingMore(false);
    }
  }, [loading, hasMore]);

  useEffect(() => {
    // Add scroll event listener when component mounts
    window.addEventListener("scroll", handleScroll);
    return () => {
      // Remove scroll event listener when component unmounts
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastPostId, fetchingMore]);

  const handlePostClick = (post) => {
    console.log(post);
    const postId = post._id;

    fetch(`https://diaryblogapi2.onrender.com/api/posts/${postId}/views`, {
      method: "PUT",
    })
      .then((response) => response.json())
      .then((data) => {
        // Update the view count locally for the post that was clicked.
        const updatedPosts = posts.map((postItem) => {
          if (postItem._id === postId) {
            postItem.views = data.views; // Assuming data.views contains the updated view count.
          }
          return postItem;
        });
        setPosts(updatedPosts); // Update the state with the new post views.
      })
      .catch((error) => {
        console.error("Error incrementing views:", error);
      });
  };

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
    <div className="mx-1 md:mx-10 lg:mx-20 xl:mx-40 bg-white">
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
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold leading-8 tracking-tight text-gray-900 ">
                          {post.title}
                        </h2>
                        <div className="flex flex-wrap"></div>
                      </div>
                      <div className="prose max-w-none text-gray-500 ">
                        {truncateText(post.description, 27)}
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4 text-slate-900">
                      <div className="text-base font-medium leading-6 hover:text-orange-600 cursor-pointer">
                        <CustomLink
                          // href={`/${post.blogSpace}/${blogspace.name}/${post._id}/post`}
                          href={`/${post.blogSpace}/${post._id}/post`}
                          className="text-primary-500 hover:text-primary-600 "
                          // onClick={() => fetchBlogSpace(post.blogSpace)}
                          aria-label={`Read more: "${post.title}"`}
                          onClick={() => handlePostClick(post)}
                        >
                          Read more &rarr;
                        </CustomLink>
                      </div>
                      <div className="flex items-center">
                        <img
                          src="https://source.unsplash.com/50x50/?portrait"
                          alt="avatar"
                          className="object-cover w-10 h-10 mx-4 rounded-full "
                        />
                        <a
                          href={`/profile?user_id=${encodeURIComponent(
                            post.author
                          )}`}
                          className="text-primary-500 hover:text-primary-600 hover:underline"
                        >
                          <span>{post.username}</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </li>
          ) : null
        )}
      </ul>

      {loading && <p>Loading...</p>}
    </div>
  );
};

export default Home;
