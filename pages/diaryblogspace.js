import Image from "next/image";
import Head from "next/head";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import Header from "../components/header";
import Footer from "../components/footer";

const PublicBlogSpace = () => {
  const [blogSpace, setBlogSpace] = useState([]);
  const [followedCompanies, setFollowedCompanies] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentFollowCompany, setCurrentFollowCompany] = useState(null);
  const [emailForFollow, setEmailForFollow] = useState("");
  const [blogSearch, setBlogSearch] = useState("");
  const [followersCounts, setFollowersCounts] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(null);

  const router = useRouter();



  useEffect(() => {
    fetch("https://diaryblogapi2.onrender.com/api/diaryblog_space")
      .then((response) => response.json())
      .then(async (data) => {
        console.log("blogSpaces:", data);
        setBlogSpace(data);
        console.log("no. of blogspaces :", blogSpace.length);

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
  console.log("no. of blogspaces :", blogSpace.length);

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
    router.push(`/${blogspace_id}/viewposts`);
    fetch(`https://diaryblogapi2.onrender.com/api/${blogspace_id}/views`, {
      method: "PUT",
    })
      .then((response) => response.json())
      .then((data) => {
        // Update the view count locally for the company that was clicked.
        const updatedBlogSpace = blogSpace.map((blogSpaceItem) => {
          if (blogSpaceItem._id === blogspace_id) {
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

 // const toggleFollow = (companyName) => {
 //   setCurrentFollowCompany(companyName);
 //   setIsModalOpen(true);
//  };

 const toggleFollow = (_id) => {
    setCurrentFollowCompany(_id);
    setIsModalOpen(true);
    // Navigate to the subscription page for the company being followed using _id
    router.push(`/${_id}/subscribe`);
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


  const handleCategorySelect = (category) => {
    setSelectedCategory((prevCategory) =>
      prevCategory === category ? null : category
    );
  };

  const filteredBlogSpace = blogSpace.filter((companyData) => {
    const name = companyData.name || ""; // Ensuring 'name' is defined
    const category = companyData.category || ""; // Assuming 'category' is a field in your data
    return (
      name.toLowerCase().includes(blogSearch.toLowerCase()) &&
      (selectedCategory === null || category === selectedCategory)
    );
  });


  const handleBackClick = () => {
    router.push("/");
  };

  return (
    <>
      <Head>
        <title>DiaryBlogSpace</title>
        <meta property="og:title" content="DiaryBlogSpace" />
        <meta
          property="og:description"
          content="Writing and publishing articles or posts online, sharing thoughts, opinions, and expertise on various topics to engage with an audience or community"
        />
        <meta
          property="og:image"
          content="https://unavatar.now.sh/twitter/diaryblogspace"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@diaryblogspace" />
        <meta name="twitter:creator" content="@diaryblogspace" />
        <meta name="twitter:title" content="DiaryBlogSpace" />
        <meta
          name="twitter:description"
          content="Writing and publishing articles or posts online, sharing thoughts, opinions, and expertise on various topics to engage with an audience or community"
        />
        <meta
          name="twitter:image"
          content="https://unavatar.now.sh/twitter/diaryblogspace"
        />
      </Head>
      <div className="dark:bg-gray-800">
        <Header />
        <div className="mx-2 mb-4 bg-white ">
          <section className="py-6 sm:py-6 text-slate-900 mx-4 md:mx-10 lg:mx-20 xl:mx-40">
            <div className="container p-6 mx-auto space-y-8">
              <div className="space-y-2 text-center">
                <h2 className="text-3xl font-bold">All Channels</h2>
              </div>
            </div>
            <div className="container mx-auto  flex flex-col items-center justify-center p-4  space-y-8 md:p-4 lg:space-y-0 lg:flex-row lg:justify-between">
              <h1 className="text-3xl sm:text-xl md:text-3xl font-semibold text-center lg:text-left">
                {blogSpace.length} Blogs in 5 categories
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
                  placeholder="Search by Blogname …"
                  value={blogSearch}
                  onChange={handleChange}
                  className="w-32 py-2 pl-10 bg-white border-2 text-sm text-slate-900 rounded-md sm:w-auto focus:outline"
                />
              </div>
            </div>
          </section>

          <div className="flex flex-wrap items-start text-slate-900 justify-center p-6 md:mx-10 lg:mx-20 xl:mx-40">
          <button
    type="button"
    className={`relative px-3 py-1 m-1 text-sm border rounded-md shadow-sm sm:py-2 sm:text-base ring ring-transparent group md:px-4 hover:ring hover:ring-opacity-50 focus:ring-opacity-50 ${
      selectedCategory === "Lifestyle" ? "bg-blue-500 text-white" : ""
    }`}
    onClick={() => handleCategorySelect("Lifestyle")}
  >
    <span className="flex items-center">
      Lifestyle
      {selectedCategory === "Lifestyle" && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 ml-1 text-red-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          onClick={(e) => {
            e.stopPropagation(); // Prevent the button click event from triggering
            handleCategorySelect(null); // Deselect the category
          }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      )}
    </span>
  </button>
  <button
          type="button"
          className={`relative px-3 py-1 m-1 text-sm border rounded-md shadow-sm sm:py-2 sm:text-base ring ring-transparent group md:px-4 hover:ring hover:ring-opacity-50 focus:ring-opacity-50 ${
            selectedCategory === "Technology" ? "bg-blue-500 text-white" : ""
          }`}
          onClick={() => handleCategorySelect("Technology")}
        >
          <span className="flex items-center">
          Technology
      {selectedCategory === "Technology" && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 ml-1 text-red-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          onClick={(e) => {
            e.stopPropagation(); // Prevent the button click event from triggering
            handleCategorySelect(null); // Deselect the category
          }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      )}
    </span>
  </button>    
  <button
          type="button"
          className={`relative px-3 py-1 m-1 text-sm border rounded-md shadow-sm sm:py-2 sm:text-base ring ring-transparent group md:px-4 hover:ring hover:ring-opacity-50 focus:ring-opacity-50 ${
            selectedCategory === "Food and Recipes" ? "bg-blue-500 text-white" : ""
          }`}
          onClick={() => handleCategorySelect("Food and Recipes")}
        >
        

         <span className="flex items-center">
         Food and Recipes
      {selectedCategory === "Food and Recipes" && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 ml-1 text-red-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          onClick={(e) => {
            e.stopPropagation(); // Prevent the button click event from triggering
            handleCategorySelect(null); // Deselect the category
          }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      )}
    </span>
  </button> 
          <button
          type="button"
          className={`relative px-3 py-1 m-1 text-sm border rounded-md shadow-sm sm:py-2 sm:text-base ring ring-transparent group md:px-4 hover:ring hover:ring-opacity-50 focus:ring-opacity-50 ${
            selectedCategory === "Personal Finance" ? "bg-blue-500 text-white" : ""
          }`}
          onClick={() => handleCategorySelect("Personal Finance")}
        >
          
          <span className="flex items-center">
          Personal Finance
      {selectedCategory === "Personal Finance" && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 ml-1 text-red-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          onClick={(e) => {
            e.stopPropagation(); // Prevent the button click event from triggering
            handleCategorySelect(null); // Deselect the category
          }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      )}
    </span>
  </button> 
        <button
          type="button"
          className={`relative px-3 py-1 m-1 text-sm border rounded-md shadow-sm sm:py-2 sm:text-base ring ring-transparent group md:px-4 hover:ring hover:ring-opacity-50 focus:ring-opacity-50 ${
            selectedCategory === "Parenting and Family" ? "bg-blue-500 text-white" : ""
          }`}
          onClick={() => handleCategorySelect("Parenting and Family")}
        >
          
          <span className="flex items-center">
          Parenting and Family
      {selectedCategory === "Parenting and Family" && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 ml-1 text-red-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          onClick={(e) => {
            e.stopPropagation(); // Prevent the button click event from triggering
            handleCategorySelect(null); // Deselect the category
          }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      )}
    </span>
  </button> 
          </div>

          <div class="grid grid-cols-1 gap-x-4 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredBlogSpace.map((companyData, index) => (
              <article
                key={index}
                className="flex flex-col border-2 border-slate-200 rounded-md divide-slate-900 cursor-pointer"
                onClick={() => handleBlog(companyData)}
              >
               {/*  <div className="flex flex-col space-y-1">
                  <span className="text-md dark:text-black-600">
                    Created: 02 Feb 2023
                  </span>
                </div> */}
                <div>
                <img
                  src={companyData.image_url}
                  alt=""
                  className="object-cover w-full h-48 mb-6 dark:bg-gray-100"
                /></div>
                <div className="flex-grow flex flex-col justify-between bg-white dark:bg-slate-800 p-6">
                <div className="flex justify-between w-full">

                  <div className="flex-1">
                    
                   <div className=" hover:underline">
                    <h3 className="text-xl font-semibold leading-7 text-gray-900 dark:text-white ">
                      {companyData.name}
                    </h3>
                    </div>
                    {/* <p className="mt-3 text-base leading-6 text-gray-500 dark:text-gray-400">
                      {companyData.description}
                    </p> */}
                    <p >  
                    <strong>category:</strong>{companyData.category} </p>
                  </div>
                  {/* Follow Button */}
                  <div>
      <button
        className="h-8 px-4 m-2 text-sm text-indigo-100 transition-colors duration-150 bg-indigo-700 rounded-lg focus:shadow-outline hover:bg-indigo-800"
       // onClick={() => toggleFollow(companyData.name)}
                  onClick={() => toggleFollow(companyData._id.$oid)} // Pass the _id to toggleFollow

      >
        Follow
      </button>
    </div>
    </div>

    <div className="flex flex-wrap justify-between pt-3 space-x-2 text-xs text-slate-900 ">
                      <span>{companyData.views} Views</span>
                      <span>
                        {followersCounts[companyData._id.$oid] || 0} Followers
                      </span>
                    </div>
                  </div>
                </article>
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
        <Footer />
    </>
  );
};

export default PublicBlogSpace;
