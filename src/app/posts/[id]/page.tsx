"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from ".././../../app/firebaseApp";
import { PostProps } from ".././../../app/page";

import {IoIosArrowBack} from "react-icons/io"

import PostBox from "../../../../components/post/PostBox"; 
import Loader from './../../../../components/loader/Loader';
import CommentForm from "../../../../components/commets/CommentForm";
import CommentBox, { CommentProps } from "../../../../components/commets/CommentBox";

export default function PostDetail() {
  const router = useRouter();
  const params = useParams();
  const [post, setPost] = useState<PostProps | null>(null);

  const getPost = useCallback(async () => {
    if (params.id) {
      const docRef = doc(db, "posts", params.id);
      onSnapshot(docRef, (doc) => {
        setPost({ ...(doc.data() as PostProps), id: doc.id });
      });
    }
  }, [params.id]);

  useEffect(() => {
    if (params.id) getPost();
  }, [getPost, params.id]);

  return (
    <div className="post">
      <div className="post__header">
        <button type="button" onClick={() => router.push("/")}>
          <IoIosArrowBack className="post__header-btn"/>
        </button>
      </div>
      {post ? (
        <>
        <PostBox post={post} />
        <CommentForm post={post}/>
        {post?.comments
          ?.slice(0)
          ?.reverse()
          ?.map((data: CommentProps, index: number) => (
            <CommentBox data={data} key={index} post={post}/>
          ))
        }
        </>
        ) : (<Loader />)}
    </div>
  );
}
