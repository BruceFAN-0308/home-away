import React from 'react';
import {fetchProperty} from "@/utils/actions";
import {PropertyCardProps} from "@/utils/types";
import EmptyList from "@/components/home/EmptyList";
import PropertiesList from "@/components/home/PropertiesList";

async function PropertiesContainer({category, search}: {
    category?: string,
    search?: string
}) {

    const properties: PropertyCardProps[] = await fetchProperty({search, category})

    if (properties.length === 0) {
        return (
            <EmptyList heading="No results." message="Try changing or removing some of your filters." btnText="Clear Filters"/>
        )
    }
    return (
        <PropertiesList properties={properties}/>
    )

}

export default PropertiesContainer;
