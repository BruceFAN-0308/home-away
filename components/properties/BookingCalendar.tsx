'use client'

import React from 'react';
import {DateRange} from "react-day-picker";
import {Calendar} from "@/components/ui/calendar";

function BookingCalendar() {

    const currentDate = new Date();
    const defaultRange: DateRange = {
        from: undefined,
        to: undefined,
    };

    const [range, setRange] = React.useState<DateRange | undefined>(defaultRange);

    const isDateDisabled = (date: Date): boolean => {
        // do not compare directly, because that will make today is not available
        return date.getDate() < currentDate.getDate();
    };


    return (
        <Calendar mode="range" defaultMonth={currentDate} selected={range} disabled={isDateDisabled}
                  onSelect={setRange}/>
    );
}

export default BookingCalendar;
