// src/types/post.ts
export interface PostProps {
  id: string;
  email: string;
  content: string;
  createdAt: string;
  uid: string;
  profileUrl?: string;
  likes?: string[];
  likeCount?: number;
  comments?: unknown[];
  hashTags?: string[];
  imageUrl?: string[];
}
