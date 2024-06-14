import React from 'react';
import {fetchPropertyDetail} from "@/utils/actions";
import {redirect} from "next/navigation";
import BreadCrumbs from "@/components/properties/BreadCrumbs";
import FavoriteToggleButton from "@/components/card/FavoriteToggleButton";
import ShareButton from "@/components/properties/ShareButton";
import ImageContainer from "@/components/properties/ImageContainer";
import PropertyRating from "@/components/card/PropertyRating";
import BookingCalendar from "@/components/properties/BookingCalendar";
import PropertyDetails from "@/components/properties/PropertyDetail";
import UserInfo from "@/components/properties/UserInfo";
import {Separator} from "@/components/ui/separator";
import Description from "@/components/properties/Description";

async function PropertyDetail({params}: { params: { id: string } }) {

    const propertyDetail = await fetchPropertyDetail(params.id);
    if (!propertyDetail) {
        redirect('/')
    }
    const {guests, bedrooms, beds, baths} = propertyDetail;
    const firstName = propertyDetail.profile.firstName;
    const profileImage = propertyDetail.profile.profileImage
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
                    <Separator/>
                    <Description description={propertyDetail.description}/>
                </div>
                <div className="lg:col-span-4 flex flex-col items-center">
                    <BookingCalendar/>
                </div>
            </section>
        </div>
    );
}

export default PropertyDetail;
