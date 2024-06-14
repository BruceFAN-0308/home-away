'use client'

import React from 'react';
import {useToast} from "@/components/ui/use-toast";
import {SignOutButton} from "@clerk/nextjs";

function SignOutLink() {

    const {toast} = useToast();

    function handleLogout() {
        toast({description: 'You have been signed out.'})
    }

    return (
        <SignOutButton redirectUrl="/">
            <button className="w-full text-left" onClick={handleLogout}>
                Logout
            </button>
        </SignOutButton>
    );
}

export default SignOutLink;
