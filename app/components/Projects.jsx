import React from "react";

const projects = [
    {
        "id": 95,
        "title": "Global Cultural Exchange Forum (GCEF INGO)",
        "description": "A comprehensive cultural exchange platform connecting volunteers, members, and partners worldwide. Built with multi-role user management (Admin/Volunteer/Member/Partner), real-time application tracking, and secure OTP-based authentication. Features include comprehensive admin dashboard for managing global initiatives, user dashboard for application status tracking, donation management system, and event coordination capabilities. The platform enables seamless volunteer registrations, membership applications, internship programs, and partnership opportunities.",
        "url": "https://ingo-theta.vercel.app/",
        "techs": ["Next.js 16", "React", "Tailwind CSS", "Supabase", "PostgreSQL", "Server Actions", "OTP Authentication", "Vercel"]
    },
    {
        id: 96,
        title: "Hamro Dental Clinic Website",
        description:
            "A fully functional, modern, and responsive website developed for Hamro Dental Clinic, Nepal. The platform showcases detailed information about dental services, experienced doctors, clinic facilities, and appointment details. Designed with a clean user interface, smooth animations, and optimized performance, the website ensures an easy and intuitive browsing experience. Built with SEO best practices, fast loading speed, and mobile-friendly layouts to enhance online presence and improve patient engagement.",
        url: "https://hamrodental.com.np",
        techs: ["Next-Js", "Tailwind CSS", "Cloudinary for file storage", "Vercel", "Mongo Db", "bcrypt", "jwt"],
    },
    {
        id: 97,
        title: "Own Portfolio-Website",
        description:
            "A fully responsive, modern portfolio website developed using Next.js to showcase my web development projects, skills, and contact information. The site is designed with a clean and minimal UI, ensuring fast performance, SEO optimization, and a smooth user experience.",
        url: "https://shivnarayan-portfolio.vercel.app",
        techs: ["Next-Js", "Mongo DB", "Vercel", "Tailwind Css"],
    },
    {
        id: 98,
        title: "Coffee-Shop",
        description:
            "Coffee Shop Web App is a full-stack web application built using the MERN stack (MongoDB, Express.js, React.js, Node.js) with a modern, responsive UI styled using Tailwind CSS. The platform allows users to browse, and manage coffee products with an intuitive user experience.",
        url: "https://coffee-house-frontend.vercel.app",
        techs: [
            "React",
            "Mongo DB",
            "Express-js",
            "Node-Js",
            "Tailwind Css",
            "Redux and Redux-toolkit",
            "Vercel",
            "Render",
        ],
    },
    {
        id: 99,
        title: "Simple E-commerce App, class-work",
        description:
            "A full-stack eCommerce web application built using the MERN stack (MongoDB, Express.js, React.js, Node.js). The app allows users to register, log in, browse products, add items to their cart, and complete the checkout process. Users can also view their order history and details on their profile.",
        url: "https://react-ecommerce-frontend-delta.vercel.app/",
        techs: [
            "React",
            "Mongo DB",
            "Express-js",
            "Node-Js",
            "Tailwind Css",
            "Redux and Redux-toolkit",
            "Vercel",
            "Render",
        ],
    },
    {
        id: 100,
        title: "Simple TODO-App, Redux",
        description:
            "A lightweight and functional TODO application built using React and Redux, designed to manage tasks efficiently. The app allows users to add, edit, delete, and mark tasks as completed, with a clean and minimal interface for a smooth user experience.",
        url: "https://todoredux-rwkb.vercel.app/",
        techs: ["React", "Redux", "Boostrap Css", "Vercel"],
    },
];

const Projects = () => {
    return (
        <div className="pt-20 px-8 md:px-16 lg:px-32 bg-black min-h-[100vh] text-white flex flex-col justify-start items-center">
            <h1 className="text-5xl text-green-400 font-bold mb-10">My Projects</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-4 w-full">
                {projects.map((project) => (
                    <div
                        key={project.id}
                        className="bg-zinc-900 border border-zinc-700 rounded-lg shadow-md shadow-green-400 p-6 hover:shadow-lg transition-all duration-300 flex flex-col justify-between hover:scale-101"
                    >
                        <h2 className="text-2xl text-green-400 font-semibold mb-2">
                            {project.title}
                        </h2>
                        <p className="text-neutral-400 text-sm mb-4">
                            {project.description}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-4">
                            {project.techs.map((tech, index) => (
                                <span
                                    key={index}
                                    className="bg-zinc-800 text-gray-200 text-xs px-2 py-1 rounded"
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>

                        {project.url && (
                            <a
                                href={project.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block mt-2 text-sm text-green-400 hover:underline"
                            >
                                Visit Project ↗
                            </a>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Projects;
