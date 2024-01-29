import React, { useState, useEffect } from "react";
import CustomLink from "./link";
import Image from "next/image";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const uniquePostIds = new Set(); // Keep track of unique post IDs

  const fetchAllPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        // `http://127.0.0.1:5001/api/all_posts?page=${page}`
        `https://diaryblogapi2.onrender.com/api/all_posts?page=${page}`
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log(data);
      const sortedPosts = data.sort((a, b) => {
        const dateA = new Date(a.createDate);
        const dateB = new Date(b.createDate);
        return dateB - dateA;
      });

      // Filter out duplicates before appending new posts
      const filteredNewPosts = sortedPosts.filter(
        (post) => !uniquePostIds.has(post.id)
      );

      // Add new post IDs to the set
      filteredNewPosts.forEach((post) => uniquePostIds.add(post.id));

      setPosts((prevPosts) => [...prevPosts, ...filteredNewPosts]);
      setLoading(false);
      setPage((prevPage) => prevPage + 1);
      setTotalPages(response.headers.get("Total-Pages") || 1);
      setHasMore(page < totalPages);
    } catch (error) {
      console.error("Error in fetching posts", error.message);
      setLoading(false);
    }
  };

  const handleScroll = () => {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;

    if (scrollTop + clientHeight >= scrollHeight - 10 && !loading && hasMore) {
      fetchAllPosts();
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [loading, hasMore, page, totalPages]);

  useEffect(() => {
    fetchAllPosts();
  }, []); // Fetch initial posts

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  function truncateText(text, limit) {
    const words = text.split(" ");
    const truncated = words.slice(0, limit).join(" ");
    return `${truncated}${words.length > limit ? "..." : ""}`;
  }

  return (
    <div className="m-10">
      <div className="flex flex-col">
        <div className="flex flex-row text-center mx-auto">
          <h2
            className="text-3xl font-bold"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Latest Post
          </h2>
        </div>
        <div className="flex flex-row mt-0">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700 mx-48 mt-5 mb-5">
            {posts.map((post, index) =>
              post.status === "published" ? (
                <li key={index} className="py-5 divide-slate-900">
                  <article>
                    <div className="flex ">
                      <div className="flex flex-row p-2 w-1/5">
                        <img
                          src={post.imageUrl}
                          alt="Logo"
                          width={250}
                          height={250}
                          objectFit="fit"
                          className="rounded-md"
                        />
                      </div>
                      <div className="flex flex-col p-2 w-4/5">
                        <dl>
                          <dt className="sr-only">Published on</dt>
                          <dd className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
                            <time dateTime={post.createDate}>
                              {formatDate(post.createDate)}
                            </time>
                          </dd>
                        </dl>
                        <div className="space-y-5 xl:col-span-3">
                          <div className="space-y-6">
                            <div>
                              <h2 className="text-2xl font-bold leading-8 tracking-tight">
                                <div className="text-gray-900 dark:text-gray-100">
                                  {post.title}
                                </div>
                              </h2>
                              <div className="flex flex-wrap">
                                {/* {tags.map((tag) => (
                                  <Tag key={tag} text={tag} />
                                ))} */}
                              </div>
                            </div>
                            <div className="prose max-w-none text-gray-500 dark:text-gray-400">
                              {truncateText(post.description, 27)}
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-4">
                            <div className="text-base font-medium leading-6">
                              <CustomLink
                                // href={`/blog/${slug}`}
                                className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                                aria-label={`Read more: "${post.title}"`}
                              >
                                Read more &rarr;
                              </CustomLink>
                            </div>
                            <div>
                              <a
                                rel="noopener noreferrer"
                                href="#"
                                className="flex items-center"
                              >
                                <img
                                  src="https://source.unsplash.com/50x50/?portrait"
                                  alt="avatar"
                                  className="object-cover w-10 h-10 mx-4 rounded-full dark:bg-gray-500"
                                />
                                <span className="hover:underline dark:text-gray-400">
                                  Leroy Jenkins
                                </span>
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                </li>
              ) : null
            )}
          </ul>
        </div>
        {loading && <p>Loading...</p>}
      </div>
    </div>
  );
};

export default Home;
