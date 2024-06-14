'use client';
import {useState} from 'react';
import {amenities, Amenity} from '@/utils/amentities';
import {Checkbox} from '@/components/ui/checkbox';

function AmenitiesInput({defaultValue}: { defaultValue?: Amenity[] }) {
    const amenitiesWithIcons = defaultValue?.map(({name, selected}) => ({
        name,
        selected,
        icon: amenities.find((amenity) => amenity.name === name)!.icon,
    }));
    const [selectedAmenities, setSelectedAmenities] = useState(
        amenitiesWithIcons || amenities
    );
    const handleChange = (amenity: Amenity) => {
        setSelectedAmenities((prev) => {

            const index = prev.findIndex((item) => amenity.name === item.name)
            if (index !== -1) {
                const newAmenities = [...prev]
                newAmenities[index] = {...prev[index], selected: !prev[index].selected};
                return newAmenities;
            }

            return prev;
        });
    };

    return (
        <section>
            <input
                type='hidden'
                name='amenities'
                value={JSON.stringify(selectedAmenities)}
            />
            <div className='grid grid-cols-2 gap-4'>
                {selectedAmenities.map((amenity) => {
                    return (
                        <div key={amenity.name} className='flex items-center space-x-2'>
                            <Checkbox
                                id={amenity.name}
                                checked={amenity.selected}
                                onCheckedChange={() => handleChange(amenity)}
                            />
                            <label
                                htmlFor={amenity.name}
                                className='text-sm font-medium leading-none capitalize flex gap-x-2 items-center'
                            >
                                {amenity.name}
                                <amenity.icon className='w-4 h-4'/>
                            </label>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

export default AmenitiesInput;
