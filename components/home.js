import React, { useState, useEffect } from "react";
import CustomLink from "./link";
import Image from "next/image";
// import Testimonials from "./Testimonials";
// import "./Home.css";

// const Counter = React.lazy(() => import("counter/Counter"));

const Home = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        const response = await fetch(
          // "http://127.0.0.1:5001/api/all_posts"
          "https://diaryblogapi2.onrender.com/api/all_posts"
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        // Assuming the response structure is { comments: [...] }
        console.log("postData:", data);
        setPosts(data);
      } catch (error) {
        console.error("error in fetching comments", error.message);
      }
    };

    fetchAllPosts();
  }, [setPosts]);

  const MAX_DISPLAY = 4;

  function truncateText(text, limit) {
    const words = text.split(" ");
    const truncated = words.slice(0, limit).join(" ");
    return `${truncated}${words.length > limit ? "..." : ""}`;
  }

  return (
    <div className="m-10">
      <div className="flex flex-col">
        <div className="flex flex-row text-center mx-auto">
          <h2 class="text-3xl font-bold">Latest Post</h2>
        </div>
        <div className="flex flex-row mt-0">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700 m-40 mt-5 mb-5">
            {/* {!posts.length && "No posts found."} */}
            {posts.slice(0, MAX_DISPLAY).map((post, index) => {
              return (
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
                      <div className="flex flex-row p-2 w-4/5">
                        <dl>
                          <dt className="sr-only">Published on</dt>
                          <dd className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
                            {/* <time dateTime={date}>
                        {formatDate(date, siteMetadata.locale)}
                      </time> */}
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
                          <div className="text-base font-medium leading-6">
                            <CustomLink
                              // href={`/blog/${slug}`}
                              className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                              aria-label={`Read more: "${post.title}"`}
                            >
                              Read more &rarr;
                            </CustomLink>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Home;
