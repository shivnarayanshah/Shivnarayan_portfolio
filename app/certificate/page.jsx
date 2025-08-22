import Image from "next/image.js";
import Link from "next/link.js";
import React from "react";

const page = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[100vh] pt-16  bg-black text-white px-8 md:px-16  lg:px-32 gap-8 pb-4 ">
      <div className="  w-full h-60 lg:h-auto  md:h-120 mt-2 flex justify-center items-center ">
        <div className="relative  h-[90%] w-[100%] hover:scale-98 duration-200  ">
          <Image
            src={"/images/certificate.png"}
            alt="certificate image"
            fill={true}
            quality={100}
            className="object-fit border-2 border-[#3F8E00] rounded-2xl "
            priority={false}
          ></Image>
        </div>
      </div>
      <div className=" flex  h-full w-[100%] justify-center items-center ">
        <div className="  border-2 border-white rounded-2xl space-y-4 p-4 shadow-md shadow-green-400 hover:scale-102 duration-300 hover:shadow-lg ">
          <section className="flex justify-between">
            <p className="text-2xl text-[#6cc226] font-bold">
              Mindrisers Institute of technology
            </p>
            <p>Jan 2025 - Present</p>
          </section>
          <section className="flex justify-between">
            <span className="text-md">
              {"MERN Stack Training (Certificate No: MR-81075-MS)"}
            </span>
            <Link
              className="text-[#6ce409]"
              href={
                "https://www.mindrisers.com.np/certificate/validate/MR-81076-MS"
              }
            >
              Check Certificate →
            </Link>
          </section>
          <section className="space-y-2 text-sm text-neutral-300">
            <span className="flex flex-row">
              <li></li>
              Successfully completed comprehensive training in MERN stack
              development, with hands-on experience in full-stack web
              applications
            </span>
            <span className="flex flex-row">
              <li></li>
              Designed and deployed a Coffee Shop Web App, a full-stack web
              application built using the MERN stack (MongoDB, Express.js,
              React.js, Node.js) with a modern, responsive UI styled using
              Tailwind CSS. The platform allows users to browse, and manage
              coffee products with an intuitive user experience.
            </span>
            <span className="flex flex-row">
              <li></li>
              Developed a fully functional E-commerce Platform with integrated
              product listings, cart functionality, and secure backend
              operations
            </span>
            <span className="flex flex-row">
              <li></li>
              Gained in-depth expertise in React, Tailwind CSS, Node.js, and
              MongoDB through real-world projects and collaborative debugging
              sessions
            </span>
            <span className="flex flex-row">
              <li></li>
              Enhanced skills in UI/UX by refining layout structure, scroll
              behavior, and component architecture through iterative development
              and user-focused design
            </span>
          </section>
        </div>
      </div>
    </div>
  );
};

export default page;
