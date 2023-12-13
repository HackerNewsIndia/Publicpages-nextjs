"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
// import { useNavigate } from "react-router-dom";
// import "./PublicBlogSpace.css";
// import { useBlogContext } from "./BlogContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
// import ViewPosts from "./[blogspace_id]/[blogspace_name]/viewposts";

const PublicBlogSpace = () => {
  // const { blogData, setBlogData } = useBlogContext();
  const [blogSpace, setBlogSpace] = useState([]);
  const [followedCompanies, setFollowedCompanies] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentFollowCompany, setCurrentFollowCompany] = useState(null);
  const [emailForFollow, setEmailForFollow] = useState("");
  const [blogSearch, setBlogSearch] = useState("");
  const [followersCounts, setFollowersCounts] = useState({});

  // const navigate = useNavigate();
  const router = useRouter();

  useEffect(() => {
    fetch("https://diaryblogapi2.onrender.com/api/diaryblog_space")
      .then((response) => response.json())
      .then(async (data) => {
        setBlogSpace(data);

        // Fetch followers count for each blogSpace
        const counts = {};
        const promises = data.map(async (bspace) => {
          const response = await fetch(
            `https://diaryblogapi2.onrender.com/api/blogSpace/${bspace._id.$oid}/followers`
          );
          const followersData = await response.json();
          if (response.ok) {
            counts[bspace._id.$oid] = followersData.userEmails?.length || 0;
          } else {
            console.warn(
              `Error fetching followers for blogSpace ID: ${bspace._id.$oid}`,
              followersData
            );
            counts[bspace._id.$oid] = 0;
          }
        });

        // Wait for all fetch operations to complete
        await Promise.all(promises);

        setFollowersCounts(counts);
      })
      .catch((error) =>
        console.error(
          "There was a problem with the fetch operation:",
          error.message
        )
      );
  }, []);

  console.log(blogSpace);

  const generateRandomImageUrls = (count) => {
    const imageUrls = [];
    for (let i = 0; i < count; i++) {
      imageUrls.push(`https://picsum.photos/200/200?random=${i}`);
    }
    return imageUrls;
  };

  // Generate random image URLs once when the component loads
  const randomImageUrls = generateRandomImageUrls(blogSpace.length);

  const handleBlog = (companyData) => {
    const blogspace_id = companyData._id.$oid;
    const blogspace_name = companyData.name;
    console.log("Navigating with ID:", blogspace_name, blogspace_id);
    // const param1 = blogspace_name;
    // const param2 = blogspace_id;
    // router.push(`/viewposts?param1=${param1}&param2=${param2}`);
    router.push(`/${blogspace_id}/${blogspace_name}/viewposts`);
    fetch(`https://diaryblogapi2.onrender.com/api/${blogspace_id}/views`, {
      method: "PUT",
    })
      .then((response) => response.json())
      .then((data) => {
        // Update the view count locally for the company that was clicked.
        const updatedBlogSpace = blogSpace.map((blogSpaceItem) => {
          if (blogSpaceItem._id === blogId) {
            blogSpaceItem.views = data.views;
          }
          return blogSpaceItem;
        });
        setBlogSpace(updatedBlogSpace); // Update the state with the new view count.
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
    // Fetch the blogId for the currentFollowCompany
    const companyData = blogSpace.find(
      (company) => company.name === currentFollowCompany
    );
    if (!companyData) return; // Exit if company data not found

    const blogId = companyData._id.$oid;

    fetch(`https://diaryblogapi2.onrender.com/api/blogSpace/${blogId}/follow`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: emailForFollow }),
    })
      .then((response) => response.json()) // Convert response to json
      .then((data) => {
        if (data.message) {
          setBlogSpace((prevBlogSpace) =>
            prevBlogSpace.map((company) =>
              company.company === currentFollowCompany
                ? { ...company, follower_count: data.follower_count }
                : company
            )
          );
          handleCloseModal();
        } else {
          console.error(data.error);
        }
      })
      .catch((error) => console.error("Error following company:", error));
  };

  const handleChange = (e) => {
    setBlogSearch(e.target.value);
  };

  const filteredBlogSpace = blogSpace.filter((companyData) => {
    const name = companyData.name || ""; // Ensuring 'name' is defined
    return name.toLowerCase().includes(blogSearch.toLowerCase());
  });

  const handleBackClick = () => {
    router.push("/");
  };

  return (
    <div className="mx-2 mb-4">
      <div className="flex flex-col bg-slate-200 rounded-md m-2">
        <input
          className="w-2/3 px-4 py-3 mx-auto m-2 border border-slate-950 rounded-md"
          type="text"
          placeholder="search blogs"
          value={blogSearch}
          onChange={handleChange}
        />
        {/* <button className="search-button">Search</button> */}
      </div>

      <div className="flex flex-col mx-auto bg-slate-300 shadow-md rounded-md p-4 m-2">
        <button
          className="mt-4 ml-4 text-gray-500 hover:text-gray-700"
          onClick={handleBackClick}
        >
          <i className="fas fa-arrow-left" aria-hidden="true"></i>
        </button>
        <div className="grid grid-cols-4 gap-4 m-2">
          {filteredBlogSpace.map((companyData, index) => (
            <div
              key={index}
              className="flex w-full "
              onClick={() => handleBlog(companyData)}
            >
              <div className="flex flex-col w-full bg-white shadow-2xl shadow-slate-950 border border-slate-950 rounded-md p-4 m-2 transform transition-transform duration-200 hover:scale-105">
                <img
                  src={randomImageUrls[index]}
                  className="w-full h-48 object-cover mb-2 rounded-md"
                  alt={"Company Logo"}
                />
                <div className="flex flex-col space-y-2">
                  <h2 className="text-lg font-bold">{companyData.name}</h2>
                  <div className="flex justify-between items-center">
                    <button
                      className="px-2 py-1 bg-black text-white rounded-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
                      onClick={(e) => {
                        e.stopPropagation(); // To prevent handleBlog from being called
                        toggleFollow(companyData.name);
                      }}
                    >
                      {followedCompanies.includes(companyData.name)
                        ? "Unfollow"
                        : "Follow"}
                    </button>
                    <p className="text-sm text-gray-500">
                      {companyData.blogPosts.length} Posts
                    </p>
                  </div>
                  <p className="text-sm text-gray-500">
                    Followers: {followersCounts[companyData._id.$oid] || 0}
                  </p>
                  <p className="text-sm text-gray-500">
                    <FontAwesomeIcon icon={faEye} />: {companyData.views}
                  </p>
                </div>
              </div>
            </div>
          ))}
          {isModalOpen && (
            <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
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
                    onClick={handleConfirmFollow}
                    className="px-1 py-1 bg-black text-white rounded-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
                  >
                    Confirm Follow
                  </button>
                  <button
                    onClick={handleCloseModal}
                    className="px-1 py-1 bg-black text-white rounded-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicBlogSpace;
