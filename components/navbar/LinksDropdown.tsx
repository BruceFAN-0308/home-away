import React from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {LuAlignLeft} from "react-icons/lu";
import UserIcon from "@/components/navbar/UserIcon";
import {links} from "@/utils/links";
import Link from "next/link";
import {SignedIn, SignedOut, SignInButton, SignOutButton} from "@clerk/nextjs";
import {auth} from "@clerk/nextjs/server";


function LinksDropdown() {
    const {userId} = auth();
    const isAdminUser = userId === process.env.ADMIN_USER_ID;
    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex gap-4 max-w-[100px]">
                        <LuAlignLeft className="w-6 h-6"/>
                        <UserIcon/>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-32" align="start" sideOffset={10}>
                    <SignedOut>
                        <DropdownMenuItem>
                            <SignInButton mode="modal">
                                <button className="w-full text-left">Login</button>
                            </SignInButton>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem>
                            <SignInButton mode="modal">
                                <button className="w-full text-left">Register</button>
                            </SignInButton>
                        </DropdownMenuItem>

                    </SignedOut>
                    <SignedIn>
                        {links.map((link) => {
                                if (link.label === 'admin' && !isAdminUser) {
                                    return null
                                }
                                ;
                                return (
                                    <DropdownMenuItem key={link.href}>
                                        <Link href={link.href} className='capitalize w-full'>
                                            {link.label}
                                        </Link>
                                    </DropdownMenuItem>
                                );
                            }
                        )
                        }
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem>
                            <Link href={'/'}>
                                <SignOutButton/>
                            </Link>
                        </DropdownMenuItem>
                    </SignedIn>

                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}

export default LinksDropdown;
