import Image from "next/image";
import React from "react";
import Home from "../components/home";
import Head from "next/head";


export const metadata = {
  title: 'Acme',
  openGraph: {
    title: 'Acme',
    description: 'Acme is a...',
  },
}


export default function HomeApp() {

  
  return (
     <>
     <Head>
         <title>Diary-Blog</title>
         <meta property="og:title" content="DiaryBlog" />
         <meta property="og:description" content="Writing and publishing articles or posts online, sharing thoughts, opinions, and expertise on various topics to engage with an audience or community" />
         <meta property="og:image" content="" />
         <meta property="og:url" content="https://universe-nextjs.onrender.com/" />
         <meta property="og:locale" content="en_US" />
         <meta property="og:image:url" content="https://universe-nextjs.onrender.com/_next/static/media/logo2.82936ace.svg" />
         <meta property="og:image:width" content="800" />
         <meta property="og:image:height" content="600" />
         <meta property="og:image:url" content="https://universe-nextjs.onrender.com/_next/static/media/logo2.82936ace.svg" />
         <meta property="og:image:width" content="1800" />
         <meta property="og:image:height" content="1600" />
         <meta property="og:image:alt" content="Diary Blog" />
         <meta property="og:type" content="website" />
     </Head>
    <Home />
    </>
    );
}
