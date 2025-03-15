"use client"

import { useRouter } from "next/navigation"; 
import { BsHouse } from "react-icons/bs"
import { BiUserCircle } from "react-icons/bi"
import { MdLogout } from "react-icons/md"

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
        <button type="button" onClick={() => router.push("/")}>
          <MdLogout />
          Logout
        </button>
      </div>
    </div>
  ) 
}