
import React  from 'react';
import {fetchProfile, updateImageAction, updateProfile} from "@/utils/actions";
import FormContainer from "@/components/form/FormContainer";
import FormInput from "@/components/form/FormInput";
import {SubmitButton} from "@/components/form/Button";
import ImageInputContainer from "@/components/form/ImageContainer";

async function ProfilePage() {
    const profile = await fetchProfile();

    return (
        <section>
            <h1 className="text-2xl font-semibold mb-8 capitalize">user profile</h1>
            <div className="border p-8 rounded-md">
                <ImageInputContainer image={profile.profileImage} name={profile.username} action={updateImageAction} text="update profile"/>
                <FormContainer action={updateProfile}>
                    <div className="grid md:grid-cols-2 grid-cols-2 mt-4 gap-4">
                        <FormInput label="First Name" name="firstName" type="text" defaultValue={profile.firstName}/>
                        <FormInput label="Last Name" name="lastName" type="text" defaultValue={profile.lastName}/>
                        <FormInput label="username" name="username" type="text" defaultValue={profile.username}/>
                    </div>
                    <SubmitButton text="Update Profile" className="mt-8"/>
                </FormContainer>

            </div>
        </section>
    );
}

export default ProfilePage;
