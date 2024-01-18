import Image from "next/image";
import React from "react";
// import "./globals.css";
// import PublicBlogSpace from "../components/PublicBlogSpace";
import Home from "../components/home";
import { BlogProvider } from "./blogcontext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import Header from "../components/header";

export default function HomePage() {
  return (
    <BlogProvider>
      <Header />
      <Home />
    </BlogProvider>
  );
}
