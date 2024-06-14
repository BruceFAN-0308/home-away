'use client'

import React, {useState} from 'react';
import Title from "@/components/properties/Title";
import {Button} from "@/components/ui/button";

function Description({description}: { description: string }) {
    const [isFullDescriptionShown, setIsFullDescriptionShown] = useState(false);

    const words = description.split(' ');
    const isLongDescription = words.length > 100;

    const toggleDescription = () => {
        setIsFullDescriptionShown(!isFullDescriptionShown);
    };

    const displayedDescription =
        isLongDescription && !isFullDescriptionShown
            ? words.splice(0, 100).join(' ') + '...'
            : description;

    return (
        <article className="mt-4">
            <Title text='Description'/>
            <p className="text-muted-foreground font-light leading-loose">{displayedDescription}</p>
            {isLongDescription &&
                <Button variant="outline" className="mt-4" onClick={toggleDescription}>
                    {isFullDescriptionShown ? 'Show less' : 'Show more'}
                </Button>}
        </article>
    );
}

export default Description;
