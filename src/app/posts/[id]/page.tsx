"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from ".././../../app/firebaseApp";
import { PostProps } from ".././../../app/page";

import {IoIosArrowBack} from "react-icons/io"

import PostBox from "../../../../components/post/PostBox"; 
import Loader from './../../../../components/loader/Loader';

export default function PostDetail() {
  const router = useRouter();
  const params = useParams();
  const [post, setPost] = useState<PostProps | null>(null);

  const getPost = useCallback(async () => {
    if (params.id) {
      const docRef = doc(db, "posts", params.id as string);
      const docSnap = await getDoc(docRef);
      setPost({ ...(docSnap.data() as PostProps), id: docSnap.id });
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
      {post ? <PostBox post={post} /> : <Loader />}
    </div>
  );
}
