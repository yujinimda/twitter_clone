"use client"

import {useState, useEffect} from "react";
import { useRouter } from "next/navigation";
import {getAuth, onAuthStateChanged} from "firebase/auth"
import {app} from "./firebaseApp"

import Postbox from "../../components/post/PostBox";
import PostForm from "../../components/post/PostForm";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 

export interface PostProps {
  id: string;
  email: string;
  content: string;
  createdAt: string;
  uid: string;
  profileUrl?: string;
  likes?: string[];
  likeCount?: number;
  comments?: any;
}

const posts: PostProps[] = [
  {
    id:"1",
    email:"zini@email.com",
    content:"내용입니다",
    createdAt:"2025-03-15",
    uid:"123123"
  },
  {
    id:"2",
    email:"zini@email.com",
    content:"내용입니다",
    createdAt:"2025-03-15",
    uid:"123123"
  },
  {
    id:"3",
    email:"zini@email.com",
    content:"내용입니다",
    createdAt:"2025-03-15",
    uid:"123123"
  },
  {
    id:"4",
    email:"zini@email.com",
    content:"내용입니다",
    createdAt:"2025-03-15",
    uid:"123123"
  },
  {
    id:"5",
    email:"zini@email.com",
    content:"내용입니다",
    createdAt:"2025-03-15",
    uid:"123123"
  },
  {
    id:"6",
    email:"zini@email.com",
    content:"내용입니다",
    createdAt:"2025-03-15",
    uid:"123123"
  },
]


export default function Home() {

  const auth = getAuth(app); // 로그인 정보 객체 가져오고
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    !!auth?.currentUser
  ) // 너 로그인 했어? 안했어? 확인하고

  console.log(auth, isAuthenticated)

  //만약 로그인을 안했으면 로그인 화면을 보여줘야 한다
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace("/users/login"); // 로그인하지 않은 경우, 로그인 페이지로 이동
      } else {
        setIsAuthenticated(true);
      }
    });

    return () => unsubscribe(); // 컴포넌트 언마운트 시 Firebase 리스너 정리
  }, [auth, router]);

  if (!isAuthenticated) return null;

  return (
    <>
    <ToastContainer/>
    <div className='home'>
      <div className='home__title'>Home</div>
      <div className="home__tabs">
        <div className='home__tab home__tab--active'>For You</div>
        <div className='home__tab'>Following</div>
      </div>
      <PostForm/>
      {/* Tweet posts */}
      <div className='post'>
        {posts?.map((post) => (
          <Postbox key={post.id} post={post}/>
        ))}
      </div>
    </div>
    </>
  );
}