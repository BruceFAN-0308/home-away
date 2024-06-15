'use client';
import {type actionFunction} from '@/utils/types';
import {useState} from "react";
import {LuUser2} from "react-icons/lu";
import Image from "next/image";
import {Button} from "@/components/ui/button";
import FormContainer from "@/components/form/FormContainer";
import ImageInput from "@/components/form/ImageInput";
import {SubmitButton} from "@/components/form/Button";

type ImageInputContainerProps = {
    image: string;
    name: string;
    action: actionFunction;
    text: string;
    children?: React.ReactNode;
};

function ImageInputContainer(props: ImageInputContainerProps) {
    const {image, name, action, text} = props;
    const [updateFormVisible, setUppateFormVisible] = useState(false);
    const userIcon = (<LuUser2 className="w-24 h-24 bg-primary rounded text-white mb-4"></LuUser2>)
    return (
        <div>
            {image ? <Image src={image} alt={name} width={100} height={100}
                            className="rounded object-cover mb-4 w-24 h-24"/> : userIcon}
            <Button variant="outline" size="sm" onClick={() => setUppateFormVisible((prevState) => !prevState)}>
                {text}
            </Button>
            {updateFormVisible && <div className="max-w-lg mt-4">
                <FormContainer action={action}>
                    {props.children}
                    <ImageInput/>
                    <SubmitButton size="sm"/>
                </FormContainer>
            </div>}
        </div>
    );
}

export default ImageInputContainer;
