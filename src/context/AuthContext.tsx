"use client"

import { ReactNode, createContext, useEffect, useState } from "react";
import { User } from "firebase/auth";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "../app/firebaseApp";

interface AuthProps {
  children: ReactNode;
}

const AuthContext = createContext({
  // null as User : 지금은 null값이지만 나중에 User 타입일 수도 있다
  user: null as User | null,
});

// 이 컴포넌트가 실제 상태관리와 로그인 상태 감지를 담당
// 모든 컴포넌트들을 이 Provider로 감싸야 context 사용이 가능하다
// 가장 상위 파일인 layout에 감쌌다
export const AuthContextProvider = ({ children }: AuthProps) => {
  //유저가 로그인을 한다면 currentUser에 유저 정보를 저장한다.
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const auth = getAuth(app);

  useEffect(() => {
    // 로그인 여부를 감지
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    });
  }, [auth]);

  return (
    // .Provider는 react가 Context 만들 때 붙여야 하는 예약된 이름
    // 벨류갑을 공급하는 컴포넌트
    <AuthContext.Provider value={{ user: currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

