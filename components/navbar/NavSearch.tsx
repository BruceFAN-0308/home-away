'use client'

import React, {useEffect, useState} from 'react';
import {Input} from "@/components/ui/input";
import {useRouter, useSearchParams} from "next/navigation";
import {Button} from "@/components/ui/button";
import {RxCircle} from "react-icons/rx";


function NavSearch() {

    const searchParams = useSearchParams();
    const {replace} = useRouter();

    const [search, setSearch] = useState(searchParams.get('search')?.toString() || '');

    const handleSearch = () => {
        const params = new URLSearchParams(searchParams);
        if (search) {
            params.set('search', search);
        } else {
            params.delete('search');
        }
        replace(`/?${params.toString()}`);
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    useEffect(() => {
        if (!searchParams.get('search')) {
            setSearch('')
        }
    }, [searchParams.get('search')]);

    return (
        <div className="flex gap-4">
            <Input type="text" placeholder="find a property..." className="max-w-sm  dark:bg-muted" value={search}
                   onKeyDown={handleKeyPress}
                   onChange={(e) => {
                       setSearch(e.target.value);
                   }}>
            </Input>
            <Button onClick={handleSearch} className="ml-2">
                <RxCircle/>
            </Button>
        </div>
    );
}

export default NavSearch;
