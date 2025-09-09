import Image from "next/image";
import Link from "next/link";
import React from "react";

const Home = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2  pb-4 min-h-screen pt-20 bg-black text-white px-6 sm:px-8 lg:px-32 gap-10">
      <div className="flex justify-center items-center lg:justify-end order-1 lg:order-2">
        <div className="relative w-90 h-90 sm:w-100 sm:h-100 md:w-110 md:h-110  border-2 border-green-400 rounded-[50%] shadow-lg shadow-green-800 overflow-hidden hover:shadow-xl ">
          <Image
            src="/images/profile.jpeg"
            alt="Certificate or Profile"
            fill={true}
            className="object-cover"
            priority={true}
            sizes="(max-width: 768px) 20rem, (min-width: 768px) 27.5rem"
          />
        </div>
      </div>

      <div className="flex flex-col justify-center gap-8 order-2 lg:order-1 w-full">
        <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-gradient-to-r from-green-300 to-green-600 bg-clip-text">
          IT'S SHIV NARAYAN SAH.
        </h1>
        <p className="text-base sm:text-lg text-neutral-300">
          I craft web experiences with precision and intent—clean interfaces,
          intuitive user flows, and purposeful design. Using the MERN stack and
          Next.js, I build responsive, high-performance websites where every
          line of code is deliberate and every pixel has meaning.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link
            href={"/contact"}
            className="p-3 sm:p-4 border border-green-400 text-base sm:text-xl rounded-2xl hover:bg-green-400 hover:scale-105 transition-all duration-200 shadow-lg hover:text-black shadow-green-800"
          >
            Let's Connect
          </Link>
          <Link
            className="p-3 sm:p-4 border border-green-400 text-base sm:text-xl rounded-2xl hover:bg-green-400 hover:scale-105 transition-all duration-200 shadow-lg hover:text-black shadow-green-800"
            href={"/Shivnarayan.pdf"}
            download={"ShivNarayan-Sah-Resume.pdf"}
          >
            Download Resume
          </Link>
          <Link href="/certificate">
            <button className="p-3 sm:p-4 border border-green-400 text-base sm:text-xl rounded-2xl hover:bg-green-400 hover:scale-105 transition-all duration-200 shadow-lg hover:text-black shadow-green-800">
              View Certificate
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
