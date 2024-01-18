import React, { useState } from "react";
// import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShare } from "@fortawesome/free-solid-svg-icons";
import { faLinkedin } from "@fortawesome/free-brands-svg-icons";

import { useRouter } from "next/router";

const Sharepost = () => {
  const [isShareIconActive, setIsShareIconActive] = useState(false);
  const [selectedShareIcon, setSelectedShareIcon] = useState(null);

  const router = useRouter();

  const handleShareIcon = (icon) => {
    // Your logic to handle sentiment changes
    setSelectedShareIcon(icon);
    if (icon === "faLinkedin") {
      router.push("https://linkedin.com/");
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
              <FontAwesomeIcon
                id="faLinkedin"
                className="pt-2 pb-2 pr-1 pl-1 transition ease-in-out delay-150 hover:-translate-y-1  hover:text-blue-700 duration-300 cursor-pointer"
                onClick={() => handleShareIcon("faLinkedin")}
                icon={faLinkedin}
              />
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
