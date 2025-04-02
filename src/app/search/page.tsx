"use client"

import { useContext, useEffect, useState } from "react";
import { PostProps } from "../page";
import AuthContext from "@/context/AuthContext";
import { collection, orderBy, where, query, onSnapshot} from "firebase/firestore";
import Postbox from "../../../components/post/PostBox";
import { db } from "../firebaseApp";


export default function SearchPage() { 
  const [posts, setPosts] = useState<PostProps[]>([]);
  const [tagQuery, setTagQuery] = useState<string>("");
  const {user} = useContext(AuthContext);

  // console.log(tagQuery)

  const onChange = (e: any) => {
    setTagQuery(e?.target?.value?.trim());
  };

  useEffect(() => {
    if(user) {
      let postRef = collection(db, "posts");
      let postQuery = query(
        postRef,
        where("hashTags", "array-contains-any", [tagQuery]),
        orderBy("createdAt", "desc")
      );

      onSnapshot(postQuery, (snapShot) => {
        let dataObj = snapShot?.docs?.map((doc) => ({
          ...doc?.data(),
          id: doc?.id,
        }));

        setPosts(dataObj as PostProps[])
      })
    }
  }, [tagQuery, user])

  return (
    <div className="home">
    <div className="home__top">
      <div className="home__title">
        <div className="home__title-text">Search</div>
      </div>
      <div className="home__search-div">
        <input
          className="home__search"
          placeholder="해시태그 검색"
          onChange={onChange}
        />
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
  );
}