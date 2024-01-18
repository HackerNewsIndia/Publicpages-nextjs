"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
// import { useNavigate } from "react-router-dom";
// import "./PublicBlogSpace.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";

const PublicBlogSpace = () => {
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
    const blogId = companyData._id.$oid;
    console.log("Navigating with ID:", companyData.name, blogId);
    router.push(`/diaryblog/${companyData.name}/${blogId}`);
    fetch(`https://diaryblogapi2.onrender.com/api/${blogId}/views`, {
      method: "PUT",
    })
      .then((response) => response.json())
      .then((data) => {
        updatedBlogSpace = blogSpace.map((blogSpaceItem) => {
          if (blogSpaceItem._id === blogId) {
            blogSpaceItem.views === data.views;
          }
          return blogSpaceItem;
        });
        setBlogSpace(updatedBlogSpace);
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
    <div className="public-blog-space-container">
      <div className="search-groups">
        <input
          className="search-input"
          type="text"
          placeholder="search blogs"
          value={blogSearch}
          onChange={handleChange}
        />
        {/* <button className="search-button">Search</button> */}
      </div>

      <div className="public-blog-space-subcontainer">
        <button className="blog-back" onClick={handleBackClick}>
          <i className="fas fa-arrow-left" aria-hidden="true"></i>
        </button>
        <div className="public-blog-space-row row">
          {filteredBlogSpace.map((companyData, index) => (
            <div
              key={index}
              className="public-blog-space-col col-sm-3"
              onClick={() => handleBlog(companyData)}
            >
              <div className="public-blog-space-card card text-center">
                <img
                  src={randomImageUrls[index]}
                  className="public-blog-space-card-img card-img-top"
                  alt={"Company Logo"}
                />
                <div className="public-blog-space-card-body post-body custom-card-body">
                  <h2 className="public-blog-space-card-title post-title">
                    {companyData.name}
                  </h2>
                  <div className="follow-btn-no-of-posts">
                    <button
                      className="follow-btn"
                      onClick={(e) => {
                        e.stopPropagation(); // To prevent handleBlog from being called
                        toggleFollow(companyData.name);
                      }}
                    >
                      {followedCompanies.includes(companyData.name)
                        ? "Unfollow"
                        : "Follow"}
                    </button>
                    <p className="public-blog-space-card-text post-text">
                      {companyData.blogPosts.length} Posts
                    </p>
                  </div>
                  <p className="follower_count">
                    Followers: {followersCounts[companyData._id.$oid] || 0}
                  </p>
                  <p className="post-views">
                    <FontAwesomeIcon icon={faEye} />: {companyData.views}
                  </p>
                </div>
              </div>
            </div>
          ))}
          {isModalOpen && (
            <div className="follow-modal-backdrop">
              <div className="follow-modal">
                <h2>Follow {currentFollowCompany}</h2>
                <input
                  type="email"
                  value={emailForFollow}
                  onChange={(e) => setEmailForFollow(e.target.value)}
                  placeholder="Enter your email"
                />
                <button onClick={handleConfirmFollow}>Confirm Follow</button>
                <button onClick={handleCloseModal}>Cancel</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicBlogSpace;

// export default function Home() {
//   return (
//     <div>
//       <h1>hello!</h1>
//     </div>
//     // <main className="flex min-h-screen flex-col items-center justify-between p-24">
//     //   <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
//     //     <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
//     //       Get started by editing&nbsp;
//     //       <code className="font-mono font-bold">app/page.js</code>
//     //     </p>
//     //     <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
//     //       <a
//     //         className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
//     //         href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
//     //         target="_blank"
//     //         rel="noopener noreferrer"
//     //       >
//     //         By{' '}
//     //         <Image
//     //           src="/vercel.svg"
//     //           alt="Vercel Logo"
//     //           className="dark:invert"
//     //           width={100}
//     //           height={24}
//     //           priority
//     //         />
//     //       </a>
//     //     </div>
//     //   </div>

//     //   <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]">
//     //     <Image
//     //       className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
//     //       src="/next.svg"
//     //       alt="Next.js Logo"
//     //       width={180}
//     //       height={37}
//     //       priority
//     //     />
//     //   </div>

//     //   <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
//     //     <a
//     //       href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
//     //       className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
//     //       target="_blank"
//     //       rel="noopener noreferrer"
//     //     >
//     //       <h2 className={`mb-3 text-2xl font-semibold`}>
//     //         Docs{' '}
//     //         <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
//     //           -&gt;
//     //         </span>
//     //       </h2>
//     //       <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
//     //         Find in-depth information about Next.js features and API.
//     //       </p>
//     //     </a>

//     //     <a
//     //       href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//     //       className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800 hover:dark:bg-opacity-30"
//     //       target="_blank"
//     //       rel="noopener noreferrer"
//     //     >
//     //       <h2 className={`mb-3 text-2xl font-semibold`}>
//     //         Learn{' '}
//     //         <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
//     //           -&gt;
//     //         </span>
//     //       </h2>
//     //       <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
//     //         Learn about Next.js in an interactive course with&nbsp;quizzes!
//     //       </p>
//     //     </a>

//     //     <a
//     //       href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
//     //       className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
//     //       target="_blank"
//     //       rel="noopener noreferrer"
//     //     >
//     //       <h2 className={`mb-3 text-2xl font-semibold`}>
//     //         Templates{' '}
//     //         <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
//     //           -&gt;
//     //         </span>
//     //       </h2>
//     //       <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
//     //         Explore the Next.js 13 playground.
//     //       </p>
//     //     </a>

//     //     <a
//     //       href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
//     //       className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
//     //       target="_blank"
//     //       rel="noopener noreferrer"
//     //     >
//     //       <h2 className={`mb-3 text-2xl font-semibold`}>
//     //         Deploy{' '}
//     //         <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
//     //           -&gt;
//     //         </span>
//     //       </h2>
//     //       <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
//     //         Instantly deploy your Next.js site to a shareable URL with Vercel.
//     //       </p>
//     //     </a>
//     //   </div>
//     // </main>
//   );
// }
