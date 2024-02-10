import Image from "next/image";
import React from "react";
import Home from "../components/home";
import BlogProvider from "./blogcontext";
import Header from "../components/header";
import Footer from "../components/footer";
import Head from "next/head";

export const metadata = {
  title: 'Acme2',
  openGraph: {
    title: 'Acme2',
    description: 'Acme2 is a...',
  },
}

export default function RootLayout({ children }) {
  return (
     <html lang="en">
       <body>
        <Header />
        <Home />
        <Footer />
      </body>
    </html>
   <
  );
}
