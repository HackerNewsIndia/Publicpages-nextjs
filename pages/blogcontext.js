import React, { createContext, useContext, useState } from "react";
import Head from "next/head";

const BlogContext = createContext();

export function useBlogContext() {
  return useContext(BlogContext);
}

function BlogProvider({ children }) {
  const [blogData, setBlogData] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);

  return (
    <>
      <Head>
        <title>DiaryBlog All Post</title>
        <meta property="og:title" content="DiaryBlog All Post" />

        {/* <!-- Facebook Meta Tags --> */}
        <meta
          property="og:url"
          content="https://diaryblog.connectingpeopletech.com/"
        />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="DiaryBlog All Post" />
        <meta
          property="og:description"
          content="Writing and publishing articles or posts online, sharing thoughts, opinions, and expertise on various topics to engage with an audience or community"
        />
        <meta
          property="og:image"
          // content="https://diaryblog.connectingpeopletech.com/DBlogo.png"
          content="https://diaryblog.connectingpeopletech.com/_next/static/media/logo7.cc585cd6.svg"
        />

        {/* <!-- Twitter Meta Tags --> */}
        <meta name="twitter:card" />
        <meta
          property="twitter:domain"
          content="universe-nextjs.onrender.com"
        />
        <meta
          property="twitter:url"
          content="https://diaryblog.connectingpeopletech.com/"
        />
        <meta name="twitter:title" content="DiaryBlog All Post" />
        <meta
          name="twitter:description"
          content="Writing and publishing articles or posts online, sharing thoughts, opinions, and expertise on various topics to engage with an audience or community"
        />
        <meta
          name="twitter:image"
          content="https://diaryblog.connectingpeopletech.com/_next/static/media/logo7.cc585cd6.svg"
        />
      </Head>
      <BlogContext.Provider
        value={{ blogData, setBlogData, selectedBlog, setSelectedBlog }}
      >
        {children}
      </BlogContext.Provider>
    </>
  );
}

export default BlogProvider;
