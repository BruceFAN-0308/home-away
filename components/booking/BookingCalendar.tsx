'use client'

import React, {useEffect, useState} from 'react';

import {defaultSelected} from "@/utils/calendar";
import {Calendar} from "@/components/ui/calendar";
import {DateRange} from "react-day-picker";
import {useProperty} from "@/utils/store";

function BookingCalendar() {
    const currentDate = new Date();
    const [range, setRange] = useState<DateRange | undefined>(defaultSelected);

    const isDateDisabled = (date: Date): boolean => {
        // do not compare date directly, must use getDate() to get the day, because that will make today is not available
        return date.getDate() < currentDate.getDate();
    }

    useEffect(() => {
        useProperty.setState({range});
    }, [range]);

    return (
        <Calendar mode="range" defaultMonth={currentDate} selected={range}
                  onSelect={setRange} className="mb-4" disabled={isDateDisabled}/>
    );
}

export default BookingCalendar;

