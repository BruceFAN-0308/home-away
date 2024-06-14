import React from 'react';
import FormInput from "@/components/form/FormInput";
import FormContainer from "@/components/form/FormContainer";
import {SubmitButton} from "@/components/form/Button";
import {createProfileAction} from "@/utils/actions";
import {currentUser} from "@clerk/nextjs/server";
import {redirect} from "next/navigation";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {Icon} from "@radix-ui/react-select";


async function CreateProfilePage() {

    const user = await currentUser();
    if (user?.privateMetadata?.hasProfile) {
        redirect('/')
    }

    return (
        <section>
            <h1 className="text-2xl font-semibold mb-8 capitalize">new user</h1>
            <div className="border p-8 rounded-md">
                <FormContainer action={createProfileAction}>
                    <div className="grid md:grid-cols-2 grid-cols-2 mt-4 gap-4">
                        <FormInput label="First Name" name="firstName" type="text"/>
                        <FormInput label="Last Name" name="lastName" type="text"/>
                        <FormInput label="username" name="username" type="text"/>
                    </div>
                    <SubmitButton text="Create Profile" className="mt-8"/>
                </FormContainer>

            </div>
        </section>
    );
}

export default CreateProfilePage;
