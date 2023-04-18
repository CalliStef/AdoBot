import { useEffect, useState, useRef } from "react";
import useSignalR from "./useSignalR";
import { Canvas } from "@react-three/fiber";
import Bot from "./components/fiberComponents/Bot";
import LoginForm from "./components/LoginForm";

export default function App() {
  // const { connection } = useSignalR("/r/chat");

  return (
    <div className="App h-screen w-screen relative overflow-hidden">
      <div className="absolute w-full h-full top-0 left-0 m-4 z-[1]">
        <div className="absolute right-[10vw] h-[50vw] w-[35vw] top-[15vw]">
          <h1 className="font-gloria text-[#2f3e46] text-2xl mb-4">AdoBot is here!</h1>
          <LoginForm/>
        </div>
      </div>
      <Canvas className="bg-gradient-to-r from-[#2f3e46] via-[#52796f] to-[#cad2c5]">
        <Bot />
      </Canvas>
      {/* <h1 className=" text-green-300">SignalR Chat</h1>
      <p>{connection ? "Connected" : "Not connected"}</p> */}
    </div>
  );
}
