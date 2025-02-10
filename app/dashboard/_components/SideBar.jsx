"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useContext, useEffect } from "react";
import { Progress } from "@/components/ui/progress";

import {
  HiOutlineHome,
  HiOutlineSquare3Stack3D,
  HiOutlineShieldCheck,
  HiMiniPower,
} from "react-icons/hi2";
import { UserCourseListContext } from "@/app/_context/UserCourseListContext";

function SideBar() {
  const { userCourseList, setUserCourseList } = useContext(
    UserCourseListContext
  );

  useEffect(() => {
    setUserCourseList(JSON.parse(localStorage.getItem("userCourseList")));
  }, []);

  const path = usePathname();
  const Menu = [
    {
      id: 1,
      name: "Home",
      icon: <HiOutlineHome />,
      path: "/dashboard",
    },
    {
      id: 2,
      name: "Explore",
      icon: <HiOutlineSquare3Stack3D />,
      path: "/dashboard/explore",
    },
    {
      id: 3,
      name: "LogOut",
      icon: <HiMiniPower />,
      path: "/dashboard/logout",
    },
  ];
  return (
    <div className="fixed h-full md:w-64 p-5 shadow-md">
      <Link href={'/dashboard'} className='flex items-center space-x-2 '>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-brain-circuit"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M9 13a4.5 4.5 0 0 0 3-4"/><path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"/><path d="M3.477 10.896a4 4 0 0 1 .585-.396"/><path d="M6 18a4 4 0 0 1-1.967-.516"/><path d="M12 13h4"/><path d="M12 18h6a2 2 0 0 1 2 2v1"/><path d="M12 8h8"/><path d="M16 8V5a2 2 0 0 1 2-2"/><circle cx="16" cy="13" r=".5"/><circle cx="18" cy="3" r=".5"/><circle cx="20" cy="21" r=".5"/><circle cx="20" cy="8" r=".5"/></svg>
        <h1 className='font-bold text-xl text-primary'>Course Pilot</h1>
      </Link>
      <hr className="my-5" />
      <ul>
        {Menu.map((item, index) => (
          <Link href={item.path} key={index}>
            <div
              className={`flex items-center gap-2 text-gray-600 p-3 cursor-pointer hover:bg-gray-100 hover:text-black rounded-lg mb-2 ${
                item.path === path && "bg-gray-100 text-black"
              }`}
            >
              <div className="text-2xl">{item.icon}</div>
              <h2>{item.name}</h2>
            </div>
          </Link>
        ))}
      </ul>

      <div className="absolute bottom-10 w-[80%]">
        <Progress value={(userCourseList?.length / 50) * 100} />

        <h2 className="text-sm my-2">
          {userCourseList?.length} Out of 50 Course Created
        </h2>
        <Link href="/dashboard/upgrade">
          <h2
            className={`text-xs hover:underline text-gray-700 ${
              (userCourseList?.length / 5) * 100 >= 60 && "text-blue-700"
            }`}
          >
            Upgrade your plan for unlimited course generation
          </h2>
        </Link>
      </div>
    </div>
  );
}

export default SideBar;
