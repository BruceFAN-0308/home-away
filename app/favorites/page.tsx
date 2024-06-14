import React, {Suspense} from 'react';
import {fetchFavorites} from "@/utils/actions";
import LoadingCard from "@/components/card/LoadingCard";
import PropertiesList from "@/components/home/PropertiesList";
import EmptyList from "@/components/home/EmptyList";

async function FavoritePage() {

    const favoriteProperties = await fetchFavorites("", "");
    if (favoriteProperties.length === 0) {
        return <EmptyList heading="No results." btnText="Back Home Page"/>
    }
    console.log(favoriteProperties);
    return (
        <Suspense fallback={<LoadingCard/>}>
            <PropertiesList properties={favoriteProperties}/>
        </Suspense>
    );
}

export default FavoritePage;
