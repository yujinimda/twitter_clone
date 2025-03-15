"use client"; 

import { useParams } from "next/navigation";

export default function PostDetail() {
  const {id} = useParams();
  return (
    <h1>게시글 상세 페이지 : {id}</h1>
  )
}