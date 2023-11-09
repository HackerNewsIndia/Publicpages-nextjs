// pages/AuthRoutes.js

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Home from "@/components/Home";
// import Login from "@/components/Login";
// import Register from "@/components/Registration";
// import Dashboard from "@/components/Dashboard";
import PublicBlogSpace from "@/components/PublicBlogSpace";
// import ViewPosts from "@/components/ViewPosts";
// import Post from "@/components/Post";

const AuthRoutes = () => {
  return (
    <div className="authroutes_div">
      <Link href="/">Home</Link>
      {/* <Link href="/login">Login</Link>
      <Link href="/register">Register</Link>
      {isLoggedIn && <Link href="/dashboard">Dashboard</Link>} */}
      <Link href="/diaryblogSpace">Public Blog Space</Link>
      {/* <Link href="/diaryblog/:blogspace_name/:blogspace_id">View Posts</Link>
      <Link href="/company/:blogspace_name/:blogSpaceId/post/:postId">Post</Link> */}

      {/* <button onClick={logout}>Logout</button> */}

      {/* Render the appropriate component based on the route */}
      {router.pathname === "/" && <Home />}
      {/* {router.pathname === "/login" && (
        <Login onLogin={() => setIsLoggedIn(true)} />
      )}
      {router.pathname === "/register" && (
        <Register onRegister={() => setIsLoggedIn(true)} />
      )}
      {isLoggedIn && router.pathname === "/dashboard" && (
        <Dashboard onLogout={logout} user={user} isLoggedIn={isLoggedIn} />
      )} */}
      {router.pathname === "/diaryblogSpace" && <PublicBlogSpace />}
      {/* {router.pathname === "/diaryblog/:blogspace_name/:blogspace_id" && <ViewPosts />}
      {router.pathname === "/company/:blogspace_name/:blogSpaceId/post/:postId" && <Post />} */}
    </div>
  );
};

export default AuthRoutes;
