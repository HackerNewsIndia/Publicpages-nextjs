import React, { useEffect, useState } from "react";
import { useRouter } from "next/router"; // Import useRouter from Next.js
import CustomLink from "../../../components/link";
// import "./ViewPosts.css";
// import { useBlogContext } from "./BlogContext";
import ReactMarkdown from "react-markdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import "material-icons/iconfont/material-icons.css";
import ThemeSwitch from "./themeSwitch";
import Header from "../../../components/header";
import Footer from "../../../components/footer";
// import "../../globals.css";

const ViewPosts = () => {
  const [posts, setPosts] = useState([]);
  const [postSearch, setPostSearch] = useState("");
  // const { blogData, selectedBlog, setSelectedBlog } = useBlogContext();
  const router = useRouter(); // Use the useRouter hook from Next.js
  const { blogspace_id, blogspace_name } = router.query; // Access query parameters using router.query
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

  // const filteredPosts = posts.filter((post) => {
  //   const title = post.title || '';
  //   const description = post.description || '';

  //   return (
  //     title.toLowerCase().includes(postSearch.toLowerCase()) ||
  //     description.toLowerCase().includes(postSearch.toLowerCase())
  //   );
  // });

  useEffect(() => {
    const sorted = [...posts].sort((a, b) => {
      const dateA = new Date(a.createDate);
      const dateB = new Date(b.createDate);
      return dateB - dateA;
    });
    setSortedPosts(sorted);
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

  const handlePostClick = (postId) => {
    console.log(postId);
    router.push(
      `/${router.query.blogspace_id}/${router.query.blogspace_name}/${postId}/post`
    );

    fetch(
      `https://diaryblogapi2.onrender.com/api/posts/${blog_name}/${postId}/views`,
      {
        method: "PUT",
      }
    )
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

  // const toggleFollow = (companyName) => {
  //   setCurrentFollowCompany(companyName);
  //   setIsModalOpen(true);
  // };

  // const handleCloseModal = () => {
  //   setIsModalOpen(false);
  //   setCurrentFollowCompany(null);
  //   setEmailForFollow("");
  // };

  // const handleConfirmFollow = () => {
  //   fetch(
  //     `https://diaryblogapi2.onrender.com/api/blogSpace/${blogspace_id}/follow`,
  //     {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ email: emailForFollow }),
  //     }
  //   )
  //     .then((response) => response.json())
  //     .then((data) => {
  //       if (data.message) {
  //         // No need to update the local state here, unless you want to reflect changes immediately.
  //         handleCloseModal();
  //       } else {
  //         console.error(data.error);
  //       }
  //     })
  //     .catch((error) => console.error("Error following company:", error));
  // };

  // const handleViewModeChange = (mode) => {
  //   setViewMode(mode);
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

  return (
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
              {posts.length} posts in 12 categories
            </h1>
            {/* <input
              type="search"
              name="Search"
              placeholder="Search..."
              value={blogSearch}
              onChange={handleChange}
              className="w-full md:w-32 py-2 pl-10 border-2 bg-white border-slate-400 text-sm rounded-md sm:w-auto focus:outline-none "
            /> */}
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
        <div className="flex flex-wrap items-start bg-white text-slate-900 justify-center p-6 md:mx-10 lg:mx-20 xl:mx-40">
          <button
            type="button"
            className="relative px-3 py-1 m-1 text-sm border rounded-md shadow-sm sm:py-2 sm:text-base ring ring-transparent group md:px-4 hover:ring hover:ring-opacity-50 focus:ring-opacity-50"
          >
            asdfasdf
          </button>
          <button
            type="button"
            className="relative px-3 py-1 m-1 text-sm border rounded-md shadow-sm sm:py-2 sm:text-base ring ring-transparent group md:px-4 hover:ring hover:ring-opacity-50 focus:ring-opacity-50"
          >
            C2
          </button>
          <button
            type="button"
            className="relative px-3 py-1 m-1 text-sm border rounded-md shadow-sm sm:py-2 sm:text-base ring ring-transparent group md:px-4 hover:ring hover:ring-opacity-50 focus:ring-opacity-50"
          >
            C3
          </button>

          <button
            type="button"
            className="relative px-3 py-1 m-1 text-sm border rounded-md shadow-sm sm:py-2 sm:text-base ring ring-transparent group md:px-4 hover:ring hover:ring-opacity-50 focus:ring-opacity-50"
          >
            asdfasdf
          </button>
          <button
            type="button"
            className="relative px-3 py-1 m-1 text-sm border rounded-md shadow-sm sm:py-2 sm:text-base ring ring-transparent group md:px-4 hover:ring hover:ring-opacity-50 focus:ring-opacity-50"
          >
            C2
          </button>
          <button
            type="button"
            className="relative px-3 py-1 m-1 text-sm border rounded-md shadow-sm sm:py-2 sm:text-base ring ring-transparent group md:px-4 hover:ring hover:ring-opacity-50 focus:ring-opacity-50"
          >
            C3
          </button>
          <button
            type="button"
            className="relative px-3 py-1 m-1 text-sm border rounded-md shadow-sm sm:py-2 sm:text-base ring ring-transparent group md:px-4 hover:ring hover:ring-opacity-50 focus:ring-opacity-50"
          >
            asdfasdf
          </button>
          <button
            type="button"
            className="relative px-3 py-1 m-1 text-sm border rounded-md shadow-sm sm:py-2 sm:text-base ring ring-transparent group md:px-4 hover:ring hover:ring-opacity-50 focus:ring-opacity-50"
          >
            C2
          </button>
          <button
            type="button"
            className="relative px-3 py-1 m-1 text-sm border rounded-md shadow-sm sm:py-2 sm:text-base ring ring-transparent group md:px-4 hover:ring hover:ring-opacity-50 focus:ring-opacity-50"
          >
            C3
          </button>
          <button
            type="button"
            className="relative px-3 py-1 m-1 text-sm border rounded-md shadow-sm sm:py-2 sm:text-base ring ring-transparent group md:px-4 hover:ring hover:ring-opacity-50 focus:ring-opacity-50"
          >
            asdfasdf
          </button>
          <button
            type="button"
            className="relative px-3 py-1 m-1 text-sm border rounded-md shadow-sm sm:py-2 sm:text-base ring ring-transparent group md:px-4 hover:ring hover:ring-opacity-50 focus:ring-opacity-50"
          >
            C2
          </button>
          <button
            type="button"
            className="relative px-3 py-1 m-1 text-sm border rounded-md shadow-sm sm:py-2 sm:text-base ring ring-transparent group md:px-4 hover:ring hover:ring-opacity-50 focus:ring-opacity-50"
          >
            C3
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
                      <dl className="md:flex md:items-center md:justify-between">
                        <dt className="sr-only">Published on</dt>
                        <dd className="text-base font-medium leading-6 text-gray-500  md:mr-4">
                          <time dateTime={post.createDate}>
                            {formatDate(post.createDate)}
                          </time>
                        </dd>
                      </dl>
                      <div className="space-y-5 md:col-span-3">
                        <div className="space-y-6">
                          <div>
                            <h2 className="text-2xl font-bold leading-8 tracking-tight text-gray-900 ">
                              {post.title}
                            </h2>
                            <div className="flex flex-wrap">
                              {/* {tags.map((tag) => (
                            <Tag key={tag} text={tag} />
                          ))} */}
                            </div>
                          </div>
                          <div className="prose max-w-none text-gray-500 ">
                            {truncateText(post.description, 27)}
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-4 text-slate-900">
                          <div className="text-base font-medium leading-6 hover:text-orange-600">
                            <CustomLink
                              href={`/${router.query.blogspace_id}/${router.query.blogspace_name}/${post._id}/post`}
                              className="text-primary-500 hover:text-orange-600 "
                              aria-label={`Read more: "${post.title}"`}
                            >
                              Read more &rarr;
                            </CustomLink>
                          </div>
                          <div className="hidden md:flex items-center ">
                            <img
                              src="https://source.unsplash.com/50x50/?portrait"
                              alt="avatar"
                              className="object-cover w-10 h-10 mx-4 rounded-full "
                            />
                            <span className="hover:underline ">
                              Leroy Jenkins
                            </span>
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
    // <div>
    //   <Header />
    //   <div className="flex flex-col justify-center w-full ">
    //     <ThemeSwitch onThemeChange={toggleDarkMode} />
    //     <h2 className="text-2xl font-bold mx-auto my-8">
    //       {blogspace_name}&apos;s Blog
    //     </h2>

    //     <div className="flex items-center justify-center gap-4 mb-4 my-2">
    //       {/* Follow button */}
    //       <button
    //         className="px-4 py-2 bg-black text-white border border-white rounded-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
    //         onClick={() => toggleFollow(blogspace_name)}
    //       >
    //         {followedCompanies.includes(blogspace_name) ? "Unfollow" : "Follow"}
    //       </button>

    //       {/* Followers count */}
    //       <span
    //         className={`text-sm ${
    //           isDarkMode ? "dark:text-white" : "text-black"
    //         }`}
    //       >
    //         {followersCount} {followersCount === 1 ? "follower" : "followers"}
    //       </span>
    //     </div>

    //     {/* Modal */}
    //     {isModalOpen && (
    //       <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
    //         <div className="bg-white p-8 rounded-md w-1/3">
    //           <h2 className="text-xl font-bold mb-2">
    //             Follow {currentFollowCompany}
    //           </h2>
    //           <input
    //             type="email"
    //             value={emailForFollow}
    //             onChange={(e) => setEmailForFollow(e.target.value)}
    //             placeholder="Enter your email"
    //             className="w-full px-2 py-1 mb-4 border border-gray-300 rounded-md"
    //           />
    //           <div className="flex justify-end space-x-2">
    //             <button
    //               className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
    //               onClick={handleConfirmFollow}
    //             >
    //               Confirm Follow
    //             </button>
    //             <button
    //               className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50"
    //               onClick={handleCloseModal}
    //             >
    //               Cancel
    //             </button>
    //           </div>
    //         </div>
    //       </div>
    //     )}

    //     <form
    //       className="w-full mb-4 flex justify-center"
    //       onSubmit={(e) => e.preventDefault()}
    //     >
    //       <div>
    //         <input
    //           className=" w-full px-4 py-3 mx-auto m-2 border border-slate-950 rounded-md"
    //           type="text"
    //           placeholder="search posts, company"
    //           value={postSearch}
    //           onChange={handleChange}
    //         />
    //       </div>
    //     </form>
    //     <section className=" flex justify-center mb-4">
    //       <div className="flex space-x-4">
    //         <div className="px-4 py-2 bg-black text-white border border-white shadow-xl rounded-md">
    //           All
    //         </div>
    //         <div
    //           className={`px-4 py-2 bg-white ${
    //             isDarkMode ? "dark:text-black" : "text-black"
    //           } border border-black shadow-xl rounded-md`}
    //         >
    //           Recent Posted
    //         </div>
    //         <div
    //           className={`px-4 py-2 bg-white ${
    //             isDarkMode ? "dark:text-black" : "text-black"
    //           } border border-black shadow-xl rounded-md`}
    //         >
    //           Most Trending Posted
    //         </div>
    //         <div
    //           className={`px-4 py-2 bg-white ${
    //             isDarkMode ? "dark:text-black" : "text-black"
    //           } border border-black shadow-xl rounded-md`}
    //         >
    //           Geography
    //         </div>
    //         <div
    //           className={`px-4 py-2 bg-white ${
    //             isDarkMode ? "dark:text-black" : "text-black"
    //           } border border-black shadow-xl rounded-md`}
    //         >
    //           Science
    //         </div>
    //         <div
    //           className={`px-4 py-2 bg-white ${
    //             isDarkMode ? "dark:text-black" : "text-black"
    //           } border border-black shadow-xl rounded-md`}
    //         >
    //           History
    //         </div>
    //       </div>
    //     </section>

    //     <div className="flex justify-between mx-16 my-4">
    //       <button
    //         className=" p-1 bg-black text-white rounded-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
    //         onClick={handleBackClick}
    //       >
    //         <FontAwesomeIcon icon={faArrowLeft} />
    //       </button>
    //       <div className="flex space-x-4">
    //         <button
    //           className="p-1 bg-black text-white rounded-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
    //           onClick={() => handleViewModeChange("card")}
    //         >
    //           <i className="material-icons">grid_on</i>
    //         </button>
    //         <button
    //           className="p-1 bg-black text-white rounded-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
    //           onClick={() => handleViewModeChange("list")}
    //         >
    //           <i className="material-icons">list</i>
    //         </button>
    //       </div>
    //     </div>

    //     {viewMode === "card" ? (
    //       <div className="grid grid-cols-4 gap-4 mx-4">
    //         {filteredPosts.map((post, index) => (
    //           <div
    //             key={index}
    //             className={`flex w-full`}
    //             onClick={() => handlePostClick(post._id)}
    //           >
    //             <div
    //               className={`flex flex-col w-full ${
    //                 isDarkMode ? "dark:bg-dark-blue" : "bg-white"
    //               } shadow-2xl shadow-slate-950 border border-slate-950" rounded-md m-2 transform transition-transform duration-200 hover:scale-105`}
    //             >
    //               <img
    //                 src={
    //                   post.imageUrl ||
    //                   "https://assets.hongkiat.com/uploads/psd-text-svg/logo-example.jpg"
    //                 }
    //                 className="w-full h-48 object-cover mb-2 rounded-md"
    //                 alt={"image"}
    //               />
    //               <div className="flex flex-col space-y-2">
    //                 <h2 className="text-lg font-bold px-3">
    //                   {post.title.substring(0, 30)}
    //                 </h2>
    //                 <p className="text-sm text-gray-500 px-3">~{post.author}</p>
    //                 <p className="text-sm text-gray-500 px-3 pb-2">
    //                   <FontAwesomeIcon icon={faEye} />: {post.views}
    //                 </p>
    //               </div>
    //             </div>
    //           </div>
    //         ))}
    //       </div>
    //     ) : (
    //       <div className="w-full p-8 shadow-lg">
    //         <ul className=" mx-8 p-4 list-none bg-gray-200  shadow-md rounded-md overflow-hidden flex flex-col">
    //           {filteredPosts.map((post, index) => (
    //             <li
    //               key={index}
    //               className="w-3/4 mx-auto flex items-center justify-center p-2 bg-white border-b border-gray-300 cursor-pointer my-2 shadow-md rounded-md transform transition-transform duration-200 hover:scale-105"
    //             >
    //               <img
    //                 src={
    //                   post.imageUrl ||
    //                   "https://assets.hongkiat.com/uploads/psd-text-svg/logo-example.jpg"
    //                 }
    //                 alt={"image"}
    //                 className="w-16 h-16 object-cover mr-2"
    //               />
    //               <div className="flex-1 ml-2">
    //                 <h2 className="text-xl mb-1 border-b border-gray-400">
    //                   <ReactMarkdown className="mb-0">
    //                     {post.title.substring(0, 30)}
    //                   </ReactMarkdown>
    //                 </h2>
    //                 <div className="flex justify-between items-center">
    //                   <p className="mt-0 mb-0">
    //                     {post.description.substring(0, 90)}...
    //                   </p>
    //                   <p className="text-gray-500 mb-0">~{post.author}</p>
    //                 </div>
    //               </div>
    //             </li>
    //           ))}
    //         </ul>
    //       </div>
    //     )}
    //   </div>
    // </div>
  );
};

export default ViewPosts;
