import React from 'react';
import {fetchPropertyDetail, findExistingReview, getAuthUser} from "@/utils/actions";
import {redirect} from "next/navigation";
import BreadCrumbs from "@/components/properties/BreadCrumbs";
import FavoriteToggleButton from "@/components/card/FavoriteToggleButton";
import ShareButton from "@/components/properties/ShareButton";
import ImageContainer from "@/components/properties/ImageContainer";
import PropertyRating from "@/components/card/PropertyRating";
import PropertyDetails from "@/components/properties/PropertyDetail";
import UserInfo from "@/components/properties/UserInfo";
import {Separator} from "@/components/ui/separator";
import Description from "@/components/properties/Description";
import Amenities from "@/components/properties/Amenities";
import dynamic from "next/dynamic";
import {Skeleton} from "@/components/ui/skeleton";
import PropertyReviews from "@/components/reviews/PropertyReviews";
import {currentUser} from "@clerk/nextjs/server";
import SubmitReview from "@/components/reviews/SubmitReview";


const DynamicMap = dynamic(
    () => import('@/components/properties/PropertyMap'),
    {
        ssr: false,
        loading: () => <Skeleton className="h-[400px] w-full"/>
    }
)

const DynamicBookingWrapper = dynamic(
    () => import('@/components/booking/BookingWrapper'),
    {
        ssr: false,
        loading: () => <Skeleton className="h-[400px] w-full"/>
    }
)

async function PropertyDetail({params}: { params: { id: string } }) {

    const propertyDetail = await fetchPropertyDetail(params.id);
    if (!propertyDetail) {
        redirect('/')
    }
    const {guests, bedrooms, beds, baths} = propertyDetail;
    const firstName = propertyDetail.profile.firstName;
    const profileImage = propertyDetail.profile.profileImage

    let user = await currentUser();
    if (user) {
        user = await getAuthUser();
    }
    const isNotOwner = user && propertyDetail.profile.clerkId !== user.id;

    const reviewDoesNotExist = user && user.id && isNotOwner && await findExistingReview(user.id, propertyDetail.id) === 0;
    return (
        <div>
            <BreadCrumbs name={propertyDetail.name}/>
            <header className="flex items-center justify-between mt-4">
                <h1 className="text-4xl font-bold"> {propertyDetail.tagline}</h1>
                <div className="flex items-center gap-x-4">
                    <ShareButton propertyId={propertyDetail.id} name={propertyDetail.name}/>
                    <FavoriteToggleButton propertyId={propertyDetail.id}/>
                </div>
            </header>
            <ImageContainer mainImage={propertyDetail.image} name={propertyDetail.name}/>
            <section className="lg:grid lg:grid-cols-12 gap-x-12 mt-12">
                <div className="lg:col-span-8">
                    <div className="flex gap-x-4 items-center">
                        <h1 className="text-xl font-bold">{propertyDetail.name}</h1>
                        <PropertyRating propertyId={propertyDetail.id} inPage/>
                    </div>
                    <PropertyDetails details={propertyDetail}/>
                    <UserInfo profile={{firstName, profileImage}}/>
                    <Separator className="mt-4"/>
                    <Description description={propertyDetail.description}/>
                    <Amenities propertyAmenities={propertyDetail.amenities}/>
                    <DynamicMap countryCode={propertyDetail.country}/>
                </div>
                <div className="lg:col-span-4 flex flex-col items-center">

                    <DynamicBookingWrapper propertyId={propertyDetail.id} price={propertyDetail.price}
                                           bookings={propertyDetail.bookings}/>
                </div>
            </section>
            {reviewDoesNotExist &&
                <SubmitReview propertyId={propertyDetail.id}/>}
            <PropertyReviews propertyId={propertyDetail.id}/>
        </div>
    );
}

export default PropertyDetail;
