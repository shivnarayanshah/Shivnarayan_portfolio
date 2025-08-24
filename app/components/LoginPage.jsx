"use client";
import React, { useActionState, useEffect } from "react";
import { useLoginAction } from "../server/actions/authActions.js";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation.js";

const LoginPage = () => {
  const [state, formAction, isPending] = useActionState(useLoginAction, null);
  const router = useRouter();
  useEffect(() => {
    if (state?.message) {
      if (state.success) {
        toast.success(state.message);
        router.push("/admin");
      }
    }
  }, [state?.success, state?.message]);

  return (
    <section className="lg:w-[50%] w-full border border-green-400 rounded-2xl shadow-md shadow-green-600 p-4 ">
      <p className="text-4xl pb-8">Admin Login </p>
      <form action={formAction} className="space-y-4">
        <div>
          <label className="" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            name="email"
            placeholder="example@example.com"
            className=" border border-white rounded-[5px] p-2 w-full text-white "
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            placeholder="********"
            className=" border border-white rounded-[5px] p-2 w-full text-white"
          />
        </div>

        <button className="p-2 md:p-2 border border-green-400 text-lg md:text-2xl rounded-2xl hover:bg-green-400 hover:scale-105 transition-all duration-200 shadow-lg hover:text-black shadow-green-800">
          Login
        </button>
      </form>
    </section>
  );
};

export default LoginPage;
