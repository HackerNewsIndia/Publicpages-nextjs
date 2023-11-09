import React, { createContext, useContext, useState } from "react";

const BlogContext = createContext();

export function useBlogContext() {
  return useContext(BlogContext);
}

export function BlogProvider({ children }) {
  const [blogData, setBlogData] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);

  return (
    <BlogContext.Provider
      value={{ blogData, setBlogData, selectedBlog, setSelectedBlog }}
    >
      {children}
    </BlogContext.Provider>
  );
}
