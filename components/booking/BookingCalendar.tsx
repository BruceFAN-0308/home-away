'use client'

import React, {useEffect, useState} from 'react';

import {defaultSelected} from "@/utils/calendar";
import {Calendar} from "@/components/ui/calendar";
import {DateRange} from "react-day-picker";
import {useProperty} from "@/utils/store";
import {fetchBookingsByPropertyId} from "@/utils/actions";

async function BookingCalendar() {
    const state = useProperty((state) => state);
    const currentDate = new Date();
    const [range, setRange] = useState<DateRange | undefined>(defaultSelected);
    const [bookings, setBookings] = useState<any[]>([]);

    const isDateDisabled = (date: Date): boolean => {
        let isBooked = false;
        //
        if (bookings) {
            const bookedDates = getBookedDates(bookings);
            if (bookedDates.includes(date)) {
                isBooked = true;
            }
        }
        // do not compare date directly, must use getDate() to get the day, because that will make today is not available
        return date.getDate() < currentDate.getDate() || isBooked;
    }

    useEffect(() => {
        useProperty.setState({range});
    }, [range]);

    useEffect(() => {
        const fetchData = async () => {
            const bookings = await fetchBookingsByPropertyId(state.propertyId);
            setBookings(bookings);
        };
        fetchData();
        console.log(bookings)
    }, []);

    return (
        <Calendar mode="range" defaultMonth={currentDate} selected={range}
                  onSelect={setRange} className="mb-4" disabled={isDateDisabled}/>
    );
}

// a function to help me filter the bookings, to get the arrays, the arrays has all date is booked
function getBookedDates(bookings: any[]): Date[] {
    const bookedDates: Date[] = [];

    bookings.forEach(booking => {
        const currentDate = new Date(booking.checkIn);
        const checkOutDate = new Date(booking.checkOut);

        while (currentDate <= checkOutDate) {
            bookedDates.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }
    });

    return bookedDates;
}


export default BookingCalendar;

