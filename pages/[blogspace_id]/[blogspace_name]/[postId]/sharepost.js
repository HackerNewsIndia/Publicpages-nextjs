import React, { useState } from "react";
// import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShare } from "@fortawesome/free-solid-svg-icons";
import { faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { faXTwitter } from "@fortawesome/free-brands-svg-icons";
import { LinkedinShareButton, TwitterShareButton } from "react-share";

import { useRouter } from "next/router";

const Sharepost = ({ post_title, post_image }) => {
  const [isShareIconActive, setIsShareIconActive] = useState(false);
  const [selectedShareIcon, setSelectedShareIcon] = useState(null);

  const router = useRouter();
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleShareIcon = (icon) => {
    // Your logic to handle sentiment changes
    setSelectedShareIcon(icon);
    if (icon === "faLinkedin") {
      const currentUrl = window.location.href;
      router.push(
        "https://www.linkedin.com/sharing/share-offsite/?url=" +
          encodeURIComponent(currentUrl)
      );
    }
  };

  return (
    <div
      className="text-xl italic text-slate-900 "
      onMouseEnter={() => setIsShareIconActive(true)}
      onMouseLeave={() => setIsShareIconActive(false)}
    >
      <div className="flex">
        <div className="flex-col">
          {isShareIconActive ? (
            <div className="flex text-2xl bg-transparent rounded-md">
              {/* <FontAwesomeIcon
                id="faLinkedin"
                className="pt-2 pb-2 pr-1 pl-1 transition ease-in-out delay-150 hover:-translate-y-1  hover:text-blue-700 duration-300 cursor-pointer"
                onClick={() => handleShareIcon("faLinkedin")}
                icon={faLinkedin}
              /> */}
              {/* <LinkedinShareButton url={window.location.href}>
                <FontAwesomeIcon
                  id="faLinkedin"
                  className="pt-2 pb-2 pr-1 pl-1 transition ease-in-out delay-150 hover:-translate-y-1  hover:text-blue-700 duration-300 cursor-pointer"
                  // onClick={() => handleShareIcon("faLinkedin")}
                  icon={faLinkedin}
                />
              </LinkedinShareButton> */}
              <a
                href={`https://www.linkedin.com/shareArticle?url=${encodeURIComponent(
                  currentUrl
                )}&title=${encodeURIComponent(post_title)}`}
                target="_blank"
                rel="noreferrer"
              >
                <FontAwesomeIcon
                  id="faLinkedin"
                  className="pt-2 pb-2 pr-1 pl-1 transition ease-in-out delay-150 hover:-translate-y-1  hover:text-blue-700 duration-300 cursor-pointer"
                  // onClick={() => handleShareIcon("faLinkedin")}
                  icon={faLinkedin}
                />
              </a>
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                  currentUrl
                )}&text=${encodeURIComponent(
                  post_title
                )}&via=diaryblogUnv&media=${encodeURIComponent(post_image)}`}
                target="_blank"
                rel="noreferrer"
              >
                <FontAwesomeIcon
                  id="faLinkedin"
                  className="pt-2 pb-2 pr-1 pl-1 transition ease-in-out delay-150 hover:-translate-y-1  hover:text-blue-700 duration-300 cursor-pointer"
                  // onClick={() => handleShareIcon("faLinkedin")}
                  icon={faXTwitter}
                />
              </a>
              <TwitterShareButton title={post_title} url={currentUrl}>
                <FontAwesomeIcon
                  id="faLinkedin"
                  className="pt-2 pb-2 pr-1 pl-1 transition ease-in-out delay-150 hover:-translate-y-1  hover:text-blue-700 duration-300 cursor-pointer"
                  // onClick={() => handleShareIcon("faLinkedin")}
                  icon={faXTwitter}
                />
              </TwitterShareButton>
            </div>
          ) : (
            //   : selectedShareIcon ? (
            //     <FontAwesomeIcon
            //       icon={selectedSentimentIcon === "faHeart" ? faHeart : null}
            //       className={`text-lg ${
            //         selectedSentimentIcon === "faHeart" ? "text-pink-700" : ""
            //       }`}
            //     />
            //   )
            <FontAwesomeIcon icon={faShare} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Sharepost;
