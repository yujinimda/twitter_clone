"use client";

import { useContext, useEffect, useState } from "react";
import AuthContext from "@/context/AuthContext";
import {collection, onSnapshot, orderBy, query,  where} from "firebase/firestore";
import { db } from "@/app/firebaseApp";
import { PostProps } from "@/types/post";
import { useRouter } from "next/navigation";
import Postbox from "../../../components/post/PostBox";
import { useRecoilState } from "recoil";
import { languageState } from "@/atom";

const PROFILE_DEFAULT_URL = "/vercel.svg";

export default function ProfilePage() {
  const [posts, setPosts] = useState<PostProps[]>([]);
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const [language, setLanguage] = useRecoilState(languageState);

  useEffect(() => {
    if (user) {
      let postsRef = collection(db, "posts");
      let postsQuery = query(
        postsRef,
        where("uid", "==", user.uid),
        orderBy("createdAt", "desc")
      );

      onSnapshot(postsQuery, (snapShot) => {
        let dataObj = snapShot.docs.map((doc) => ({
          ...doc.data(),
          id: doc?.id,
        }));
        setPosts(dataObj as PostProps[]);
      });
    }
  }, [user]);

  return (
    <div className="home">
      <div className="home__top">
        <div className="home__title">Profile</div>
        <div className="profile">
          <img
            src={user?.photoURL || PROFILE_DEFAULT_URL}
            alt="profile"
            className="profile__image"
            width={100}
            height={100}
          />
          <div className="profile__flex">
            <button
              type="button"
              className="profile__btn"
              onClick={() => router.push("/profile/edit")}
            >
              프로필 수정
            </button>
            <button
                type="button"
                className="profile__btn--language"
                //onClick={onClickLanguage}
              >
                {language === "ko" ? "한국어" : "English"}
            </button>
          </div>
        </div>
        <div className="profile__text">
          <div className="profile__name">{user?.displayName || "사용자님"}</div>
          <div className="profile__email">{user?.email}</div>
        </div>
        <div className="home__tabs">
          <div className="home__tab home__tab--active">For You</div>
          <div className="home__tab">Likes</div>
        </div>
        <div className="post">
          {posts?.length > 0 ? (
            posts?.map((post) => <Postbox post={post} key={post.id} />)
          ) : (
            <div className="post__no-posts">
              <div className="post__text">게시글이 없습니다.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}