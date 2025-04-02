"use client"

import { collection, addDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { useState, useContext  } from 'react';
import { FiImage } from 'react-icons/fi';
import { toast } from "react-toastify";
import { db, storage} from "../../src/app/firebaseApp";
import  AuthContext  from '../../src/context/AuthContext';
import { v4 as uuidv4 } from "uuid";

export default function PostForm() {
  const [content, setContent] = useState("");
  const [hashTag, setHasTag] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const { user } = useContext(AuthContext);
  const [imageFile, setImageFile] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false); //이미지를 여러번 업로드 못하게

  

  const onSubmit = async (e: any) => {
    setIsSubmitting(true);
    const key = `${user?.uid}/${uuidv4()}`;
    const storageRef = ref(storage, key);
    e.preventDefault();
    
    if (!user) {
      toast.error("로그인이 필요합니다.");
      return;
    }

    try {

      // 이미지 업로드
      let imageUrl = "";
      if (imageFile) {
        const data = await uploadString(storageRef, imageFile, "data_url");
        imageUrl = await getDownloadURL(data?.ref);
      }

      //업로드된 이미지의 다운로드 url 업뎃
      await addDoc(collection(db, "posts"), {
        content: content,
        createdAt: new Date()?.toLocaleDateString("ko", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
        uid: user?.uid,
        email: user?.email,
        hashTags: tags,
        imageUrl: imageUrl,
      });
      
      setTags([]);
      setHasTag("");
      setContent("");
      toast.success("게시글을 생성했습니다.");
      setImageFile(null);
      setIsSubmitting(false);      
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

  const handleFileUpload = (e: any) => {
    const {
      target: { files },
    } = e; //업로드된 파일 목록 꺼냄

    const file = files?.[0]; // 첫번째 파일 하나만 선택
    //선택된 파일을 base64 URL(데이터 URL)형식으로 읽음
    //이미지 미리보기 등에 사용 가능
    const fileReader = new FileReader();
    fileReader?.readAsDataURL(file);

    fileReader.onloadend = (e: any) => {
      const { result } = e?.currentTarget;
      setImageFile(result);
    };
  };

  const handleDeleteImage = () => {
    setImageFile(null)
  }

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
          value="Tweet"
          className='post-form__submit-btn'
          disabled={isSubmitting}
        />
      </div> 
    </form>
  )
}