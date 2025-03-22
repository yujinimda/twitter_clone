"use client"

import { collection, addDoc } from "firebase/firestore";
import { useState, useContext  } from 'react';
import { FiImage } from 'react-icons/fi';
import { toast } from "react-toastify";
import { db } from "../../src/app/firebaseApp";
import  AuthContext  from '../../src/context/AuthContext';

export default function PostForm() {
  const [content, setContent] = useState("")
  const { user } = useContext(AuthContext);

  const handleFileUpload = () => {};

  const onSubmit = async (e: any) => {
    e.preventDefault();

    
  if (!user) {
    toast.error("로그인이 필요합니다.");
    return;
  }

    try {
      await addDoc(collection(db, "posts"), {
        content: content,
        createdAt: new Date()?.toLocaleDateString("ko", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
        uid: user?.uid,
        email: user?.email,
      });
   
      setContent("");
      toast.success("게시글을 생성했습니다.");
      
    
    } catch (e: any) {
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const {
      target: {name, value},
    } = e;
    
    
    if(name === "content"){
      setContent(value)
    }
  };

  return (
    <form className='post-form' action='' onSubmit={onSubmit}>
      <textarea
        className='post-form__textarea'
        required
        name='content'
        id='content'
        value={content}
        placeholder='what is happing?'
        onChange={onChange}
      ></textarea>
      <div className='post-form__submit-area'>
        <label htmlFor="file-input" className="post-form__file">
          <FiImage className='post-form__file-icon'/>
        </label>
        <input
          type="file"
          name="file-input"
          accept='image/*'
          onChange={handleFileUpload}
          className="hidden"
          />
        <input
          type="submit"
          value="Tweet"
          className='post-form__submit-btn'
        />
      </div> 
    </form>
  )
}