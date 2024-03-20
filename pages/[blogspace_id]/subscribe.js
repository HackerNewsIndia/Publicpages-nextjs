import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Header from "../../components/header";
import Footer from "../../components/footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPeopleGroup } from "@fortawesome/free-solid-svg-icons";

const getUsernameById = async (userId) => {
  try {
    const response = await fetch(
      `https://usermgtapi3.onrender.com/api/get_user/${userId}`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching username:", error.message);
  }
};

const SubscribePage = () => {
  const router = useRouter();
  const { blogspace_id } = router.query;
  console.log(blogspace_id);
  const [blogSpaceData, setBlogSpaceData] = useState("");
  const [userData, setUserData] = useState(null);
  const [email, setEmail] = useState("");
  const [emailAdded, setEmailAdded] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");

  const handleNotNowButton = () => {
    router.back();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://diaryblogapi2.onrender.com/api/blogSpace/${blogspace_id}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setBlogSpaceData(data);
        const ownerId = data.owner;
        if (ownerId) {
          const userData = await getUsernameById(ownerId);
          setUserData(userData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [blogspace_id, emailAdded]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch(
      `https://diaryblogapi2.onrender.com/api/blogSpace/${blogspace_id}/follow`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email }),
      }
    )
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else if (response.status === 400) {
          throw new Error("Email is already subscribed");
        } else {
          throw new Error("Network response was not ok");
        }
      })
      .then((data) => {
        console.log(data);
        setEmail("");
        setEmailAdded(true);
        setResponseMessage(data.message);
        console.log(data.message);
      })
      .catch((error) => {
        console.error("Error:", error);
        setResponseMessage(error.message);
        setEmail("");
      });
  };

  const handleInputChange = (e) => {
    setEmailAdded(false);
    setEmail(e.target.value);
  };

  return (
    <>
      <Header />
      <div className="bg-white text-slate-900">
        <div className="flex flex-col items-center bg-white m-5 md:m-10">
          <img
            src={blogSpaceData.image_url}
            className="rounded-md w-full md:w-1/3 mb-5"
            alt="Blog Space"
          />
          <h1 className="text-3xl font-bold text-slate-600 mb-5 text-center">
            {blogSpaceData.name}
          </h1>
          <div className="flex flex-row space-x-2 mb-5 text-slate-900 text-center items-center">
            <FontAwesomeIcon icon={faPeopleGroup} />
            <p>{blogSpaceData.followers} Followers</p>
          </div>
          <form
            onSubmit={(e) => handleSubmit(e)}
            className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-5"
          >
            <input
              type="email"
              placeholder="Enter your email"
              className="px-2 py-1 rounded-md border-2 border-slate-300 text-slate-900 bg-white w-full md:w-auto"
              value={email}
              onChange={(e) => handleInputChange(e)}
            />
            <button
              type="submit"
              className="bg-slate-800 text-white px-4 py-1 rounded-md w-full md:w-auto"
            >
              Subscribe
            </button>
          </form>

          {responseMessage && (
            <p className="mb-5 text-green-500 text-center">{responseMessage}</p>
          )}

          {userData && (
            <div className="flex flex-row space-x-2 text-slate-900 text-center mb-5">
              <img
                src={`data:image/jpeg;base64, ${userData.image_base64}`}
                alt="avatar"
                className="object-cover w-8 h-8 mx-2 rounded-full"
              />
              <div>{userData.username}</div>
            </div>
          )}

          <div className="flex flex-col items-center">
            <h1 className="text-slate-500 text-2xl font-bold mb-2">
              Get Our Updates
            </h1>
            <p className="text-md text-slate-900 text-center mb-5">
              Find out about events and other news
            </p>
            {emailAdded === true ? (
              <button
                className="border-0 cursor-pointer mt-2 mb-5 text-slate-500 underline decoration-2"
                onClick={() => handleNotNowButton()}
              >
                Back
              </button>
            ) : (
              <button
                className="border-0 cursor-pointer mt-2 mb-5 text-slate-500 underline decoration-2"
                onClick={() => handleNotNowButton()}
              >
                Not now
              </button>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default SubscribePage;
