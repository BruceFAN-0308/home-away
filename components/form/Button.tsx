'use client'

import {ReloadIcon} from '@radix-ui/react-icons';
import {useFormStatus} from 'react-dom';
import {Button} from '@/components/ui/button';
import {SignInButton} from "@clerk/nextjs";
import {FaHeart, FaRegHeart} from "react-icons/fa";
import React from "react";
import {LuPenSquare, LuTrash2} from "react-icons/lu";

type SubmitButtonProps = {
    className?: string;
    text?: string;
    size?: "default" | "lg" | "sm" | "icon"
};

export function SubmitButton({
                                 className = '',
                                 text = 'submit',
                                 size = "lg",
                             }: SubmitButtonProps) {
    const {pending} = useFormStatus();

    return (
        <Button type='submit'
                disabled={pending}
                size={size}
                className={`capitalize ${className} `}
        >
            {pending ? (<>
                <ReloadIcon className='mr-2 h-4 w-4 animate-spin'/>
                Please wait...
            </>) : (
                text
            )}
        </Button>
    );
}


export function CardSignInButton() {
    return (
        <SignInButton mode="modal">
            <Button type="button" size="icon" variant="outline" className="p-2 cursor-pointer" asChild>
                <FaRegHeart/>
            </Button>
        </SignInButton>
    )
}

export function CardSubmitButton({isFavorite}: { isFavorite: boolean }) {
    const {pending} = useFormStatus();
    return (
        <Button size="icon" variant="outline" className="p-2 cursor-pointer">
            {pending ? <ReloadIcon className="animate-spin"/> : isFavorite ? <FaHeart/> : <FaRegHeart/>}
        </Button>
    )
}

type actionType = 'edit' | 'delete';

export const IconButton = ({actionType}: { actionType: actionType }) => {
    const {pending} = useFormStatus();

    const renderIcon = () => {
        switch (actionType) {
            case 'edit':
                return <LuPenSquare/>;
            case 'delete':
                return <LuTrash2/>;
            default:
                const never: never = actionType;
                throw new Error(`Invalid action type: ${never}`);
        }
    };

    return (
        <Button
            type='submit'
            size='icon'
            variant='link'
            className='p-2 cursor-pointer'
        >
            {pending ? <ReloadIcon className=' animate-spin'/> : renderIcon()}
        </Button>
    );
};
