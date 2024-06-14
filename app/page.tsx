import CategoriesList from "@/components/home/CategoriesList";
import PropertiesContainer from "@/components/home/PropertiesContainer";
import {Suspense} from "react";
import LoadingCard from "@/components/card/LoadingCard";

export default function HomePage({searchParams}: {
    searchParams: {
        category?: string,
        search?: string
    }
}) {
    return (
        <>
            <h1 className="text-3xl">Home Page</h1>
            <CategoriesList category={searchParams.category} search={searchParams.search}/>
            <Suspense fallback={<LoadingCard/>}>
                <PropertiesContainer category={searchParams.category} search={searchParams.search}/>
            </Suspense>

        </>
    );
}
