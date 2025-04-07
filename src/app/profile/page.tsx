"use client";

import { useContext, useEffect, useState } from "react";
import AuthContext from "@/context/AuthContext";
import {collection, onSnapshot, orderBy, query,  where} from "firebase/firestore";
import { db } from "@/app/firebaseApp";
import { PostProps } from "@/types/post";
import { useRouter } from "next/navigation";
import Postbox from "../../../components/post/PostBox";
import useLanguageStore from "@/stores/useLanguageStore";
import { localeText } from "@/constants/locale"; 

const PROFILE_DEFAULT_URL = "/vercel.svg";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<"foryou"|"likes">("foryou")
  const [posts, setPosts] = useState<PostProps[]>([]);
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const { language, toggleLanguage } = useLanguageStore();
  const t = localeText[language];

  //로그인한 사용자의 게시글을 파이어베이스 파이어스토어에서 실시간으로 가져오는코드
  useEffect(() => {
    if (user) {
      const postsRef = collection(db, "posts");
      let postsQuery;
  
      if (activeTab === "foryou") {
        postsQuery = query(
          postsRef,
          where("uid", "==", user.uid),
          orderBy("createdAt", "desc")
        );
      } else if (activeTab === "likes") {
        postsQuery = query(
          postsRef,
          where("likes", "array-contains", user.uid),
          orderBy("createdAt", "desc")
        );
      }
  
      onSnapshot(postsQuery, (snapShot: any) => {
        const dataObj = snapShot.docs.map((doc: any) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setPosts(dataObj as PostProps[]);
      });
    }
  }, [user, activeTab]);
  
  
  

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
              {t.profileEdit}
            </button>
            <button
              type="button"
              className="profile__btn--language"
              onClick={toggleLanguage}
            >
              {language === "ko" ? "English" : "한국어"}
          </button>
          </div>
        </div>
        <div className="profile__text">
          <div className="profile__name">{user?.displayName || "사용자님"}</div>
          <div className="profile__email">{user?.email}</div>
        </div>
        <div className="home__tabs">
          <div
            className= {`home__tab ${activeTab === "foryou" ? "home__tab--active" : "" }`}
            onClick={() => setActiveTab("foryou")}
            >For You
          </div>
          <div
            className= {`home__tab ${activeTab === "likes" ? "home__tab--active" : "" }`}
            onClick={() => setActiveTab("likes")}
            >Likes
          </div>
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