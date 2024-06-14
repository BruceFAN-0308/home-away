import React from 'react';
import {formatQuantity} from "@/utils/format";

type PropertyDetailProps = {
    details: {
        bedrooms: number;
        baths: number;
        guests: number;
        beds: number;
    }
}

function PropertyDetails({details: {bedrooms, baths, guests, beds}}: PropertyDetailProps) {
    // const {bedrooms, baths, guests, beds} = props.details;

    return (
        <div className="text-md font-light">
            <span>{formatQuantity(bedrooms, 'bedroom')}&middot;</span>
            <span>{formatQuantity(baths, 'bath')}&middot;</span>
            <span>{formatQuantity(guests, 'guest')}&middot;</span>
            <span>{formatQuantity(beds, 'bed')}&middot;</span>
        </div>
    );
}

export default PropertyDetails;
