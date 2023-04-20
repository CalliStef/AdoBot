export interface Post {
    id: number;
    title: string;
    content: string;
    likes: number;
    dislikes: number;
    userId: number;
    created: Date;
    channelId: number;
  };
  
export interface Channel{
  id: number;
  name: string;
  created: Date;
  posts: Post[];
  totalUsers: number;
  creatorId: number;
  users: User[];
};

export interface User{
  id: number;
  username: string;
  password: string;
  photo?: string;
  created: Date;
  updated: Date;
  channelsCreated: Channel[];
  channels: Channel[];
}

export interface ToxicData {
  isToxic: boolean;
  scores : [
    {
      key: string;
      value: number;
    }
  ]
}