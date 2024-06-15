import React from 'react';
import {LuUser2} from "react-icons/lu";
import {fetchProfileImage} from "@/utils/actions";
import Image from "next/image";

async function UserIcon() {

    const profileImage = await fetchProfileImage();
    return (
        <>
            {
                profileImage ?
                    <Image width={6} height={6} src={profileImage} alt="profileImage" className="w-6 h-6 rounded-full object-cover"/>
                : <LuUser2 className="w-6 h-6 bg-primary rounded-full text-white"></LuUser2>
            }

        </>
    );
}

export default UserIcon;
