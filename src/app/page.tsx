"use client"

import {useState, useEffect, useContext} from "react";
import { useRouter } from "next/navigation";
import {getAuth, onAuthStateChanged} from "firebase/auth"
import {app} from "./firebaseApp"
import {collection, query, onSnapshot, where, orderBy} from "firebase/firestore";
import  AuthContext  from '../../src/context/AuthContext';
import { db } from "../../src/app/firebaseApp";

import Postbox from "../../components/post/PostBox";
import PostForm from "../../components/post/PostForm";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 
import Loader from "../../components/loader/Loader"
// import { DiVim } from "react-icons/di";

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



export default function Home() {

  const [posts, setPosts] = useState<PostProps[]>([]);
  const { user } = useContext(AuthContext);

  const auth = getAuth(app); // 로그인 정보 객체 가져오고
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    !!auth?.currentUser
  ) // 너 로그인 했어? 안했어? 확인하고
  const [init, setInit] = useState(false); //파이어베이스가 로그인 정보를 전부 다 불러오게 한뒤 컴포넌트를 렌더링시키자


  console.log(auth, isAuthenticated)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        toast.success("로그인 완료! ><");
      } else {
        setIsAuthenticated(false);
        router.replace("/users/login");
      }
      setInit(true);
    });
    return () => unsubscribe();
  }, [auth, router]);

 
  useEffect(() => {
    if (user) {
      let postsRef = collection(db, "posts");
      let postsQuery = query(postsRef, orderBy("createdAt", "desc"));
  
      onSnapshot(postsQuery, (snapshot) => {
        let dataObj = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setPosts(dataObj as PostProps[]);
      });
    }
  }, [user]);

  if (!init) return <Loader />;
  if (!isAuthenticated) return null;

  return (
    <>
    <ToastContainer
      theme="dark"
      autoClose={1000}
      hideProgressBar 
      newestOnTop 
    />
    <div className='home'>
      <div className="home__top">
      <div className='home__title'>Home</div>
        <div className="home__tabs">
          <div className='home__tab home__tab--active'>For You</div>
          <div className='home__tab'>Following</div>
        </div>
      </div>
      <PostForm/>
      {/* Tweet posts */}
      <div className='post'>
        {posts?.length > 0 ? posts?.map((post) => (
          <Postbox key={post.id} post={post}/>
        )): <div className="post__no-posts">
          <div className="post__text">게시글이 없습니다.</div>
          </div>}
      </div>
    </div>
    </>
  );
}