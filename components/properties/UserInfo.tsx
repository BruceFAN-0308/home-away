import React from 'react';
import Image from "next/image";

type UserInfoProps = {
    profile: {
        profileImage: string,
        firstName: string,
    }
}

function UserInfo({profile: {profileImage, firstName}}: UserInfoProps) {
    return (
        <article className="grid grid-cols-[auto,1fr] gap-4 mt-4">
            <Image src={profileImage} alt={firstName} width={50} height={50}
                   className="rounded w-12 h-12 object-cover"/>
            <div>
                <p>Host by <span className="font-bold">{firstName}</span></p>
                <p>super host &middot; 2 years hosting</p>
            </div>
        </article>
    );
}

export default UserInfo;
