"use client";
import React, { useActionState, useEffect } from "react";
import { useRegisterAction } from "../server/actions/authActions.js";
import toast from "react-hot-toast";

const RegisterPage = () => {
  const [state, formAction, isPending] = useActionState(
    useRegisterAction,
    null
  );
  useEffect(() => {
    if (state?.message) {
      if (state.success) {
        toast.success(state.message);
      } else {
        toast.error(state.message);
      }
    }
  }, [state?.message, state?.success]);
  return (
    <div className="flex justify-center items-center min-h-screen bg-black text-neutral-300">
      <section className="lg:w-[50%] w-full border border-green-400 rounded-2xl shadow-md shadow-green-600 p-4 ">
        <p className="text-4xl pb-8">Register Here</p>
        <form action={formAction} className="space-y-4">
          <div>
            <label className="" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="example@example.com"
              required
              className=" border border-white rounded-[5px] p-2 w-full text-white "
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              placeholder="********"
              required
              className=" border border-white rounded-[5px] p-2 w-full text-white"
            />
          </div>

          <button
            className="p-2 md:p-2 border border-green-400 text-lg md:text-2xl rounded-2xl hover:bg-green-400 hover:scale-105 transition-all duration-200 shadow-lg hover:text-black shadow-green-800"
            disabled={isPending}
          >
            {isPending ? "Registering..." : "Register"}
          </button>
        </form>
      </section>
    </div>
  );
};

export default RegisterPage;
