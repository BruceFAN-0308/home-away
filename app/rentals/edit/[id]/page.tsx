import React from 'react';
import {createPropertyAction, fetchPropertyDetail, updateImageAction, updatePropertyAction} from "@/utils/actions";
import {redirect} from "next/navigation";
import ImageInputContainer from "@/components/form/ImageContainer";
import FormInput from "@/components/form/FormInput";
import PriceInput from "@/components/form/PriceInput";
import CategoriesInput from "@/components/form/CategoriesInput";
import CountriesInput from "@/components/form/CountriesInput";
import TextAreaInput from "@/components/form/TextAreaInput";
import CounterInput from "@/components/form/CounterInput";
import AmenitiesInput from "@/components/form/AmenitiesInput";
import FormContainer from "@/components/form/FormContainer";
import {SubmitButton} from "@/components/form/Button";

async function EditRentalPage({params}: { params: { id: string } }) {

    const property = await fetchPropertyDetail(params.id);

    if (!property) {
        redirect('/')
    }

    return (
        <>
            <h1 className="font-bold text-2xl">Edit Property</h1>
            <div className="border rounded p-8 mt-8">

                <ImageInputContainer image={property.image} name={property.name} action={updateImageAction}
                                     text="Update Image"/>
                <FormContainer action={updatePropertyAction}>
                    <input type="hidden" name="id" value={property.id}/>
                    <div className="mt-8 grid grid-cols-2 gap-8">
                        <FormInput label="Name(20 limit)" name="name" type="text" defaultValue={property.name}/>
                        <FormInput label="tagline(30 limit)" name="tagline" type="text"
                                   defaultValue={property.tagline}/>
                        <PriceInput defaultValue={property.price}/>
                        <CategoriesInput defaultValue={property.category}/>
                        <CountriesInput defaultValue={property.country}/>
                    </div>
                    <div className="mt-4">
                        <TextAreaInput name="description" labelText="description(10 - 100 words)"
                                       defaultValue={property.description}/>
                    </div>
                    <div>
                        <h1 className=" text-xl mt-8 mb-4">Accommodation Details</h1>
                        <CounterInput detail="guests" defaultValue={property.guests}/>
                        <CounterInput detail="bedrooms" defaultValue={property.bedrooms}/>
                        <CounterInput detail="beds" defaultValue={property.beds}/>
                        <CounterInput detail="baths" defaultValue={property.baths}/>
                    </div>
                    <div>
                        <h1 className=" text-xl mt-8 mb-4">Amenities</h1>
                        <AmenitiesInput defaultValue={JSON.parse(property.amenities)}/>
                    </div>
                    <SubmitButton text="Update Property" className="mt-8"/>
                </FormContainer>

            </div>
        </>
    );

}

export default EditRentalPage;
