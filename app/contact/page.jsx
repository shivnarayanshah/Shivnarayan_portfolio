import React from "react";

const page = () => {
  return (
    <div className="pt-20 pb-4 flex flex-col min-h-screen  justify-start items-center bg-black text-white px-8 md:px-16  lg:px-32 shadow-2xl  gap-8 ">
      <section className="flex flex-col justify-around items-center gap-4 lg:w-[60%] w-full shadow-md  shadow-green-400 rounded-2xl mt-4 ">
        <p className="text-5xl font-bold text-green-400">Let's connect</p>
        <p className="text-2xl text-center text-neutral-300 p-4">
          Got a project in mind, a question to ask, or just want to say hello?
          I'm always happy to connect.
        </p>
      </section>

      <section className="lg:w-[60%] w-full border border-white rounded-2xl shadow-md shadow-green-400 p-4 ">
        <form action="" className="space-y-4">
          <div>
            <label className="" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              name="name"
              placeholder=" john doe"
              className=" border border-white rounded-[5px] p-2 w-full text-white "
            />
          </div>
          <div>
            <label htmlFor="name">Email</label>
            <input
              type="email"
              name="email"
              placeholder="example@example.com"
              className=" border border-white rounded-[5px] p-2 w-full text-white"
            />
          </div>
          <div>
            <label htmlFor="name">Subject</label>
            <input
              type="text"
              name="subject"
              placeholder="Freelance"
              className=" border border-white rounded-[5px] p-2 w-full text-white"
            />
          </div>
          <div>
            <label htmlFor="name">Message</label>
            <textarea
              rows={5}
              type="text"
              name="name"
              placeholder="What's on your mind ?"
              className=" border border-white rounded-[5px] p-2 w-full text-white resize-none"
            />
          </div>
          <button className="p-2 md:p-2 border border-green-400 text-lg md:text-2xl rounded-2xl hover:bg-green-400 hover:scale-105 transition-all duration-200 shadow-lg hover:text-black shadow-green-800">
            Let's Connect
          </button>
        </form>
      </section>
    </div>
  );
};

export default page;
