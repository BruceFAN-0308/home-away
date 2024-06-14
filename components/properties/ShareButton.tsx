'use client'

import React from 'react';
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";
import { LuShare2} from "react-icons/lu";
import {
    EmailIcon,
    EmailShareButton,
    LinkedinIcon,
    LinkedinShareButton,
    TwitterIcon,
    TwitterShareButton
} from "react-share";

function ShareButton({propertyId, name}: { propertyId: string, name: string }) {
    const shareLink = `${process.env.NEXT_PUBLIC_WEBSITE_URL}/properties/${propertyId}`;

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" size="icon" className="p-2">
                    <LuShare2/>
                </Button>
            </PopoverTrigger>
            <PopoverContent side="top" align="end" sideOffset={10} className="flex items-center gap-x-2 justify-center w-full">
                <TwitterShareButton url={shareLink} title={name}>
                    <TwitterIcon size={32} round/>
                </TwitterShareButton>
                <LinkedinShareButton url={shareLink} title={name}>
                    <LinkedinIcon size={32} round/>
                </LinkedinShareButton>
                <EmailShareButton url={shareLink} title={name}>
                    <EmailIcon size={32} round/>
                </EmailShareButton>
            </PopoverContent>

        </Popover>
    );
}

export default ShareButton;
