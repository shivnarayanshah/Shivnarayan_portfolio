import React from "react";

const About = () => {
    return (
        <div className="pt-20 pb-4 px-8 md:px-16  lg:px-32 min-h-screen bg-black text-white flex flex-col justify-start items-center gap-10">
            <div className="text-center space-y-4">
                <h1 className="text-5xl font-bold text-green-400">About Me</h1>
                <p className="text-xl text-neutral-300 max-w-3xl">
                    I'm <span className="text-white font-semibold">Shiv Narayan Sah</span>
                    , a passionate full-stack web developer specializing in the MERN stack
                    and modern frontend frameworks like Next.js. I love building web
                    experiences that are not only fast and functional but also visually
                    engaging and user-friendly.
                </p>
            </div>

            <section className="w-full border border-zinc-700 rounded-2xl p-6 shadow-md shadow-green-400">
                <h2 className="text-2xl font-semibold mb-4 text-green-400">
                    Training & Certification
                </h2>
                <div className="space-y-2 text-neutral-300">
                    <p className="flex justify-between text-white font-medium">
                        <span>Mindrisers Institute of Technology</span>
                        <span className="text-sm font-normal">Jan 2025 – Present</span>
                    </p>
                    <p className="text-sm">
                        MERN Stack Training (Certificate No: <strong>MR-81075-MS</strong>) —{" "}
                        <a
                            href="https://www.mindrisers.com.np/certificate/validate/MR-81076-MS"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-400 underline"
                        >
                            View Certificate ↗
                        </a>
                    </p>
                    <div className="flex">
                        <li></li>
                        <span>
                            Completed hands-on training in full-stack web development with
                            real-world projects.
                        </span>
                    </div>
                    <div className="flex">
                        <li></li>
                        <span>
                            Built a Coffee Shop Web App is a full-stack web application built
                            using the MERN stack with a modern, responsive UI styled using
                            Tailwind CSS.
                        </span>
                    </div>
                    <div className="flex">
                        <li></li>
                        <span>
                            Developed a full E-commerce platform with product, cart, and
                            checkout functionality.
                        </span>
                    </div>
                    <div className="flex">
                        <li></li>
                        <span>
                            Worked extensively with React, Tailwind CSS, Node.js, MongoDB, and
                            Express.js.
                        </span>
                    </div>
                    <div className="flex">
                        <li></li>
                        <span>
                            Refined UI/UX skills through layout optimization, responsiveness,
                            and interactive flows.
                        </span>
                    </div>
                </div>
            </section>

            <section className="w-full border border-zinc-700 rounded-2xl p-6 shadow-md shadow-green-400">
                <h2 className="text-2xl font-semibold mb-4 text-green-400">
                    Tech Stack
                </h2>
                <div className="flex flex-wrap gap-3 text-sm text-white">
                    <span className="bg-zinc-800 px-3 py-1 rounded">React.js</span>
                    <span className="bg-zinc-800 px-3 py-1 rounded">Next.js</span>
                    <span className="bg-zinc-800 px-3 py-1 rounded">Node.js</span>
                    <span className="bg-zinc-800 px-3 py-1 rounded">Express.js</span>
                    <span className="bg-zinc-800 px-3 py-1 rounded">MongoDB</span>
                    <span className="bg-zinc-800 px-3 py-1 rounded">Redux Toolkit</span>
                    <span className="bg-zinc-800 px-3 py-1 rounded">Tailwind CSS</span>
                    <span className="bg-zinc-800 px-3 py-1 rounded">Bootstrap</span>
                    <span className="bg-zinc-800 px-3 py-1 rounded">REST APIs</span>
                    <span className="bg-zinc-800 px-3 py-1 rounded">Vercel</span>
                    <span className="bg-zinc-800 px-3 py-1 rounded">Render</span>
                </div>
            </section>

            <section className="w-full text-center max-w-3xl mt-4">
                <p className="text-lg italic text-neutral-400">
                    "I craft web experiences with precision and intent—clean interfaces,
                    intuitive user flows, and purposeful design. Every line of code is
                    deliberate, and every pixel has meaning."
                </p>
            </section>
        </div>
    );
};

export default About;
