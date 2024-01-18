import Image from "next/image";
import React from "react";
import Home from "../components/home";
import { BlogProvider } from "./blogcontext";
import Header from "../components/header";

export default function HomePage() {
  return (
    <BlogProvider>
      <Header />
      <Home />
    </BlogProvider>
  );
}
