'use client'
import React from 'react';
import {useProperty} from "@/utils/store";
import BookingForm from "@/components/booking/BookingForm";
import ConfirmBooking from "@/components/booking/ConfirmBooking";

function BookingContainer() {
    const {range} = useProperty(state => state);

    if (!range || !range.from || !range.to || range.to.getTime() === range.from.getTime()) {
        return null;
    }

    return (
        <div className="w-full">
            <BookingForm/>
            <ConfirmBooking/>
        </div>
    );
}

export default BookingContainer;
