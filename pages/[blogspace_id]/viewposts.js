import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router"; 
import CustomLink from "../../components/link";

import ReactMarkdown from "react-markdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { faBookmark } from "@fortawesome/free-regular-svg-icons";
import "material-icons/iconfont/material-icons.css";
import ThemeSwitch from "./themeSwitch";
import Header from "../../components/header";
import Footer from "../../components/footer";
import Sharepost from "./[postId]/sharepost";


const ViewPosts = () => {
  const [posts, setPosts] = useState([]);
  const [postSearch, setPostSearch] = useState("");
  
  const router = useRouter(); 
  const { blogspace_id, blogspace_name } = router.query; 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentFollowCompany, setCurrentFollowCompany] = useState(null);
  const [emailForFollow, setEmailForFollow] = useState("");
  const [followedCompanies, setFollowedCompanies] = useState([]); // If you need this
  const [followersCount, setFollowersCount] = useState(0);
  const [viewMode, setViewMode] = useState("card");
  const [sortedPosts, setSortedPosts] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);


  console.log(router.query.blogspace_id);

  const blog_id = router.query.blogspace_id;
  const blog_name = router.query.blogspace_name;

  useEffect(() => {
    // Check the initial theme when the component mounts
    const initialTheme = localStorage.getItem("theme");
    setIsDarkMode(initialTheme === "dark");
  }, []);

  // Function to toggle dark mode
  const toggleDarkMode = (newTheme) => {
    setIsDarkMode(newTheme === "dark");
    // Set the theme in local storage
    localStorage.setItem("theme", newTheme);
  };




  const getUsernameById = async (userId) => {
    try {
      const response = await fetch(`https://usermgtapi3.onrender.com/api/get_user/${userId}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      return data.username;
    } catch (error) {
      console.error("Error fetching username:", error.message);
      return ''; // Return an empty string or handle the error as needed
    }
  };


  useEffect(() => {
    console.log("hi");
    if (
      router.query.blogspace_id &&
      router.query.blogspace_id !== "undefined"
    ) {
      fetch(`https://diaryblogapi2.onrender.com/api/blogspace/${blog_id}/posts`)
        .then((response) => response.json())
        .then((data) => {
          setPosts(data);
        })
        .catch((error) => console.error("Error fetching posts:", error));

      // Fetch follower count for the current blogSpace
      fetch(
        `https://diaryblogapi2.onrender.com/api/blogSpace/${blogspace_id}/followers`
      )
        .then((response) => response.json())
        .then((followersData) => {
          setFollowersCount(followersData.userEmails?.length || 0);
        })
        .catch((error) => {
          console.warn(
            `Error fetching followers for blogSpace ID: ${blogspace_id}`,
            error
          );
          setFollowersCount(0);
        });
    } else {
      console.error("blogspace_id is undefined!");
    }
  }, [blogspace_id]);

  const handleChange = (e) => {
    setPostSearch(e.target.value);
  };

  const handleBackClick = () => {
    router.push("/diaryblogspace"); // Use router.push to navigate
  };

  console.log(posts);

 

  useEffect(() => {
    const fetchUsernames = async () => {
      try {
        const sorted = [...posts].sort((a, b) => {
          const dateA = new Date(a.createDate);
          const dateB = new Date(b.createDate);
          return dateB - dateA;
        });
        setSortedPosts(sorted);
  
        const postsWithUsernames = await Promise.all(
          sorted.map(async (post) => {
            const username = await getUsernameById(post.author);
            return { ...post, username };
          })
        );
        setSortedPosts(postsWithUsernames);
      } catch (error) {
        console.error("Error fetching usernames:", error.message);
      }
    };
  
    fetchUsernames();
  }, [posts]);
  

  console.log(sortedPosts);

  const filteredPosts = sortedPosts.filter((post) => {
    const title = post.title || "";
    const description = post.description || "";

    return (
      title.toLowerCase().includes(postSearch.toLowerCase()) ||
      description.toLowerCase().includes(postSearch.toLowerCase())
    );
  });

  const handlePostClick = (post) => {
    console.log(post);
    const postId = post._id;
    // router.push(
    //   `/${router.query.blogspace_id}/${router.query.blogspace_name}/${postId}/post`
    // );

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
          content="https://universe-nextjs.onrender.com/DBlogo.pn"
        />
      </Head>
      <div>
        <Header />
        <div className="bg-white">
          <section className="bg-white py-6 sm:py-6 text-slate-900 mx-4 md:mx-10 lg:mx-20 xl:mx-40">
            <div className="container p-6 mx-auto space-y-8">
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
            {/* <div className="text-center pt-10">
            <h2 className="text-3xl text-slate-900 font-bold">Latest Post</h2>
          </div> */}

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

                              <div className="flex flex-wrap">
                               
                              </div>
                            </div>
                            <div className="prose max-w-none text-gray-500 ">
                              {truncateText(post.description, 27)}
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-4 text-slate-900">
                            <div className="text-base font-medium leading-6 hover:text-orange-600">
                              <CustomLink
                                href={`/${router.query.blogspace_id}/${post._id}/post`}
                                className="text-primary-500 hover:text-orange-600 "
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

            {/* {loading && <p>Loading...</p>} */}
          </div>
        </div>
        <Footer />
      </div>
    </>
   
  );
};

export default ViewPosts;
