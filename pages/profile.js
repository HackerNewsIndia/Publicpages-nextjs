import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Footer from "../components/footer";
import Header from "../components/header";
import {
  FaLinkedin,
  FaTwitter,
  FaGithub,
  FaReddit,
  FaWhatsapp,
  FaFacebook,
  FaInstagram,
  FaGlobe,
} from "react-icons/fa";

const iconMap = {
  LinkedIn: <FaLinkedin style={{ color: "#0077B5", fontSize: "2rem" }} />, // LinkedIn color
  Twitter: <FaTwitter style={{ color: "#1DA1F2", fontSize: "2rem" }} />, // Twitter color
  GitHub: <FaGithub style={{ color: "#333", fontSize: "2rem" }} />, // GitHub color
  Reddit: <FaReddit style={{ color: "#FF4500", fontSize: "2rem" }} />, // Reddit color
  WhatsApp: <FaWhatsapp style={{ color: "#25D366", fontSize: "2rem" }} />, // WhatsApp color
  Facebook: <FaFacebook style={{ color: "#1877F2", fontSize: "2rem" }} />, // Facebook color
  Instagram: <FaInstagram style={{ color: "#E1306C", fontSize: "2rem" }} />, // Instagram color
  Website: <FaGlobe style={{ color: "#000", fontSize: "2rem" }} />, // Website color (black)
};

const Profile = () => {
  // console.log(user_id)
  const router = useRouter();
  const { user_id } = router.query;
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserData = async () => {
      try {
        if (user_id) {
          // const response = await fetch(
          // `http://127.0.0.1:5000/api/get_user/${user_id}`
          // `https://usermgtapi3.onrender.com/api/get_user/${user_id}`
          const response = await fetch(
            `https://usermgtapi-msad.onrender.com/api/get_user/${user_id}`
          );

          const data = await response.json();

          console.log("Fetched user data:", data); // Debug log

          if (response.ok) {
            setUserData(data);
          } else {
            console.error("Error fetching user data:", data.error);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    getUserData();
  }, [user_id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!userData.profile_links) {
    return <p>No profile links available.</p>; // Additional error handling
  }

  return (
    <div>
      <Header />
      <div className="flex items-center justify-center h-screen">
        <div
          className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full"
          style={{
            boxShadow:
              "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div className="mx-auto flex w-full items-center justify-center overflow-hidden">
            {userData.image_base64 && (
              <img
                src={`data:image/png;base64, ${userData.image_base64}`}
                alt=""
                className="rounded-full max-w-[30%]"
              />
            )}
          </div>
          <div className="text-center mt-4">
            <h2 className="text-2xl font-bold mt-4">{userData.username}</h2>
          </div>

          <section
            className="px-5 py-8 sm:md:px-10"
            style={{
              backgroundColor: "#fff5be6d",
              color: "#000000",
              "--link-bg": "#fff5be6d",
              "--link-bg-hover": "#b154ce",
              "--link-text-hover": "#ffffff",
            }}
          >
            <div className="mx-auto grid max-w-4xl grid-cols-1 gap-4 sm:md:grid-cols-2">
              {userData.profile_links.map((link, index) => {
                try {
                  console.log(`Rendering link ${index}:`, link); // Debug log
                  const parsedLink = JSON.parse(link.replace(/'/g, '"')); // Replace single quotes with double quotes and parse
                  return (
                    <SocialLink
                      key={index}
                      href={parsedLink.url}
                      label={parsedLink.type}
                      icon={iconMap[parsedLink.type]}
                    />
                  );
                } catch (error) {
                  console.error(`Error parsing link ${index}:`, error);
                  return null; // Handle the case where parsing fails
                }
              })}
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
};

const SocialLink = ({ href, label, icon }) => (
  <a
    href={href}
    className="flex flex-col items-center justify-center rounded-lg border border-opacity-20 p-4 transition-all ease-out border-black hover:bg-gray-200 active:bg-gray-300 touch-manipulation"
    style={{
      backgroundColor: "#F0F6F9",
      "--widget-color": "#007EBB",
      "--widget-color-hover": "#E9F4FA",
      "--widget-color-active": "#DFEFF8",
    }}
  >
    {icon}
    <span className="text-md font-bold mt-2">{label}</span>
  </a>
);

export default Profile;
