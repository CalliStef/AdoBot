// create me a login form
import React, { useState } from "react";

interface AuthFormProps {
  authType: "login" | "signup";
  handleSubmitMethod: (inputData: { username?: string; password?: string }) => void;
  handleChangeAuthType: () => void;
}

interface UserFormInputProps {
  username?: string;
  password?: string;
}

export default function AuthForm({
  authType,
  handleSubmitMethod,
  handleChangeAuthType,
}: AuthFormProps) {
  const [inputData, setInputData] = useState<UserFormInputProps>({
    username: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputData({
      ...inputData,
      [e.target.name]: e.target.value,
    });
  };

  const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setInputData({
      username: "",
      password: "",
    });

    handleSubmitMethod(inputData);
  };

  return (
    <div className="bg-[#2F3E46] shadow-md rounded-lg w-[65vw] h-fit p-4 sm:p-6 lg:p-8">
      <form
        className="flex flex-col space-y-6 w-full h-full"
        onSubmit={onFormSubmit}
      >
        <h3 className="text-xl font-medium text-[#cad2c5] ">
          {authType === "login" ? "Login" : "Sign Up"}
        </h3>
        <div>
          <label
            htmlFor="username"
            className="text-sm font-medium text-[#cad2c5] block mb-2 "
          >
            Username
          </label>
          <input
            type="text"
            name="username"
            id="username"
            className="bg-gray-50 border border-gray-300 text-[#2f3e46] sm:text-sm rounded-lg focus:ring-[#2f3e46] focus:border-[#2f3e46] block w-full p-2.5 "
            onChange={handleChange}
            
          />
        </div>
        <div>
          <label className="text-sm font-medium text-[#cad2c5] block mb-2">
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            className="bg-gray-50 border border-gray-300 text-[#2f3e46] sm:text-sm rounded-lg focus:ring-[#2f3e46] focus:border-[#2f3e46] block w-full p-2.5 "
            onChange={handleChange}
            
          />
        </div>

        <button
          type="submit"
          className="w-full text-[#2f3e46] bg-[#cad2c5] font-medium rounded-lg text-sm px-5 py-2.5 text-center "
        >
          {authType === "login" ? "Login" : "Sign Up"}
        </button>
        <div className="text-sm font-medium text-gray-500">
          <p>{authType === "login"
            ? "Don't have an account?"
            : "Already have an account?"}</p>
          <a
            href="#"
            className="text-[#cad2c5] hover:underline"
            onClick={handleChangeAuthType}
          >
            {authType === "login" ? "Sign Up" : "Login"}
          </a>
        </div>
      </form>
    </div>
  );
}
