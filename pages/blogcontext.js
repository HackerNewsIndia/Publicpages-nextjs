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
        <title>Diary-Blog4</title>
        <meta property="og:title" content="Diary-Blog4" />
        <meta property="og:description" content="Writing and publishing articles or posts online, sharing thoughts, opinions, and expertise on various topics to engage with an audience or community" />
        <meta
          property="og:image"
          content="https://universe-nextjs.onrender.com/DBlogo.png"
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
