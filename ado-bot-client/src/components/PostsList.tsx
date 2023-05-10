import React, { useEffect, useState } from "react";
import { Post, Channel, User, ToxicData } from "../models";
import { Icon } from "@iconify/react";
import axios from "axios";
import PostForm from "./PostForm";
interface PostsListProps {
  connection: signalR.HubConnection | undefined;
  channel: Channel;
  handleViewChannel: (post: Channel | null) => void;
  user: User | null;
  handleWarningMessage: (message: string | null) => void;
  handleUpdateUser: (user: User) => void;
  handleUpdateCurrentChannel: (channel: Channel) => void;
}

export default function PostsList({
  connection,
  channel,
  handleViewChannel,
  user,
  handleWarningMessage,
  handleUpdateUser,
  handleUpdateCurrentChannel,
}: PostsListProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [showPostForm, setShowPostForm] = useState<boolean>(false);
  const [isUserJoined, setIsUserJoined] = useState<boolean>(false);
  const [currentEditedPost, setCurrentEditedPost] = useState<Post | null>(null);

  useEffect(() => {
    if (connection) {
      connection.on("UserJoined", (user: User) => {
        handleWarningMessage(`${user.username} joined the channel!`);
      });

      connection.on("UserLeft", (user: User) => {
        handleWarningMessage(`${user.username} left the channel!`);
      });

      connection.on("PostAdded", (post: Post) => {
        console.log("new post created")
        setPosts((prevPosts) => [...prevPosts, post]);
      })

      connection.on("PostUpdated", (post: Post) => {
        setPosts((prevPosts) =>
          prevPosts.map((p) => {
            if (p.id === post.id) {
              return post;
            }
            return p;
          })
        );
      });

      connection.on("PostDeleted", (postId: number) => {
        console.log("post deleted," + postId)
        setPosts((prevPosts) =>
          prevPosts.filter((p) => p.id !== postId)
        );

      })
    }

    return () => {
      if (connection) {
        connection.off("UserJoined");
        connection.off("UserLeft");
        connection.off("PostAdded");
        connection.off("PostUpdated");
        connection.off("PostDeleted")
      }
    };
  }, []);

  useEffect(() => {
    (async () => {
      const res = await axios.get(`/api/posts/channel/${channel.id}`);
      setPosts(res.data);
    })();
  }, []);

  useEffect(() => {
    user?.channels.map((c) => {
      if (c.id === channel.id) {
        setIsUserJoined(true); // if user is in the post set the state to true
      }
    });
  }, [isUserJoined]);

  const handleUpdatePost = async (
    postData: Post,
    postTitle: string,
    postContent: string
  ) => {
    const updatedPost = {
      ...postData,
      title: postTitle,
      content: postContent,
    };

    const isToxic = await checkToxicity(postTitle, postContent);

    if (!isToxic) {
      axios.put<Post>(
        `/api/posts/${postData?.id}`,
        updatedPost
      );

    }

    setCurrentEditedPost(null);

    handleChangeShowPostForm();
  };

  const checkToxicity = async (postTitle: string, postContent: string) => {
    if (
      !postTitle ||
      !postTitle.trim().length ||
      !postContent ||
      !postContent.trim().length
    ) {
      return true;
    }

    const TitleToxicityData = await axios.get<ToxicData>(
      `/api/predict?comment=${postTitle}`
    );

    const ContentToxicityData = await axios.get<ToxicData>(
      `/api/predict?comment=${postContent}`
    );

    if (TitleToxicityData.data.isToxic || ContentToxicityData.data.isToxic) {
      // if toxicity is detected
      handleWarningMessage(
        "Your post is toxic. Please be respectful to others."
      );
      return true;
    }

    return false;
  };

  const handlePostSubmit = async (postTitle: string, postContent: string) => {
    const isToxic = await checkToxicity(postTitle, postContent);

    if (!isToxic) {
      axios.post(`/api/Channels/${channel.id}/Posts`, {
        userId: user?.id,
        title: postTitle,
        content: postContent,
      });

    }

    handleChangeShowPostForm();
  };

  const handleResetCurrentEditedPost = () => {
    setCurrentEditedPost(null);
  };

  const handleChangeShowPostForm = () => {
    setShowPostForm(!showPostForm);
  };

  const handleDeletePost = async (postId: number) => {
    await axios.delete(`/api/posts/${postId}`);
  };

  const handleEditPost = async (post: Post) => {
    setCurrentEditedPost(post);
    handleChangeShowPostForm();
  };

  const handleJoinChannel = async () => {
    try {
      connection?.invoke("AddToGroup", channel.id);

      const userJoined = await axios.post("/api/users/join", {
        userId: user?.id,
        channelId: channel.id,
      });

      handleUpdateUser(userJoined.data);
      setIsUserJoined(true);
    } catch {
      handleWarningMessage("Something went wrong with joining the channel.");
    }
  };

  const handleLeaveChannel = async () => {
    try {
      connection?.invoke("RemoveFromGroup", channel.id);

      const userLeft = await axios.post("/api/users/leave", {
        userId: user?.id,
        channelId: channel.id,
      });

      handleUpdateUser(userLeft.data);

      setIsUserJoined(false);
    } catch {
      handleWarningMessage("Something went wrong with leaving the channel.");
    }
  };

  return (
    <div className="animate-in slide-in-from-bottom fill-mode-backwards items-center duration-1000 bg-[#cad2c5] flex w-screen flex-col rounded-tr-2xl rounded-tl-2xl h-[75vh] bottom-0">
      {/* {
            channel.creatorId === user?.id && (
                <div>
                <button className="btn btn-outline btn-accent rounded-xl w-40 p-1 mt-8 bg-[#2f3e46] text-[#cad2c5] font-manrope font-bold">
                    Delete Channel
                </button>
                <button className="btn btn-outline btn-accent rounded-xl w-40 p-1 mt-8 bg-[#2f3e46] text-[#cad2c5] font-manrope font-bold">
                    Edit Channel
                </button>
                </div>
            )
        } */}
      {showPostForm ? (
        <PostForm
          handleChangeShowPostForm={handleChangeShowPostForm}
          handleUpdatePost={handleUpdatePost}
          handlePostSubmit={handlePostSubmit}
          currentEditedPost={currentEditedPost}
          handleResetCurrentEditedPost={handleResetCurrentEditedPost}
        />
      ) : (
        <>
          <div className="flex flex-col items-center">
            <h1 className="font-gloria font-black text-[#2f3e46] text-xl  text-center mt-8">
              Welcome to the{" "}
              <span className="text-[#6d5f4c]">{channel.name}</span> community!
            </h1>

            <div className="flex justify-center items-center">
              {!isUserJoined ? (
                <button
                  className="btn btn-outline btn-accent rounded-xl w-40 p-1 mt-8 bg-[#2f3e46] text-[#cad2c5] font-manrope font-bold"
                  onClick={handleJoinChannel}
                >
                  Join
                </button>
              ) : (
                <button
                  className="btn btn-outline btn-accent rounded-xl w-40 p-1 mt-8 bg-[#2f3e46] text-[#cad2c5] font-manrope font-bold"
                  onClick={handleLeaveChannel}
                >
                  Leave
                </button>
              )}
            </div>

            <div className="flex justify-between items-center w-full h-fit mt-8 px-4">
              <h2 className="font-gloria font-black text-[#2f3e46] text-xl  text-center">
                Posts
              </h2>
              {isUserJoined && (
                <button
                  className="btn btn-outline btn-accent rounded-xl w-fit p-1 text-[#2f3e46] font-manrope font-bold"
                  onClick={handleChangeShowPostForm}
                >
                  <Icon
                    className="w-8 h-8"
                    icon="mdi:post-it-note-add-outline"
                  />
                </button>
              )}
            </div>

            <div className="flex flex-col gap-4 w-full h-[19rem] items-center overflow-y-scroll my-4">
              {posts.map((post, index) => (
                <div
                  key={index}
                  className="bg-[#2f3e46] flex flex-col w-[80vw] p-4 rounded-md flex-shrink-0"
                >
                  <h2 className="font-manrope text-[#cad2c5]">
                    Title: {post.title}
                  </h2>
                  <hr className="my-2 text-[#cad2c5]" />
                  <p className=" font-sans text-[#cad2c5]">{post.content}</p>
                  {post.userId === user?.id && (
                    <div className="flex justify-end items-center w-full h-fit px-4">
                      <button
                        className=" bg-[#2f3e46] text-[#cad2c5] pl-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeletePost(post.id);
                        }}
                      >
                        <Icon icon="ant-design:delete-outlined" />
                      </button>
                      <button
                        className=" bg-[#2f3e46] text-[#cad2c5] pl-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditPost(post);
                        }}
                      >
                        <Icon icon="ant-design:edit-outlined" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <button
            className="bottom-4 left-4 absolute"
            onClick={() => {
              handleViewChannel(null);
            }}
          >
            <Icon
              icon="ic:round-keyboard-arrow-left"
              className="w-12 h-12 text-[#2f3e46]"
            />
          </button>{" "}
        </>
      )}
    </div>
  );
}
