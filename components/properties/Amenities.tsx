import React from 'react';
import {amenities, Amenity} from "@/utils/amentities";
import Title from "@/components/properties/Title";

function Amenities({propertyAmenities}: { propertyAmenities: string }) {

    const amenitiesList: Amenity[] = JSON.parse(propertyAmenities);

    const noAmenities = amenitiesList.every((item) => !item.selected)
    if (noAmenities) {
        return null;
    }
    return (
        <div className="mt-4">
            <Title text="What this place offers"/>
            <div className="grid grid-cols-2 gap-x-4">
                {amenitiesList.map((item) => {
                    if (!item.selected) {
                        return null
                    }

                    const result = amenities.find((amen) => amen.name === item.name);
                    return <div key={item.name} className="flex items-center gap-x-4 mb-2">
                        {result && <result.icon/>}
                        <span className="font-light text-sm capitalize">{item.name}</span>
                    </div>
                })}
            </div>
        </div>
    );
}

export default Amenities;
