"use client"
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { app } from '../../src/app/firebaseApp'
import Link from "next/link";
import {toast} from "react-toastify"
// import { FirebaseApp } from 'firebase/app';

export default function SignupForm() {
  const router = useRouter();
  
  const [error, setError] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>("");


  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // 🔹 기본 폼 제출 방지

    try {
      const auth = getAuth(app);
      await createUserWithEmailAndPassword(auth, email, password);

      router.push("/"); // 🔹 회원가입 성공 후 홈으로 이동
      toast.success("회원가입 성공! 🎉"); // 🔹 성공 메시지 표시
    } catch (error: any) {
      toast.error("회원가입 실패: " + error.message); // 🔹 에러 메시지 표시
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

    if (name === "passwordConfirmation") {
      setPasswordConfirmation(value);
      
      if (value?.length < 8) {
        setError("비밀번호는 8자리 이상 입력해주세요.");
      } else if(value !== password) {
        setError("비밀번호와 비밀번호 확인 값이 다릅니다.");
      } else {
        setError("");
      }
    }
  };

  
  return (
    <form className="form form--lg" onSubmit={onSubmit}>
      <div className="form__title">회원가입</div>

      <div className="form__block">
        <label htmlFor="email">이메일</label>
        <input type="text" name="email" id="email" value={email} required onChange={onChange} />
      </div>

      <div className="form__block">
        <label htmlFor="password">비밀번호</label>
        <input type="password" name="password" id="password" onChange={onChange} value={password} required />
      </div>

      <div className="form__block">
        <label htmlFor="passwordConfirmation">비밀번호 확인</label>
        <input type="password" name="passwordConfirmation" id="passwordConfirmation" onChange={onChange} value={passwordConfirmation}  required />
      </div>

      {error && error?.length > 0 && (
        <div className="form__block">
        <div className="form__error">{error}</div>
      </div>
      )}
      <div className="form__block">
        계정이 있으신가요?
        <Link href="/login" className="form__link">로그인하기</Link>
      </div>
      <div className="form__block">
        <button type="submit" className="form__btn-submit" disabled={error?.length > 0}>회원가입</button>
      </div>
    </form>
  );
}
