'use client'

import React from 'react';
import {Skeleton} from "@/components/ui/skeleton";

function Loading() {
    return (
        <Skeleton className="h-[300px] md:h-[500px] w-full rounded">loading</Skeleton>
    );
}

export default Loading;
