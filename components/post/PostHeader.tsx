"use client"

import { IoIosArrowBack } from "react-icons/io";
import { useRouter } from "next/navigation";

export default function PostHeader() {
  const router = useRouter();
  return (
    <div className="post__header">
      <button type="button" onClick={() =>
        router.back()
        }>
        <IoIosArrowBack className="post__header-btn" />
      </button>
    </div>
  );
}