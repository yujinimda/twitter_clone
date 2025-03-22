"use client"

import { useRouter } from "next/navigation";
import {FaUserCircle} from 'react-icons/fa';
import { AiFillHeart} from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import { PostProps } from "@/app/page";

interface PostBoxProps {
  post:PostProps
}

export default function Postbox({post}: PostBoxProps) {

  const handleDelete = () => {}

  const router = useRouter();

  return (
    <div
    className='post__box'
    key={post?.id}
    onClick={() => router.push(`/posts/${post.id}`)}
  >
    <div className='post__box-profile'>
      <div className='post__flex'>
        {post?.profileUrl ? (
          <img 
            src={post?.profileUrl}
            alt="profile"
            className='post__box-profile-img'
          />
        ) : (
          <FaUserCircle className="post__box-profile-icon"/>
        )}
        <div className='post__email'>{post?.email}</div>
        <div className='post__createdAt'>{post?.createdAt}</div>
      </div>
      <div className='post__box-content'>{post?.content}</div>
    </div>
    <div className='post__box-footer'>
      {/* post.uid === user.uid 일 때 */}
      <>
      <button
        type="button"
        className='post__delete'
        onClick={handleDelete}
      >
        Delete
      </button>
      <button
        type="button"
        className='post__edit'
        onClick={() => router.push(`/posts/${post.id}/edit`)}
      >
        Edit
      </button>
      <button
        type="button"
        className='post__likes'
      >
      <AiFillHeart/>0 
      </button>
      <button
        type="button"
        className='post__likes'
      >
      <FaRegComment/>0
      </button>
      </>
    </div>
  </div>
  )
}