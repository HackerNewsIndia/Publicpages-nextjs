import React, { useState } from "react";
// import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShare } from "@fortawesome/free-solid-svg-icons";
import {
  faLinkedin,
  faXTwitter,
  faRedditAlien,
} from "@fortawesome/free-brands-svg-icons";
import { LinkedinShareButton, TwitterShareButton } from "react-share";
import Head from "next/head";

import { useRouter } from "next/router";

const Sharepost = ({
  post_title,
  post_image,
  post_description,
  postStatus,
}) => {
  const [isShareIconActive, setIsShareIconActive] = useState(false);
  const [selectedShareIcon, setSelectedShareIcon] = useState(null);

  const router = useRouter();
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";
  const imageUrl =
    "https://upload.twitter.com/1/statuses/update_with_media.json";

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

  function truncateText(text, limit) {
    const words = text.split(" ");
    const truncated = words.slice(0, limit).join(" ");
    return `${truncated}${words.length > limit ? "..." : ""}`;
  }

  return (
    <div
      className="text-xl italic text-slate-900 "
      onMouseEnter={() => setIsShareIconActive(true)}
      onMouseLeave={() => setIsShareIconActive(false)}
    >
      {postStatus === "preview" ? null : (
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
                  )}&description=${encodeURIComponent(
                    truncateText(post_description, 27)
                  )}&via=PeopleConninc&image=${encodeURIComponent(post_image)}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <FontAwesomeIcon
                    id="faLinkedin"
                    className="pt-2 pb-2 pr-1 pl-1 transition ease-in-out delay-150 hover:-translate-y-1  hover:text-slate-700 duration-300 cursor-pointer"
                    // onClick={() => handleShareIcon("faLinkedin")}
                    icon={faXTwitter}
                  />
                </a>

                <a
                  href={`https://www.reddit.com/submit?url=${encodeURIComponent(
                    currentUrl
                  )}&title=${encodeURIComponent(post_title)}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <FontAwesomeIcon
                    className="pt-2 pb-2 pr-1 pl-1 transition ease-in-out delay-150 hover:-translate-y-1 hover:text-orange-700 duration-300 cursor-pointer"
                    icon={faRedditAlien}
                  />
                </a>
                {/* <TwitterShareButton title={post_title} url={currentUrl}>
                <FontAwesomeIcon
                  id="faLinkedin"
                  className="pt-2 pb-2 pr-1 pl-1 transition ease-in-out delay-150 hover:-translate-y-1  hover:text-blue-700 duration-300 cursor-pointer"
                  // onClick={() => handleShareIcon("faLinkedin")}
                  icon={faXTwitter}
                />
              </TwitterShareButton> */}
              </div>
            ) : (
              <FontAwesomeIcon icon={faShare} />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Sharepost;
