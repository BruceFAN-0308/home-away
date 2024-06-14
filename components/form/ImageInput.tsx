import React from 'react';
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";

function ImageInput() {
    const tagName = 'image'
    return (
        <div className="mb-2">
            <Label htmlFor={tagName} className="capitalize">Image</Label>
            <Input id={tagName} name={tagName} type="file" required accept="image/*" className="max-w-xs"/>
            Image Input
        </div>
    );
}

export default ImageInput;
