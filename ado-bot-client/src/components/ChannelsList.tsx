import React, { useState, useEffect } from "react";
import { Channel, User, ToxicData } from "../models";
import ChannelForm from "./ChannelForm";
import axios from "axios";
import { Icon } from "@iconify/react";

interface ChannelListProps {
  connection: signalR.HubConnection | undefined;
  user: User | null;
  handleWarningMessage: (message: string | null) => void;
  handleViewChannel: (channel: Channel) => void;
  handleUpdateUser: (user: User) => void;
}

export default function ChannelsList({
  connection,
  user,
  handleWarningMessage,
  handleViewChannel,
  handleUpdateUser,
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

  useEffect(() => {

    if(connection){
      console.log("connection created")
      connection.on("ChannelUpdated", (channel: Channel) => {
        setChannels((prevChannels) =>
          prevChannels.map((c) => {
            if (c.id === channel.id) {
              return channel;
            }
            return c;
          })
        );

        if (user?.id === channel.creatorId) {
          handleUpdateUser({
            ...user,
            channels: user.channels.map((c) => {
              if (c.id === channel.id) {
                return channel;
              }
              return c;
            }),
          });
        }
      })

      connection.on("ChannelCreated", (channel: Channel) => {
        setChannels((prevChannels) => [...prevChannels, channel]);
      })

      connection.on("ChannelDeleted", (channelId: number) => {
        setChannels((prevChannels) =>
          prevChannels.filter((c) => c.id !== channelId)
        );
      })

    }

    return () => {
      if(connection){
        connection.off("ChannelUpdated")
        connection.off("ChannelCreated")
        connection.off("ChannelDeleted")
      }
    }

  }, [])

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
       axios.put<Channel>(
        `/api/channels/${channelData.id}`,
        updatedChannel
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
      axios.post("/api/channels", {
        creatorId: user?.id,
        name: channelName,
      });
      
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
    axios.delete(`/api/channels/${channelId}`);
    // setChannels(channels.filter((channel) => channel.id !== channelId));
  };

  const handleEditChannel = async (channel: Channel) => {
    setCurrentEditedChannel(channel);
    handleChangeShowChannelForm();
  };

  const checkIfUserIsInChannel = (channel: Channel) => {
    return channel.users?.some((u) => u.id === user?.id);
  }

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
        <div className="flex flex-col items-center w-full overflow-y-auto">
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

          <div className="flex flex-col space-y-4 mt-8 items-center pb-4">
            <h2 className="font-gloria font-bold">Your Communities</h2>
            <div className="flex overflow-x-scroll gap-4 w-[80vw]">
              {channels.map(
                (channel, index) =>
                  channel.creatorId === user?.id && (
                    <div
                      key={index}
                      className="relative flex flex-col flex-shrink-0 items-center justify-center w-[10rem] h-[8rem] rounded-lg bg-[#2f3e46]"
                      onClick={() => {
                        handleViewChannel(channel)
                      }}
                    >
                      <h1 className="text-[#cad2c5] font-manrope font-black">{channel.name}</h1>
                      <p className="text-[#cad2c5] font-manrope font-black">
                        #users: {channel.users?.length ?? 0}
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

            <h2 className="font-gloria font-bold">Your Joined Communities</h2>
            <div className="flex overflow-x-scroll gap-4 w-[80vw]">
              {channels.map(
                (channel, index) =>
                  channel.creatorId !== user?.id && checkIfUserIsInChannel(channel)  && (
                    <div
                      key={index}
                      className="relative flex flex-col flex-shrink-0 items-center justify-center w-[10rem] h-[8rem] rounded-lg bg-[#2f3e46]"
                      onClick={() => {
                        handleViewChannel(channel)
                      }}
                    >
                      <h1 className="text-[#cad2c5] font-manrope font-black">{channel.name}</h1>
                      <p className="text-[#cad2c5] font-manrope font-black">
                        #users: {channel.users.length ?? 0}
                      </p>
                    </div>
                  )
              )}
            </div>


            <h2 className="font-gloria font-bold">Global Communities</h2>
            <div className="flex overflow-x-scroll gap-4 w-[80vw]">
              {channels.map(
                (channel, index) =>
                  channel.creatorId !== user?.id && checkIfUserIsInChannel(channel) === false && (
                    <div
                      key={index}
                      className="relative flex flex-col flex-shrink-0 items-center justify-center w-[10rem] h-[8rem] rounded-lg bg-[#2f3e46]"
                      onClick={() => {
                        handleViewChannel(channel)
                      }}
                    >
                      <h1 className="text-[#cad2c5] font-manrope font-black">{channel.name}</h1>
                      <p className="text-[#cad2c5] font-manrope font-black">
                        #users: {channel.users.length ?? 0}
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
