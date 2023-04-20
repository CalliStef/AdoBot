import { useEffect, useState, useRef, MutableRefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import Bot from "../components/fiberComponents/Bot";
import AuthForm from "../components/AuthForm";
import { User } from "../models";
import axios from "axios";
import { Icon } from "@iconify/react";
import { Group } from "three";
import {useNavigate} from 'react-router-dom'


export default function AuthPage() {
  // const { connection } = useSignalR("/r/chat");
  const navigate = useNavigate()

  const [authType, setAuthType] = useState<"login" | "signup">("signup");
  const [signUpMessage, setSignUpMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const botRef = useRef<Group | null>(null);

  const handleSignUp = async (inputData: {
    username?: string;
    password?: string;
  }) => {
    const areInputsFilled = checkInputExists(
      inputData.username,
      inputData.password
    );

    if (areInputsFilled) {
      const { username, password } = inputData;

      setIsLoading(true);

      await axios
        .post<User>("api/users", {
          username: username,
          password: password,
        })
        .then((res) => {
          console.log(res);
          setSignUpMessage("Account created successfully, please login");

          setAuthType("login");
          setIsLoading(false);

        })
        .catch((err) => {
          console.log(err);
          if (err.response.status === 409) {
            setSignUpMessage("Username already taken");
          } else {
            setSignUpMessage("Something went wrong");
          }
          setIsLoading(false);
        });
    }
  };

  const handleLogin = async (inputData: {
    username?: string;
    password?: string;
  }) => {

    const areInputsFilled = checkInputExists(
      inputData.username,
      inputData.password
    );

    if (areInputsFilled) {
      const { username, password } = inputData;

      setIsLoading(true);

      await axios
        .post<User>("api/users/login", {
          username: username,
          password: password,
        })
        .then((res) => {
          console.log(res);
          sessionStorage.setItem("loginSuccess", "success")
          sessionStorage.setItem("username", res.data.username);     
        })
        .then(() => {
          setIsLoading(false);
          navigate('/home')

        })
        .catch((err) => {
          console.log(err);

          switch (err.response.status) {
            case 401:
              setSignUpMessage("Incorrect username or password");
              break;
            case 404:
              setSignUpMessage("User not found, please sign in");
              break;
            default:
              setSignUpMessage("Something went wrong");
              break;
          }
          setIsLoading(false);
        });
    }
  };

  const checkInputExists = (username?: string, password?: string) => {
    if (
      !username ||
      !username.trim().length ||
      !password ||
      !password.trim().length
    ) {
      setSignUpMessage("Please enter a username and password");
      return false;
    }
    return true;
  };

  const handleChangeAuthType = () => {
    setAuthType(authType === "login" ? "signup" : "login");
  };

  return (
    <div className="h-screen w-screen relative overflow-hidden">
      <div className="absolute w-full h-full top-0 left-0 m-4 z-[1]">
        <div className="absolute flex flex-col right-[10vw] h-fit w-fit left-[15vw] top-[40vw] md:top-[25vw]">
          {signUpMessage && !isLoading && (
            <div className="bg-red-500 rounded-md text-white text-md text-center py-2 mb-4 w-full">
              {signUpMessage}
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center items-center w-full h-full left-0 top-0">
              <Icon
                icon="line-md:loading-twotone-loop"
                color="#cad2c5"
                width="100"
                height="100"
              />
            </div>
          ) : (
            <AuthForm
              authType={authType}
              handleSubmitMethod={
                authType === "signup" ? handleSignUp : handleLogin
              }
              handleChangeAuthType={handleChangeAuthType}
            />
          )}
        </div>
      </div>
      <Canvas className="bg-gradient-to-r from-[#2f3e46] via-[#52796f] to-[#cad2c5]">
        <Bot ref={botRef} positionZ={-3} positionY={4} rotationX={0.7}/>
      </Canvas>
      {/* <h1 className=" text-green-300">SignalR Chat</h1>
      <p>{connection ? "Connected" : "Not connected"}</p> */}
    </div>
  );
}
