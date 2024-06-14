'use client'

import React from 'react';
import {ScrollArea, ScrollBar} from "@/components/ui/scroll-area";
import {categories} from "@/utils/categories";
import Link from "next/link";

function CategoriesList({category, search}: {
    category?: string,
    search?: string
}) {
    const searchTerm = search ? `&search=${search}` : ''

    return (
        <section>
            <ScrollArea className="py-6">
                <div className="flex gap-x-4">
                    {categories.map((item) => {
                        const isActive = item.label === category;
                        return (
                            // if isActive is true, which means this category has already been choice. and right now
                            <Link key={item.label} href={isActive ? `/?${searchTerm}` : `/?category=${item.label}${searchTerm}`}>
                                <article className={`p-3 flex flex-col items-center cursor-pointer duration-300 hover:text-primary
                                w-[100px] ${isActive ? 'text-primary' : ''}`}>
                                    <item.icon className='w-8 h-8'/>
                                    <p className="capitalize text-sm mt-1">{item.label}</p>
                                </article>
                            </Link>)
                    })}
                </div>
                <ScrollBar orientation="horizontal"/>
            </ScrollArea>
        </section>
    );
}

export default CategoriesList;
