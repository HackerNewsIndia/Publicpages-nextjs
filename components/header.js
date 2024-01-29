import React, { useState, useEffect } from "react";
import Image from "next/image";
import CustomLink from "next/link";
import logo from "../public/logo2.svg";
import headerNavLinks from "./headernavlinks";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState();

  useEffect(() => {
    // Fetch comments using the post ID
    const fetchUrlParams = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");
      if (token) {
        setIsLoggedIn(true);
        const decoded_token = jwtDecode(token);
        const userId = decoded_token.id;
        console.log(userId);
        setUserId(userId);
      }
    };

    fetchUrlParams();
  }, []);

  const handleLogin = () => {
    console.log("handleLogin called");
    const currentUrl = window.location.href;
    // Redirect the user to the login page with the current URL as a query parameter
    window.location.href = `https://universal-jikv.onrender.com/login?redirectUrl=${encodeURIComponent(
      currentUrl
    )}`;
  };
  return (
    <div className="bg-slate-900 w-full ">
      <header className="flex items-center justify-between">
        <div className="flex flex-row space-x-4">
          <CustomLink href="/" aria-label={"DiaryBlog"}>
            {/* Use Image component directly inside Link */}
            <div className="flex items-center justify-between mt-3 ml-10 mr-3 mb-2 rounded-md bg-slate-900 cursor-pointer">
              <Image
                src={logo}
                alt="Logo"
                width={280}
                height={70}
                objectFit="fill"
                className="rounded-md"
              />
              {/* <h1>Universe</h1> */}
            </div>
          </CustomLink>
          <div className="flex items-center  space-x-4 leading-5 sm:space-x-6">
            {headerNavLinks
              .filter((link) => link.href !== "/")
              .map((link) => (
                <div
                  key={link.title}
                  className="bg-white text-black rounded-md px-3 py-2 text-sm font-medium"
                >
                  <CustomLink
                    href={link.href}
                    className="hidden font-medium text-white !important dark:text-white sm:block "
                  >
                    {link.title}
                  </CustomLink>
                </div>
              ))}
          </div>
        </div>
        <div className="flex flex-row items-center">
          <div className="flex items-center py-6">
            {!isLoggedIn ? (
              <button
                // href=`https://universal-jikv.onrender.com/login?redirectUrl=${encodeURIComponent(
                //   currentUrl)`
                // className=" mr-5 bg-white block rounded-lg px-3 py-1 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                className="mr-5 text-white "
                onClick={() => handleLogin()}
              >
                Log in
                <FontAwesomeIcon className="pl-2" icon={faArrowRight} />
              </button>
            ) : (
              <div className="bg-white rounded-full text-blue"></div>
            )}
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
