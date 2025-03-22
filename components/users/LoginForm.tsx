"use client"
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getAuth , signInWithEmailAndPassword ,onAuthStateChanged, signInWithPopup, GoogleAuthProvider, GithubAuthProvider} from "firebase/auth";
import { app } from '../../src/app/firebaseApp'
import Link from "next/link";
import {toast} from "react-toastify"
// import { FirebaseApp } from 'firebase/app';

export default function SignupForm() {
  const router = useRouter();
  
  const [error, setError] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // 🔹 기본 폼 제출 방지

    try {
      const auth = getAuth(app);

      await signInWithEmailAndPassword(auth, email, password);

      onAuthStateChanged(auth, (user) => {
        if (user) {
          toast.success("로그인 성공!");
          router.push("/"); // 이때 이동
        }
      });
    } catch (error: any) {
      toast.error("로그인 실패: " + error.message); // 에러 메시지 표시
    }
  };
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: {name, value},
    } = e;
    console.log(name, value)


    if (name === "email") {
      setEmail(value);
      const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      
      if (!value?.match(validRegex)) {
        setError("이메일 형식이 올바르지 않습니다.");
      } else {
        setError("");
      }
    }

    if (name === "password") {
      setPassword(value);
      
      if (value?.length < 8) {
        setError("비밀번호는 8자리 이상 입력해주세요.");
      } else {
        setError("");
      }
    }

  };

   const onClickSocialLogin = async (e: any) => {
      const {
        target: { name },
      } = e;
  
      let provider;
      const auth = getAuth(app);
  
      if (name === "google") {
        provider = new GoogleAuthProvider();
      }
  
      if (name === "github") {
        provider = new GithubAuthProvider();
      }
  
      await signInWithPopup(
        auth,
        provider as GithubAuthProvider | GoogleAuthProvider
      )
        .then((result) => {
          console.log(result);
          toast.success("로그인 되었습니다.");
          router.push("/"); 
        })
        .catch((error) => {
          console.log(error);
          const errorMessage = error?.message;
          toast?.error(errorMessage);
        });
    };
  
  
  return (
    <form className="form form--lg" onSubmit={onSubmit}>
      <div className="form__title">로그인</div>

      <div className="form__block">
        <label htmlFor="email">이메일</label>
        <input type="text" name="email" id="email" value={email} required onChange={onChange} />
      </div>

      <div className="form__block">
        <label htmlFor="password">비밀번호</label>
        <input type="password" name="password" id="password" onChange={onChange} value={password} required />
      </div>

      {error && error?.length > 0 && (
        <div className="form__block">
        <div className="form__error">{error}</div>
      </div>
      )}
      <div className="form__block">
        계정이 없으신가요?
        <Link href="/users/signup" className="form__link">회원가입하기</Link>
      </div>
      <div className="form__block--lg">
        <button type="submit" className="form__btn--submit" disabled={error?.length > 0}>로그인</button>
      </div>
      <div className="form__block">
        <button
          type="button"
          name="google"
          className="form__btn--google"
          onClick={onClickSocialLogin}
        >
          Google로 로그인
        </button>
      </div>
      <div className="form__block">
        <button
          type="button"
          name="github"
          className="form__btn--github"
          onClick={onClickSocialLogin}
        >
          Github으로 로그인
        </button>
      </div>
    </form>
  );
}
