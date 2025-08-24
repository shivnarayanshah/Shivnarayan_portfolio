"use client";
import { usePathname } from "next/navigation.js";
import React from "react";
import NavigationBar from "./NavigationBar.jsx";
import Footer from "./Footer.jsx";

const layoutWrapper = ({ children }) => {
  const path = usePathname();
  const hideLayout = path.startsWith("/admin") || path === "/auth";
  return (
    <>
      {!hideLayout && <NavigationBar />}
      {children}
      {!hideLayout && <Footer />}
    </>
  );
};

export default layoutWrapper;
