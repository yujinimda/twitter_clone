"use client"

import { useRouter } from "next/navigation"; 
import { BsHouse } from "react-icons/bs"
import { BiUserCircle } from "react-icons/bi"
import { MdLogout } from "react-icons/md"
import { getAuth, signOut} from "firebase/auth"
import { app } from '../src/app/firebaseApp'
import { toast } from "react-toastify";

export default function MenuList() {
  const router = useRouter(); 
  
  return (
    <div className="footer">
      <div className="footer__grid">
        <button type="button" onClick={() => router.push("/")}>
          <BsHouse />
          Home
        </button>
        <button type="button" onClick={() => router.push("/src/app/profile")}>
          <BiUserCircle />
          Profile
        </button>
        <button
          type="button"
          onClick={ async() => {
            const auth = getAuth(app);
            await signOut(auth);
            toast.success("로그아웃 되었습니다.")
            setTimeout(() => {
              router.replace("/users/login");
            }, 1000);
          }}>
          <MdLogout />
          Logout
        </button>
      </div>
    </div>
  ) 
}