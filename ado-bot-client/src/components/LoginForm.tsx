// create me a login form

import React, { useState } from "react";

export default function LoginForm() {
  return (
    <div className="bg-[#2F3E46] shadow-md rounded-lg w-full h-fit p-4 sm:p-6 lg:p-8 ">
      <form className="flex flex-col space-y-6 w-full h-full" action="#">
        <h3 className="text-xl font-medium text-[#cad2c5] ">
          Log in
        </h3>
        <div>
          <label
            htmlFor="username"
            className="text-sm font-medium text-[#cad2c5] block mb-2 "
          >
            Your Username
          </label>
          <input
            type="text"
            name="username"
            id="username"
            className="bg-gray-50 border border-gray-300 text-[#2f3e46] sm:text-sm rounded-lg focus:ring-[#2f3e46] focus:border-[#2f3e46] block w-full p-2.5 "
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium text-[#cad2c5] block mb-2">
            Your password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            className="bg-gray-50 border border-gray-300 text-[#2f3e46] sm:text-sm rounded-lg focus:ring-[#2f3e46] focus:border-[#2f3e46] block w-full p-2.5 "
            required
          />
        </div>
        
        <button
          type="submit"
          className="w-full text-[#2f3e46] bg-[#cad2c5] font-medium rounded-lg text-sm px-5 py-2.5 text-center "
        >
          Login to your account
        </button>
        <div className="text-sm font-medium text-gray-500">
          Not registered?{" "}
          <a
            href="#"
            className="text-[#cad2c5] hover:underline"
          >
            Create account
          </a>
        </div>
      </form>
    </div>
  );
}
