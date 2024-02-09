import Image from "next/image";
import React from "react";
import Home from "../components/home";
import BlogProvider from "./blogcontext";
import Header from "../components/header";
import Footer from "../components/footer";

export default function HomePage() {
  return (
     <>
      <Head>
        <title>DiaryBlog</title>
        <meta property="og:title" content="DiaryBlog" />
        <meta property="og:description" content="Writing and publishing articles or posts online, sharing thoughts, opinions, and expertise on various topics to engage with an audience or community" />
        <meta property="og:image" content="https://universe-nextjs.onrender.com/_next/static/media/logo2.82936ace.svg" />
    </Head>
    <BlogProvider>
      <Header />
      <Home />
      <Footer />
    </BlogProvider>
    </>
  );
}
