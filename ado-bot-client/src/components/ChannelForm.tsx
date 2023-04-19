import React, { useState, useEffect } from "react";
import { Channel } from "../models";
import { Icon } from "@iconify/react";

interface ChannelFormProps {
  handleChannelSubmit: (channelName?: string) => void;
  currentEditedChannel?: Channel | null;
  handleUpdateChannel: (channelData: Channel, channelName?: string) => void;
  handleChangeShowChannelForm: () => void;
  handleResetCurrentEditedChannel: () => void;
}

export default function ChannelForm({
  handleChannelSubmit,
  currentEditedChannel,
  handleUpdateChannel,
  handleChangeShowChannelForm,
  handleResetCurrentEditedChannel,
}: ChannelFormProps) {
  const [input, setInput] = useState<string | null>(
    currentEditedChannel?.name || null
  );

  useEffect(() => {
    if (currentEditedChannel?.name) {
      setInput(currentEditedChannel?.name);
    } else {
      setInput(null);
    }
  }, [currentEditedChannel]);

  const onChannelSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (currentEditedChannel) {
      handleUpdateChannel(currentEditedChannel, input!);
    } else {
      handleChannelSubmit(input!);
    }
    handleResetCurrentEditedChannel();
  };

  return (
    <>
      <form
        className="flex flex-col gap-2 w-full h-full items-center mt-12"
        onSubmit={onChannelSubmit}
      >
        {currentEditedChannel ? (
          <label>Update Channel Name:</label>
        ) : (
          <label className="font-gloria text-xl text-[#2f3e46]">
            New Channel Name:
          </label>
        )}

        <input
          type="text"
          value={input || ""}
          onChange={(e) => setInput(e.target.value)}
          className="input input-bordered w-full max-w-xs rounded-md px-2"
        />
        <button
          className="btn btn-outline btn-accent rounded-xl w-40 p-1 mt-4 bg-[#2f3e46] text-[#cad2c5]"
          type="submit"
        >
          {currentEditedChannel ? "Update Community" : "Create Community"}
        </button>
      </form>
      <button
        className="bottom-4 left-4 absolute"
        onClick={() => {
          handleResetCurrentEditedChannel();
          handleChangeShowChannelForm();
        }}
      >
        <Icon
          icon="ic:round-keyboard-arrow-left"
          className="w-12 h-12 text-[#2f3e46]"
        />
      </button>
    </>
  );
}
