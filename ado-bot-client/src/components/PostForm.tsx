import React, { useEffect, useState } from "react";
import { Post } from "../models";
import { Icon } from "@iconify/react";

interface PostFormProps {
  handlePostSubmit: (postTitle: string, postContent: string) => void;
  currentEditedPost: Post | null;
  handleUpdatePost: (
    postData: Post,
    postTitle: string,
    postContent: string
  ) => void;
  handleChangeShowPostForm: () => void;
  handleResetCurrentEditedPost: () => void;
}

interface PostFormInputProps {
  postTitle: string | null;
  postContent: string | null;
}

export default function PostForm({
  handlePostSubmit,
  currentEditedPost,
  handleUpdatePost,
  handleChangeShowPostForm,
  handleResetCurrentEditedPost,
}: PostFormProps) {
  const [input, setInput] = useState<PostFormInputProps | null>({
    postTitle: currentEditedPost?.title ?? null,
    postContent: currentEditedPost?.content ?? null,
  });

  useEffect(() => {
    if (currentEditedPost) {
      setInput({
        postTitle: currentEditedPost.title,
        postContent: currentEditedPost.content,
      });
    } else {
      setInput(null);
    }
  }, [currentEditedPost]);

  const onPostSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (currentEditedPost) {
      handleUpdatePost(
        currentEditedPost,
        input?.postTitle!,
        input?.postContent!
      );
    } else {
      handlePostSubmit(input?.postTitle!, input?.postContent!);
    }
    handleResetCurrentEditedPost();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev!, [name]: value }));
  };
  return (
    <>
      <form
        className="flex flex-col gap-2 w-full h-full items-center mt-12"
        onSubmit={onPostSubmit}
      >
        {currentEditedPost ? (
          <label>Update Post</label>
        ) : (
          <label className="font-gloria text-xl text-[#2f3e46]">New Post</label>
        )}

        <label className="font-gloria text-xl text-[#2f3e46]">Title</label>
        <input
          type="text"
          name="postTitle"
          value={input?.postTitle || ""}
          onChange={handleChange}
          className="input input-bordered w-full max-w-xs rounded-md px-2"
        />

        <label className="font-gloria text-xl text-[#2f3e46]">Content</label>
        <textarea
          name="postContent"
          value={input?.postContent || ""}
          onChange={handleChange}
          className="input input-bordered w-full max-w-xs rounded-md px-2"
        />

        <button
          className="btn btn-outline btn-accent rounded-xl w-40 p-1 mt-4 bg-[#2f3e46] text-[#cad2c5]"
          type="submit"
        >
          {currentEditedPost ? "Update Post" : "Create Post"}
        </button>
      </form>
      <button
        className="bottom-4 left-4 absolute"
        onClick={() => {
          handleResetCurrentEditedPost();
          handleChangeShowPostForm();
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
