import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import CustomLink from "next/link";
import logo from "../public/logo2.svg";
import headerNavLinks from "./headernavlinks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faBars } from "@fortawesome/free-solid-svg-icons";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const mobileMenuRef = useRef(null);

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
    // Add event listener to close mobile menu when clicking outside of it
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogin = () => {
    console.log("handleLogin called");
    const currentUrl = window.location.href;
    // Redirect the user to the login page with the current URL as a query parameter
    window.location.href = `https://universal-jikv.onrender.com/login?redirectUrl=${encodeURIComponent(
      currentUrl
    )}`;
  };
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };
  const handleClickOutside = (event) => {
    if (
      mobileMenuRef.current &&
      !mobileMenuRef.current.contains(event.target) &&
      !event.target.classList.contains("mobile-menu-link")
    ) {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <div className="bg-slate-900 w-full">
      <header className="flex items-center justify-between mx-4 sm:mx-6 md:mx-8 lg:mx-10 xl:mx-20 py-4">
        {/* Mobile Menu Button */}
        <div className="flex flex-row space-x-4 items-center">
          <div className="sm:hidden " ref={mobileMenuRef}>
            <button
              className="text-white focus:outline-none"
              onClick={toggleMobileMenu}
            >
              <FontAwesomeIcon icon={faBars} size="2x" />
            </button>
          </div>

          {/* Logo */}
          <div className="flex items-center space-x-4">
            <CustomLink href="/" aria-label={"DiaryBlog"}>
              <div className="flex items-center justify-center mt-3 mb-2 rounded-md bg-slate-900 cursor-pointer">
                <Image
                  src={logo}
                  alt="Logo"
                  width={200}
                  height={70}
                  objectFit="fill"
                  className="rounded-md"
                />
              </div>
            </CustomLink>
          </div>

          {/* Desktop Menu */}
          <div className="hidden sm:flex items-center space-x-4 leading-5">
            {headerNavLinks
              .filter((link) => link.href !== "/")
              .map((link) => (
                <div
                  key={link.title}
                  className="bg-white text-black rounded-md px-2 py-1 text-sm font-medium"
                >
                  <CustomLink
                    href={link.href === "/allposts" ? "/" : link.href}
                    className="font-medium text-white !important dark:text-white"
                  >
                    {link.title}
                  </CustomLink>
                </div>
              ))}
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="sm:hidden fixed top-4 left-0 right-0 bg-slate-900 z-10">
              <div className="flex flex-col items-start space-y-2 mt-16">
                {headerNavLinks
                  .filter((link) => link.href !== "/")
                  .map((link) => (
                    <div
                      key={link.title}
                      className="text-white px-4 py-2 font-medium"
                    >
                      <a
                        href={link.href === "/allposts" ? "/" : link.href}
                        className="text-white mobile-menu-link"
                        onClick={closeMobileMenu}
                      >
                        {link.title}
                      </a>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Login Button */}
        <div className="flex items-center">
          <div className="flex items-center py-6">
            {!isLoggedIn ? (
              <button className="mr-5 text-white" onClick={() => handleLogin()}>
                Log in
                <FontAwesomeIcon
                  className="pl-2 hidden md:inline"
                  icon={faArrowRight}
                />
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
