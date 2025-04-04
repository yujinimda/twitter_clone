"use client"

import {arrayRemove, arrayUnion, doc, onSnapshot} from "firebase/firestore";
import { useState, useCallback, useContext, useEffect,  } from "react";
import {setDoc, updateDoc} from "firebase/firestore";

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
            users: arrayUnion({ id: post?.uid }),
          },
          { merge: true }
        );

        // 팔로우 당하는 사람이 메인
        const followerRef = doc(db, "follower", post?.uid);

        await setDoc(
          followerRef,
          { users: arrayUnion({ id: user?.uid }) },
          { merge: true }
        );

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
          users: arrayRemove({ id: post?.uid }),
        });

        const followerRef = doc(db, "follower", post?.uid);
        await updateDoc(followerRef, {
          users: arrayRemove({ id: user.uid }),
        });
        toast.success("팔로우를 취소했습니다.");
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getFollowers = useCallback(async () => {
    if (post.uid) {
      const ref = doc(db, "follower", post.uid);
      onSnapshot(ref, (doc) => {
        setPostFollowers([]);
        doc
          ?.data()
          ?.users?.map((user: UserProps) =>
            setPostFollowers((prev: UserProps[]) =>
              prev ? [...prev, user?.id] : []
            )
          );
      });
    }
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