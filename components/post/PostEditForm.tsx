"use client";

import { useCallback, useContext, useEffect, useState } from "react";
import { updateDoc, doc, getDoc } from "firebase/firestore";
import { FiImage } from "react-icons/fi";
import { db, storage} from "./../../src/app/firebaseApp";
import { toast } from "react-toastify";
import AuthContext from "../../src/context/AuthContext";
import { PostProps } from "../../src/app/page";
import { useRouter } from "next/navigation";
import {getDownloadURL, ref, uploadString, deleteObject} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

export default function PostEditForm({ postId }: { postId: string }) {
  const { user } = useContext(AuthContext);
  const [post, setPost] = useState<PostProps | null>(null);
  const [content, setContent] = useState("");
  const [hashTag, setHasTag] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  
  const [imageFile, setImageFile] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false); 
  const router = useRouter();

  const handleFileUpload = (e: any) => {
    const {
      target: { files },
    } = e;

    const file = files?.[0];
    const fileReader = new FileReader();
    fileReader?.readAsDataURL(file);

    fileReader.onloadend = (e: any) => {
      const { result } = e?.currentTarget;
      setImageFile(result);
    };
  };

  // 포스트 불러오기
  const getPost = useCallback(async () => {
    const docRef = doc(db, "posts", postId);
    const docSnap = await getDoc(docRef);
    const postData = docSnap.data();
    if (postData) {
      setPost({ ...(postData as PostProps), id: docSnap.id });
      setContent(postData.content);
      setTags(docSnap?.data()?.hashTags);
      setImageFile(docSnap?.data()?.imageUrl);
    }
  }, [postId]);

  useEffect(() => {
    if (postId) getPost();
  }, [getPost, postId]);

  const onSubmit = async (e: React.FormEvent) => {
    setIsSubmitting(true);
    const key = `${user?.uid}/${uuidv4()}`;
    const storageRef = ref(storage, key);
    e.preventDefault();
    if (!user || !post) return;

    try {

      // 기존 사진 지우고 새로운 사진 업로드
      if (post?.imageUrl) {
        let imageRef = ref(storage, post?.imageUrl);
        await deleteObject(imageRef).catch((error) => {
          console.log(error);
        });
      }

      // 새로운 파일 있다면 업로드
      let imageUrl = "";
      if (imageFile) {
        const data = await uploadString(storageRef, imageFile, "data_url");
        imageUrl = await getDownloadURL(data?.ref);
      }

      const postRef = doc(db, "posts", postId);
      await updateDoc(postRef, {
        content,
        hashTags: tags,
        imageUrl: imageUrl,
      });     
       
      toast.success("게시글을 수정했습니다.");

      setTimeout(() => {
        router.push(`/posts/${post.id}`)
      },100)
      
      

    } catch (err) {
      toast.error("수정 실패");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onChangeHashTag = (e: any) => {
    setHasTag(e?.target?.value?.trim());
  }

  const removeTag = (tag: string) => {
    setTags(tags?.filter((val) => val !== tag))
  }
  

  const handleKeyUp = (e: any) => {
    if(e.keyCode === 32 && e.target.value.trim() !== "") {
      //에러메세지가 나오지않았다. hashTag 상태랑 e.target.value가 동기화되지 않았었다.
      //이유는 검사와 추가 기준이 달랐음 (e.target.value vs hashTag)
      //그래서 trimmed를 추가해서 검사와 추가기준 모두 통일했다.
      const trimmed = e.target.value.trim(); 
      //만약 같은 태그가 있다면 에러를 띄운다.
      //아니라면 태그를 생성해준다.
      if(tags?.includes(trimmed)){
        toast.error("같은 태그가 있습니다.");
      } else {
        setTags([...tags, trimmed])
        setHasTag("");
      }
    }
  }

  const handleDeleteImage = () => {
    setImageFile(null)
  }


  return (
    <form className="post-form" onSubmit={onSubmit}>
      <textarea
        className="post-form__textarea"
        required
        name="content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <div className="post-form__hashtags">
        <span className="post-form__hashtags-outputs">
          {tags?.map((tag, index) => (
              <span className="post-form__hashtags-tag" key={index} onClick={() => removeTag(tag)}>
                #{tag}
              </span>
            ))}
        </span>
        <input
          className="post-form__input"
          name="hashtag"
          id="hashtag"
          placeholder="해시태그 + 스페이스바 입력"
          onChange={onChangeHashTag}
          onKeyUp={handleKeyUp}
          value={hashTag}
        />
      </div>
      <div className='post-form__submit-area'>
        <div className="post-form__image-area">
          <label htmlFor="file-input" className="post-form__file">
            <FiImage className='post-form__file-icon'/>
          </label>
        
        <input
          type="file"
          name="file-input"
          id="file-input"
          accept='image/*'
          onChange={handleFileUpload}
          className="hidden"
          />
        {imageFile && (
          <div className="post-form__attachment">
            <img src={imageFile} alt="attachment" width={100} height={100} />
            <button
                className="post-form__clear-btn"
                type="button"
                onClick={handleDeleteImage}
              >
                Clear
              </button>
          </div>
        )}
        </div>
        <input
          type="submit"
          value="수정"
          className='post-form__submit-btn'
          disabled={isSubmitting}
        />
      </div> 

    </form>
  );
}
