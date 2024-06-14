'use client'

import React from 'react';
import FormContainer from "@/components/form/FormContainer";
import {createPropertyAction} from "@/utils/actions";
import FormInput from "@/components/form/FormInput";
import {SubmitButton} from "@/components/form/Button";
import CategoriesInput from "@/components/form/CategoriesInput";
import TextAreaInput from "@/components/form/TextAreaInput";
import CountriesInput from "@/components/form/CountriesInput";
import CounterInput from "@/components/form/CounterInput";
import AmenitiesInput from "@/components/form/AmenitiesInput";
import ImageInput from "@/components/form/ImageInput";

function CreateRentalPage() {
    return (
        <section>
            <h1 className="text-2xl font-semibold mb-8 capitalize">create property</h1>
            <div className="border p-8 rounded-md mt-4">
                <FormContainer action={createPropertyAction}>
                    <div className="grid md:grid-cols-2 grid-cols-2 mb-4 gap-4">
                        <FormInput label="Name(20 Limit)" name="name" type="text"/>
                        <FormInput label="Tagline(30 Limit)" name="tagline" type="text"/>
                        <FormInput label="Price(only number, greater 0.00)" name="price" type="number"/>
                        <CategoriesInput/>
                    </div>
                    <TextAreaInput labelText="Descprition (10 - 1000 words)" name="description"/>

                    <div className="grid md:grid-cols-2 grid-cols-2 mt-4 gap-4">
                        <CountriesInput/>
                        <ImageInput/>
                    </div>
                    <div className="mt-8">
                        <h3 className="mb-4">Accommodation Details</h3>
                        <CounterInput detail="guests"/>
                        <CounterInput detail="bedrooms"/>
                        <CounterInput detail="beds"/>
                        <CounterInput detail="baths"/>
                    </div>
                    <div className="mt-4">
                        <h2 className="mb-4">Amenities</h2>
                        <AmenitiesInput/>
                    </div>

                    <SubmitButton text="create rental" className="mt-8"/>
                </FormContainer>

            </div>
        </section>
    );
}

export default CreateRentalPage;
