import React from "react";

import { FaInstagram, FaTiktok, FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-black text-neutral-300 py-10 px-8 sm:px-8 md:px-16 lg:px-32">
      <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex gap-4">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-pink-500 transition"
          >
            <FaInstagram className="text-xl" />
          </a>
          <a
            href="https://www.tiktok.com/@the_crazy_dev"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition"
          >
            <FaTiktok className="text-xl" />
          </a>
          <a
            href="https://github.com/shivnarayanshah"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-400 transition"
          >
            <FaGithub className="text-xl" />
          </a>
        </div>
        <div className="mt-8 text-center text-xs text-neutral-500">
          &copy; {new Date().getFullYear()} THE_CRAZY_DEV. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
