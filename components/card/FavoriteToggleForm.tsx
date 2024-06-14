'use client'

import React from 'react';
import {usePathname} from "next/navigation";
import FormContainer from "@/components/form/FormContainer";
import {toggleFavoriteAction} from "@/utils/actions";
import {CardSubmitButton} from "@/components/form/Button";


function FavoriteToggleForm({propertyId, favoriteId}: { propertyId: string, favoriteId?: string | null }) {


    const pathname = usePathname();
    return (
        <FormContainer action={() => toggleFavoriteAction({propertyId, favoriteId, pathname})}>
            <CardSubmitButton isFavorite={favoriteId ? true : false}/>
        </FormContainer>
    );
}

export default FavoriteToggleForm;
