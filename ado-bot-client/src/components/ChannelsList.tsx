import React, { useState, useEffect } from "react";
import { Channel, User, ToxicData } from "../models";
import ChannelForm from "./ChannelForm";
import axios from "axios";
import { Icon } from "@iconify/react";

interface ChannelListProps {
  user: User | null;
  handleWarningMessage: (message: string | null) => void;
  handleViewChannel: (channel: Channel) => void;
  //     handleChannelChange: (channel: Channel) => void;
  //     handleUserJoin: (channel: Channel, user?: User) => void;
  //     handleUserLeave: (user: User) => void;
  //     currentChannel?: Channel;
  //     handleChannelDelete: (channelId: number) => void;
  //     handleChannelEdit: (channelData: Channel) => void;
}

export default function ChannelsList({
  user,
  handleWarningMessage,
  handleViewChannel,
}: ChannelListProps) {
  const [showChannelForm, setShowChannelForm] = useState<boolean>(false);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [currentEditedChannel, setCurrentEditedChannel] =
    useState<Channel | null>(null);

  useEffect(() => {
    (async () => {
      const res = await axios.get("/api/channels");
      setChannels(res.data);
    })();
  }, []);

  const handleUpdateChannel = async (
    channelData: Channel,
    channelName?: string
  ) => {
    const updatedChannel = {
      ...channelData,
      name: channelName,
    };

    if (!channelName || !channelName.trim().length) {
      return;
    }

    const isToxic = await checkToxicity(channelName);

    if (!isToxic) {
      await axios.put<Channel>(
        `/api/channels/${channelData.id}`,
        updatedChannel
      );
      setChannels((prevChannels) =>
        prevChannels.map((c) => {
          if (c.id === channelData.id) {
            return channelData;
          }
          return c;
        })
      );
    }

    setCurrentEditedChannel(null);

    handleChangeShowChannelForm()
  };

  const checkToxicity = async (channelName: string) => {
    const toxicityData = await axios.get<ToxicData>(
      `/api/predict?comment=${channelName}`
    );

    if (toxicityData.data.isToxic) {
      handleWarningMessage(
        "Channel name is toxic! Please use a different name."
      );
    }

    return toxicityData.data.isToxic;
  };

  const handleChannelSubmit = async (channelName?: string) => {
    if (!channelName || !channelName.trim().length) {
      return;
    }

    const isToxic = await checkToxicity(channelName);

    if (!isToxic) {
      const newChannel = await axios.post("/api/channels", {
        creatorId: user?.id,
        name: channelName,
      });

      setChannels([...channels, newChannel.data]);
    }

    handleChangeShowChannelForm()

  };

  const handleResetCurrentEditedChannel = () => {
    setCurrentEditedChannel(null)
  }

  const handleChangeShowChannelForm = () => {
    setShowChannelForm(!showChannelForm);
  };

  const handleDeleteChannel = async (channelId: number) => {
    await axios.delete(`/api/channels/${channelId}`);
    setChannels(channels.filter((channel) => channel.id !== channelId));
  };

  const handleEditChannel = async (channel: Channel) => {
    setCurrentEditedChannel(channel);
    handleChangeShowChannelForm();
  };

  return (
    <div className="animate-in slide-in-from-bottom fill-mode-backwards items-center duration-1000 bg-[#cad2c5] flex w-screen flex-col rounded-tr-2xl rounded-tl-2xl h-[75vh] bottom-0">
      {showChannelForm ? (
        <ChannelForm
          currentEditedChannel={currentEditedChannel}
          handleUpdateChannel={handleUpdateChannel}
          handleChannelSubmit={handleChannelSubmit}
          handleChangeShowChannelForm={handleChangeShowChannelForm}
          handleResetCurrentEditedChannel={handleResetCurrentEditedChannel}
        />
      ) : (
        <div className="flex flex-col items-center">
          <h1 className="font-gloria font-black text-[#2f3e46] text-xl  text-center mt-8">
            Welcome, {user?.username}!
          </h1>
          <h2 className="font-manrope font-bold text-[#2f3e46] text-md mt-2 text-center">
            Join a community and start posting!
          </h2>

          <button
            className="btn btn-outline btn-accent rounded-xl w-40 p-1 mt-8 bg-[#2f3e46] text-[#cad2c5] font-manrope font-bold"
            onClick={handleChangeShowChannelForm}
          >
            New Community
          </button>

          <div className="flex flex-col space-y-4 mt-8 items-center">
            <h2 className="font-gloria font-bold">Your Communities</h2>
            <div className="flex overflow-x-scroll">
              {channels.map(
                (channel, index) =>
                  channel.creatorId === user?.id && (
                    <div
                      key={index}
                      className="relative flex flex-col items-center justify-center w-[10rem] h-[8rem] rounded-lg bg-[#2f3e46]"
                      onClick={() => {
                        handleViewChannel(channel)
                      }}
                    >
                      <h1 className="text-[#cad2c5] font-manrope font-black">{channel.name}</h1>
                      <p className="text-[#cad2c5] font-manrope font-black">
                        #users: {channel.users.length}
                      </p>
                      <button
                        className="absolute bottom-0 right-0 z-10 bg-[#2f3e46] text-[#cad2c5] rounded-full p-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteChannel(channel.id);
                        }}
                      >
                        <Icon icon="ant-design:delete-outlined" />
                      </button>
                      <button
                        className="absolute bottom-0 left-0 z-10 bg-[#2f3e46] text-[#cad2c5] rounded-full p-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditChannel(channel);
                        }}
                      >
                        <Icon icon="ant-design:edit-outlined" />
                      </button>
                    </div>
                  )
              )}
            </div>
            <h2 className="font-gloria font-bold">Global Communities</h2>
            <div className="flex overflow-y-scroll">
              {channels.map(
                (channel, index) =>
                  channel.creatorId !== user?.id && (
                    <div
                      key={index}
                      className="relative flex flex-col items-center justify-center w-[10rem] h-[8rem] rounded-lg bg-[#2f3e46]"
                    >
                      <h1 className="text-[#cad2c5] font-manrope font-black">{channel.name}</h1>
                      <p className="text-[#cad2c5] font-manrope font-black">
                        #users: {channel.users.length}
                      </p>
                     
                    </div>
                  )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
