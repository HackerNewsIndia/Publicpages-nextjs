import { useEffect, useState } from "react";
import { useRouter } from "next/router";

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
          const response = await fetch(
            // `http://127.0.0.1:5000/api/get_user/${user_id}`
            `https://usermgtapi3.onrender.com/api/get_user/${user_id}`
          );
          const data = await response.json();

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

  return (
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
              style={{ borderRadius: "500px", maxWidth: "50%" }}
            />
          )}
        </div>

        <section
          className="px-5 py-8 sm-p:md:px-10"
          style={{
            backgroundColor: "#fff5be6d",
            color: "#000000",
            "--link-bg": "#fff5be6d",
            "--link-bg-hover": "#b154ce",
            "--link-text-hover": "#ffffff",
          }}
        >
          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-4 sm-p:md:grid-cols-2">
            {/* LinkedIn Link */}
            <a
              href={userData.linkedin}
              className="flex items-center justify-between rounded-full border border-opacity-20 px-5 py-2 transition-all ease-out svelte-lahumd border-black"
            >
              <span className="text-md w-0 flex-grow font-bold">LinkedIn</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="tabler-icon tabler-icon-brand-linkedin"
              >
                <path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"></path>
                <path d="M8 11l0 5"></path>
                <path d="M8 8l0 .01"></path>
                <path d="M12 16l0 -5"></path>
                <path d="M16 16v-3a2 2 0 0 0 -4 0"></path>
              </svg>
            </a>

            {/* Twitter Link */}
            <a
              href={userData.twitter}
              className="flex items-center justify-between rounded-full border border-opacity-20 px-5 py-2 transition-all ease-out svelte-lahumd border-black"
            >
              <span className="text-md w-0 flex-grow font-bold">Twitter</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="tabler-icon tabler-icon-brand-twitter"
              >
                <path d="M22 4.01c-1 .49 -1.98 .689 -3 .99c-1.121 -1.265 -2.783 -1.335 -4.38 -.737s-2.643 2.06 -2.62 3.737v1c-3.245 .083 -6.135 -1.395 -8 -4c0 0 -4.182 7.433 4 11c-1.872 1.247 -3.739 2.088 -6 2c3.308 1.803 6.913 2.423 10.034 1.517c3.58 -1.04 6.522 -3.723 7.651 -7.742a13.84 13.84 0 0 0 .497 -3.753c0 -.249 1.51 -2.772 1.818 -4.013z"></path>
              </svg>
            </a>

            {/* GitHub Link */}
            <a
              href={userData.github}
              className="flex items-center justify-between rounded-full border border-opacity-20 px-5 py-2 transition-all ease-out svelte-lahumd border-black"
            >
              <span className="text-md w-0 flex-grow font-bold">GitHub</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="tabler-icon tabler-icon-brand-github"
              >
                <path d="M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5"></path>
              </svg>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Profile;
