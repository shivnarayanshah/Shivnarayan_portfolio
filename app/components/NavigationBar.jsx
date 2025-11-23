"use client";
import Link from "next/link";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { FiMenu, FiX } from "react-icons/fi";
import { FaInstagram, FaTiktok, FaGithub } from "react-icons/fa";

const NavigationBar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Projects", path: "/projects" },
    { name: "Contact", path: "/contact" },
    { name: "About", path: "/about" },
  ];

  const isActive = (path) =>
    pathname === path
      ? "text-green-400 underline underline-offset-8 font-bold"
      : "text-neutral-300 hover:text-green-400";

  return (
    <section className="fixed top-0 z-10 w-full h-16 bg-black text-xl py-4 px-8 lg:px-32 sm:px-8 md:px-16 flex justify-between items-center shadow-md shadow-green-400">
      <div className="text-transparent bg-gradient-to-r from-green-200 to-green-600 bg-clip-text">
        <Link href="/">
          <span className="text-2xl font-bold cursor-pointer">
            Shiv_Narayan_Sah
          </span>
        </Link>
      </div>

      <div className="hidden sm:flex gap-4">
        {navLinks.map((link) => (
          <Link
            key={link.path}
            href={link.path}
            className={`transition ${isActive(link.path)}`}
          >
            {link.name}
          </Link>
        ))}
      </div>

      <div className="hidden lg:flex items-center gap-4 text-neutral-300">
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaInstagram className="text-2xl hover:text-pink-500 transition" />
        </a>
        <a
          href="https://www.tiktok.com/@the_crazy_dev"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaTiktok className="text-2xl hover:text-white transition" />
        </a>
        <a
          href="https://github.com/shivnarayanshah"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaGithub className="text-2xl hover:text-gray-400 transition" />
        </a>
        <Link
          href={"/contact"}
          className="bg-green-600 hover:bg-green-500 px-4 py-1 rounded text-white transition"
        >
          Get in touch
        </Link>
      </div>

      <div className="sm:hidden">
        <button
          onClick={toggleMobileMenu}
          className="text-neutral-300 text-2xl"
        >
          {isMobileMenuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      <div
        className={`sm:hidden fixed top-16 right-0 w-4/5 max-w-xs h-[calc(100vh-4rem)] bg-black text-white transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="flex flex-col items-start gap-6 py-6 px-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              onClick={toggleMobileMenu}
              className={`w-full transition ${isActive(link.path)}`}
            >
              {link.name}
            </Link>
          ))}

          <div className="flex gap-6 pt-4">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram className="text-2xl hover:text-pink-500 transition" />
            </a>
            <a
              href="https://www.tiktok.com/@the_crazy_dev"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaTiktok className="text-2xl hover:text-white transition" />
            </a>
            <a
              href="https://github.com/shivnarayanshah"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaGithub className="text-2xl hover:text-gray-400 transition" />
            </a>
          </div>

          <Link
            href={"/contact"}
            onClick={toggleMobileMenu}
            className="mt-4 bg-green-600 hover:bg-green-500 px-5 py-2 rounded text-white transition"
          >
            Get in touch
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NavigationBar;
