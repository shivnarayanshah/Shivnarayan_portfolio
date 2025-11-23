
import React from "react";
import HeroSection from "./components/HeroSection.jsx";
import Certificate from "./components/Certificate.jsx";
import Projects from "./components/Projects.jsx";
import About from "./components/About.jsx";
import Contact from "./components/Contact.jsx";

const Home = () => {
  return (
    <>
      <HeroSection />
      <Certificate />
      <Projects />
      <About />
      <Contact />
    </>
  );
};

export default Home;
