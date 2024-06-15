'use client'

import React, {useState} from 'react';
import {Label} from "@/components/ui/label";
import {FaStar} from "react-icons/fa";

function RatingInput({name, labelText}: { name: string, labelText?: string }) {
    const [hover, setHover] = useState(0);
    const [rating, setRating] = useState(0);
    const [isChoice, setIsChoice] = useState(false);

    const handleRating = (rate: number) => {
        setRating(rate);
    };
    return (
        <div className="mb-2 max-w-xs">
            <Label htmlFor={name} className="capitalize">
                {labelText || name}
            </Label>
            <div className="flex mt-2" key={name}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                        key={star}
                        size={24}
                        color={star <= rating ? "#ffc107" : "#e4e5e9"}
                        onClick={() => {
                            if (rating === star) {
                                setIsChoice(!isChoice)
                            }
                            handleRating(star)
                        }}
                        onMouseEnter={() => {
                            if (!isChoice) {
                                setHover(star);
                                handleRating(star)
                            }
                        }}
                        onMouseLeave={() => {
                            if (!isChoice) {
                                setHover(0)
                                handleRating(0)
                            }
                        }}
                        style={{cursor: "pointer", marginRight: 5}}
                    />
                ))}
            </div>
            <input type="hidden" name={name} value={rating}/>
        </div>
    );
}

export default RatingInput;
