'use client'

import React from 'react';
import {Card, CardHeader} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {LuMinus, LuPlus} from "react-icons/lu";

function CounterInput({detail, defaultValue}: { detail: string, defaultValue?: number }) {

    const [count, setCount] = React.useState(defaultValue || 0);

    function increaseCount() {
        setCount(count + 1);
    }

    function decreaseCount() {
        if (count > 0) {
            setCount(count - 1);
        }
    }

    return (
        <Card className="mb-4">
            <input type="hidden" value={count} name={detail}/>
            <CardHeader className="flex flex-col gap-y-5">
                <div className="flex items-center justify-between flex-wrap">
                    <div className="flex flex-col">
                        <h2 className="font-medium capitalize">{detail}</h2>
                        <p className="text-muted-foreground text-sm">
                            Specify the number of guests
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="icon" type="button" onClick={decreaseCount}>
                            <LuMinus className="w-5 h-5 text-primary"/>
                        </Button>
                        <span>{count}</span>
                        <Button variant="outline" size="icon" type="button" onClick={increaseCount}>
                            <LuPlus className="w-5 h-5 text-primary"/>
                        </Button>
                    </div>
                </div>
            </CardHeader>
        </Card>
    );
}

export default CounterInput;
