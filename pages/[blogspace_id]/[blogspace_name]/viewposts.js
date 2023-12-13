import React, { useEffect, useState } from "react";
import { useRouter } from "next/router"; // Import useRouter from Next.js
// import "./ViewPosts.css";
// import { useBlogContext } from "./BlogContext";
import ReactMarkdown from "react-markdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import "material-icons/iconfont/material-icons.css";
import ThemeSwitch from "./themeSwitch";
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

  const toggleFollow = (companyName) => {
    setCurrentFollowCompany(companyName);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentFollowCompany(null);
    setEmailForFollow("");
  };

  const handleConfirmFollow = () => {
    fetch(
      `https://diaryblogapi2.onrender.com/api/blogSpace/${blogspace_id}/follow`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: emailForFollow }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          // No need to update the local state here, unless you want to reflect changes immediately.
          handleCloseModal();
        } else {
          console.error(data.error);
        }
      })
      .catch((error) => console.error("Error following company:", error));
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  return (
    <div className="flex flex-col justify-center w-full ">
      <ThemeSwitch onThemeChange={toggleDarkMode} />
      <h2 className="text-2xl font-bold mx-auto my-8">
        {blogspace_name}'s Blog
      </h2>

      <div className="flex items-center justify-center gap-4 mb-4 my-2">
        {/* Follow button */}
        <button
          className="px-4 py-2 bg-black text-white border border-white rounded-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
          onClick={() => toggleFollow(blogspace_name)}
        >
          {followedCompanies.includes(blogspace_name) ? "Unfollow" : "Follow"}
        </button>

        {/* Followers count */}
        <span
          className={`text-sm ${isDarkMode ? "dark:text-white" : "text-black"}`}
        >
          {followersCount} {followersCount === 1 ? "follower" : "followers"}
        </span>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-md w-1/3">
            <h2 className="text-xl font-bold mb-2">
              Follow {currentFollowCompany}
            </h2>
            <input
              type="email"
              value={emailForFollow}
              onChange={(e) => setEmailForFollow(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-2 py-1 mb-4 border border-gray-300 rounded-md"
            />
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
                onClick={handleConfirmFollow}
              >
                Confirm Follow
              </button>
              <button
                className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50"
                onClick={handleCloseModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <form
        className="w-full mb-4 flex justify-center"
        onSubmit={(e) => e.preventDefault()}
      >
        <div>
          <input
            className=" w-full px-4 py-3 mx-auto m-2 border border-slate-950 rounded-md"
            type="text"
            placeholder="search posts, company"
            value={postSearch}
            onChange={handleChange}
          />
        </div>
      </form>
      <section className=" flex justify-center mb-4">
        <div className="flex space-x-4">
          <div className="px-4 py-2 bg-black text-white border border-white shadow-xl rounded-md">
            All
          </div>
          <div
            className={`px-4 py-2 bg-white ${
              isDarkMode ? "dark:text-black" : "text-black"
            } border border-black shadow-xl rounded-md`}
          >
            Recent Posted
          </div>
          <div
            className={`px-4 py-2 bg-white ${
              isDarkMode ? "dark:text-black" : "text-black"
            } border border-black shadow-xl rounded-md`}
          >
            Most Trending Posted
          </div>
          <div
            className={`px-4 py-2 bg-white ${
              isDarkMode ? "dark:text-black" : "text-black"
            } border border-black shadow-xl rounded-md`}
          >
            Geography
          </div>
          <div
            className={`px-4 py-2 bg-white ${
              isDarkMode ? "dark:text-black" : "text-black"
            } border border-black shadow-xl rounded-md`}
          >
            Science
          </div>
          <div
            className={`px-4 py-2 bg-white ${
              isDarkMode ? "dark:text-black" : "text-black"
            } border border-black shadow-xl rounded-md`}
          >
            History
          </div>
        </div>
      </section>

      <div className="flex justify-between mx-16 my-4">
        <button
          className=" p-1 bg-black text-white rounded-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
          onClick={handleBackClick}
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <div className="flex space-x-4">
          <button
            className="p-1 bg-black text-white rounded-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
            onClick={() => handleViewModeChange("card")}
          >
            <i className="material-icons">grid_on</i>
          </button>
          <button
            className="p-1 bg-black text-white rounded-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
            onClick={() => handleViewModeChange("list")}
          >
            <i className="material-icons">list</i>
          </button>
        </div>
      </div>

      {viewMode === "card" ? (
        <div className="grid grid-cols-4 gap-4 mx-4">
          {filteredPosts.map((post, index) => (
            <div
              key={index}
              className={`flex w-full`}
              onClick={() => handlePostClick(post._id)}
            >
              <div
                className={`flex flex-col w-full ${
                  isDarkMode ? "dark:bg-dark-blue" : "bg-white"
                } shadow-2xl shadow-slate-950 border border-slate-950" rounded-md m-2 transform transition-transform duration-200 hover:scale-105`}
              >
                <img
                  src={
                    post.imageUrl ||
                    "https://assets.hongkiat.com/uploads/psd-text-svg/logo-example.jpg"
                  }
                  className="w-full h-48 object-cover mb-2 rounded-md"
                  alt={"image"}
                />
                <div className="flex flex-col space-y-2">
                  <h2 className="text-lg font-bold px-3">
                    {post.title.substring(0, 30)}
                  </h2>
                  <p className="text-sm text-gray-500 px-3">~{post.author}</p>
                  <p className="text-sm text-gray-500 px-3 pb-2">
                    <FontAwesomeIcon icon={faEye} />: {post.views}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="w-full p-8 shadow-lg">
          <ul className=" mx-8 p-4 list-none bg-gray-200  shadow-md rounded-md overflow-hidden flex flex-col">
            {filteredPosts.map((post, index) => (
              <li
                key={index}
                className="w-3/4 mx-auto flex items-center justify-center p-2 bg-white border-b border-gray-300 cursor-pointer my-2 shadow-md rounded-md transform transition-transform duration-200 hover:scale-105"
              >
                <img
                  src={
                    post.imageUrl ||
                    "https://assets.hongkiat.com/uploads/psd-text-svg/logo-example.jpg"
                  }
                  alt={"image"}
                  className="w-16 h-16 object-cover mr-2"
                />
                <div className="flex-1 ml-2">
                  <h2 className="text-xl mb-1 border-b border-gray-400">
                    <ReactMarkdown className="mb-0">
                      {post.title.substring(0, 30)}
                    </ReactMarkdown>
                  </h2>
                  <div className="flex justify-between items-center">
                    <p className="mt-0 mb-0">
                      {post.description.substring(0, 90)}...
                    </p>
                    <p className="text-gray-500 mb-0">~{post.author}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ViewPosts;
