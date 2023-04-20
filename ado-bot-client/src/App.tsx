import { Canvas } from "@react-three/fiber";
import Bot from "./components/fiberComponents/Bot";
import React, { useEffect, useRef, useState } from "react";
import { Group } from "three";
import ChannelsList from "./components/ChannelsList";
import { User, Channel } from "./models";
import axios from "axios";
import { Icon } from "@iconify/react";
import PostsList from "./components/PostsList";
import { useNavigate } from "react-router-dom";

export default function App() {
  // const { connection } = useSignalR("/r/chat");
  const botRef = useRef<Group | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const [currentChannel, setCurrentChannel] = useState<Channel | null>(null);
  const navigate = useNavigate();
  const warningRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const username = sessionStorage.getItem("username");

    if(sessionStorage.getItem("loginSuccess") !== "success") {
      navigate("/")
    }

    if (username) {
      setIsLoading(true);
      axios // get user from db
        .get<User>(`api/users/username/${username}`)
        .then((res) => {
          setIsLoading(false);
          setCurrentUser(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [currentChannel]);

  const handleWarningMessage = (message: string | null) => {
    setWarningMessage(message);
    setTimeout(() => {
      if (warningRef.current) {
        warningRef.current.classList.add(
          "animate-out",
          "slide-out-to-top-40",
          "fill-mode-forwards"
        );
        warningRef.current.classList.remove(
          "animate-in",
          "slide-in-from-top-40"
        );
      }
    }, 4000);

    setTimeout(() => {
      setWarningMessage(null);
    }, 5000);
  };

  const handleUpdateUser = (user: User) => {
    setCurrentUser(user);
  }

  const handleUpdateCurrentChannel = (channel: Channel | null) => {
    setCurrentChannel(channel);
  }

  const handleViewChannel = (channel: Channel | null) => {
    currentChannel ? setCurrentChannel(null) : setCurrentChannel(channel);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("loginSuccess");
    navigate("/");
  };

  return (
    <div className="h-screen w-screen relative overflow-hidden">
      <button className="absolute top-0 left-0 z-10 p-4" onClick={handleLogout}>
        <Icon
          className="text-[#cad2c5] w-8 h-8"
          icon="solar:logout-2-outline"
        />
      </button>
      {warningMessage && (
        <div
          ref={warningRef}
          className="animate-in slide-in-from-top-40 fill-mode-backwards duration-500 delay-500 z-10 flex w-screen absolute top-4 justify-center"
        >
          <p className="bg-red-500 w-[50vw] rounded-md text-white text-md text-center py-2">
            {warningMessage}
          </p>
        </div>
      )}
      <div className="absolute bottom-0 w-fit h-fit z-[1]">
        {isLoading ? (
          <div className="flex w-screen justify-center items-center bottom-0 h-[75vh]">
            <Icon
              icon="line-md:loading-twotone-loop"
              color="#cad2c5"
              width="100"
              height="100"
            />
          </div>
        ) : currentChannel ? (
          <PostsList
            channel={currentChannel}
            handleViewChannel={handleViewChannel}
            user={currentUser}
            handleWarningMessage={handleWarningMessage}
            handleUpdateUser={handleUpdateUser}
            handleUpdateCurrentChannel={handleUpdateCurrentChannel}
          />
        ) : (
          <ChannelsList
            user={currentUser}
            handleWarningMessage={handleWarningMessage}
            handleViewChannel={handleViewChannel}
            handleUpdateUser={handleUpdateUser}
          />
        )}
      </div>
      <Canvas className="bg-[#2f3e46]">
      <Bot ref={botRef} positionZ={-3} positionY={4.5} rotationX={0.7}/>

      </Canvas>
      {/* <h1 className=" text-green-300">SignalR Chat</h1>
      <p>{connection ? "Connected" : "Not connected"}</p> */}
    </div>
  );
}
