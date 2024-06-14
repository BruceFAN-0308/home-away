import React from 'react';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Label} from "@/components/ui/label";
import {categories} from "@/utils/categories";

const name = "category"

function CategoriesInput({defaultValue}: { defaultValue?: string }) {
    return (
        <div className="mb-2">
            <Label htmlFor={name} className="capitalize">Categories</Label>
            <Select name={name} defaultValue={defaultValue || categories[0].label} required>
                <SelectTrigger id={name}>
                    <SelectValue/>
                </SelectTrigger>
                <SelectContent>
                    {categories.map(category => {
                        return <SelectItem key={category.label} value={category.label}>
                            <span className="flex items-center gap-2">
                                <category.icon/>
                                {category.label}
                            </span>
                        </SelectItem>
                    })}
                </SelectContent>
            </Select>
        </div>
    );
}

export default CategoriesInput;
