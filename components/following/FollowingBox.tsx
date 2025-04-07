"use client";

import {addDoc, arrayRemove, arrayUnion, collection, doc, onSnapshot, setDoc, updateDoc} from "firebase/firestore";
import { useState, useCallback, useContext, useEffect,  } from "react";

import { toast } from "react-toastify";
import { PostProps } from "@/app/page";
import AuthContext from "@/context/AuthContext";
import { db } from "@/app/firebaseApp";

interface FollowingProps {
  post: PostProps;
}

interface UserProps {
  id: string;
}

export default function FollowingBox({ post }: FollowingProps) {
  const { user } = useContext(AuthContext);
  const [postFollowers, setPostFollowers] = useState<any>([]);

  const onClickFollow = async (e: any) => {
    e.preventDefault();

    try {
      if (user?.uid) {
        // 내가 메인
        const followingRef = doc(db, "following", user?.uid);

        await setDoc(
          followingRef,
          {
            users: arrayUnion(post?.uid),
          },
          { merge: true }
        );

        // 팔로우 당하는 사람이 메인
        const followerRef = doc(db, "follower", post?.uid);

        await setDoc(
          followerRef,
          { users: arrayUnion(user?.uid) },
          { merge: true }
        );

        //팔로잉 알림
         await addDoc(collection(db, "notifications"), {
          createdAt: new Date()?.toLocaleDateString("ko", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
          content: `${user?.email || user?.displayName}가 팔로우를 했습니다.`,
          url: "#",
          isRead: false,
          uid: post?.uid, //팔로우를 누른사람
        });

        toast.success("팔로우를 했습니다");
      }
    } catch (e) {
      console.log(e);
    }
  };

  const onClickDeleteFollow = async (e: any) => {
    e.preventDefault();
    try {
      if (user?.uid) {
        const followingRef = doc(db, "following", user?.uid);
        await updateDoc(followingRef, {
          users: arrayRemove(post?.uid),
        });

        const followerRef = doc(db, "follower", post?.uid);
        await updateDoc(followerRef, {
          users: arrayRemove(user.uid),
        });
        toast.success("팔로우를 취소했습니다.");
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getFollowers = useCallback(() => {
    if (!post.uid) return;
    const ref = doc(db, "follower", post.uid);
  
    onSnapshot(ref, (docSnap) => {
      const users = docSnap?.data()?.users || [];
      setPostFollowers(users); // 바로 string[]로 설정
    });
  }, [post.uid]);

  useEffect(() => {
    if (post.uid) getFollowers();
  }, [getFollowers, post.uid]);

  return (
    <>
      {user?.uid !== post?.uid &&
        (postFollowers?.includes(user?.uid) ? (
          <button
            type="button"
            className="post__following-btn"
            onClick={onClickDeleteFollow}
          > Following
          </button>
        ) : (
          <button
            type="button"
            className="post__follow-btn"
            onClick={onClickFollow}
          > Follower
          </button>
        ))}
    </>
  );
}