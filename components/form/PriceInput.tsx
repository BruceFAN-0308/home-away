import React from 'react';
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";

function PriceInput({defaultValue}: { defaultValue?: number }) {
    const name = 'price';
    return (
        <div className='mb-2'>
            <Label htmlFor={name} className='capitalize'>
                Price ($)
            </Label>
            <Input
                id={name}
                type='number'
                name={name}
                min={0}
                defaultValue={defaultValue || 100}
                required
            />
        </div>
    );
}

export default PriceInput;
