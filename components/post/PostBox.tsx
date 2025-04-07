"use client"

import { useRouter } from "next/navigation";
import {FaUserCircle} from 'react-icons/fa';
import { AiFillHeart, AiOutlineHeart} from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import { PostProps } from "@/app/page";
import { doc, deleteDoc, updateDoc, arrayRemove, arrayUnion, increment } from "firebase/firestore";
import {toast} from "react-toastify";
import { db, storage } from "@/app/firebaseApp";
import { ref, deleteObject } from "firebase/storage";
import AuthContext from "@/context/AuthContext";
import { useContext } from "react";
import FollowingBox from "../following/FollowingBox";


interface PostBoxProps {
  post:PostProps
}

export default function Postbox({post}: PostBoxProps) {
  const { user } = useContext(AuthContext);
  const imageRef = ref(storage, post?.imageUrl);

  const toggleLike = async () => {
    const postRef = doc(db, "posts", post.id);
  
    //Firestore에서 안전하게 숫자를 증가시키려면 increment(1)을 사용
    //이 방법은 서버에서 직접 값을 계산하기 때문에 동시성 문제 없이 정확히 +1 또는 -1만 적용
    if (user?.uid && post?.likes?.includes(user?.uid)) {
      await updateDoc(postRef, {
        likes: arrayRemove(user.uid),
        likeCount: increment(-1),
      });
    } else {
      await updateDoc(postRef, {
        likes: arrayUnion(user?.uid),
        likeCount: increment(1),
      });
    }
  };

  const handleDelete = async() => {
    const confirm = window.confirm("해당 게시글을 삭제하시겠습니까?");

    if(confirm) {
      // 스토리지 이미지 먼저 삭제
      if (post?.imageUrl) {
        deleteObject(imageRef).catch((error) => {
          console.log(error);
        });
      }

      await deleteDoc(doc(db, "posts", post.id));
      toast.success("게시글을 삭제했습니다.");
    }
  }

  const router = useRouter();

  return (
    <div
    className='post__box'
    key={post?.id}
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
        <div className="post__flex--between">
          <div className="post__flex">
            <div className='post__email'>{post?.email}</div>
            <div className='post__createdAt'>{post?.createdAt}</div>
          </div>
        </div>
        <FollowingBox post={post}/>
        {/* <button className="post__following-btn">Following</button> */}
      </div>
      <div className='post__box-content' onClick={() => router.push(`/posts/${post.id}`)}>{post?.content}</div>
        {post?.imageUrl && (
          <div className="post__image-div" onClick={() => router.push(`/posts/${post.id}`)}>
            <img
              src={post?.imageUrl}
              alt="post img"
              className="post__image"
              width={100}
              height={100}
            />
          </div>
        )}
      <div className="post-form__hashtags-outputs">
        {post?.hashTags?.map((tag, index) => (
          <span className="post-form__hashtags-tag" key={index}>
            #{tag}
          </span>
        ))}
      </div>
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
        onClick={(e) => {
          e.stopPropagation(); //상위 div로 전파 방지
          router.push(`/posts/${post.id}/edit`)
        }}
         
      >
        Edit
      </button>

      <button
        type="button"
        className='post__likes'
        onClick={(e)=>{
          e.stopPropagation();
          toggleLike();
        }}
      >
        {user && post?.likes?.includes(user.uid) ? (
          <AiFillHeart/>
        ) : (
          <AiOutlineHeart/>
        )}
        {post?.likeCount || 0}
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