"use client";

import { useCallback, useContext, useEffect, useState } from "react";
import { updateDoc, doc, getDoc } from "firebase/firestore";
import { FiImage } from "react-icons/fi";
import { db } from "./../../src/app/firebaseApp";
import { toast } from "react-toastify";
import AuthContext from "../../src/context/AuthContext";
import { PostProps } from "../../src/app/page";

export default function PostEditForm({ postId }: { postId: string }) {
  const { user } = useContext(AuthContext);
  const [post, setPost] = useState<PostProps | null>(null);
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 포스트 불러오기
  const getPost = useCallback(async () => {
    const docRef = doc(db, "posts", postId);
    const docSnap = await getDoc(docRef);
    const postData = docSnap.data();
    if (postData) {
      setPost({ ...(postData as PostProps), id: docSnap.id });
      setContent(postData.content);
    }
  }, [postId]);

  useEffect(() => {
    if (postId) getPost();
  }, [getPost, postId]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !post) return;

    setIsSubmitting(true);

    try {
      const postRef = doc(db, "posts", postId);
      await updateDoc(postRef, {
        content,
      });

      toast.success("게시글을 수정했습니다.");
    } catch (err) {
      toast.error("수정 실패");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="post-form" onSubmit={onSubmit}>
      <textarea
        className="post-form__textarea"
        required
        name="content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <div className="post-form__submit-area">
        <label htmlFor="file-input" className="post-form__file">
          <FiImage className="post-form__file-icon" />
        </label>
        <input type="file" id="file-input" className="hidden" disabled />
        <input
          type="submit"
          value="수정"
          className="post-form__submit-btn"
          disabled={isSubmitting}
        />
      </div>
    </form>
  );
}
