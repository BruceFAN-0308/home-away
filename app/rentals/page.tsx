import React from 'react';
import {deleteRentalAction, fetchRentals} from "@/utils/actions";
import EmptyList from "@/components/home/EmptyList";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import Link from "next/link";
import FormContainer from "@/components/form/FormContainer";
import {IconButton} from "@/components/form/Button";

async function RentalsPage() {
    const rentals = await fetchRentals();

    if (rentals.length === 0) {
        return <EmptyList/>;
    }

    return (
        <div className="mt-16">
            <h4 className="mb-4 capitalize">Active Properties: {rentals.length}</h4>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Property Name</TableHead>
                        <TableHead>Nightly Rate</TableHead>
                        <TableHead>Nights Booked</TableHead>
                        <TableHead>Total Income</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rentals.map((rental) => {
                        const {id, name, price, totalNightsSum, orderTotalSum} = rental;
                        return (
                            <TableRow key={id}>
                                <TableCell>
                                    <Link href={`/properties/${id}`}
                                          className="underline text-muted-foreground tracking-wide">
                                        {name}
                                    </Link>
                                </TableCell>
                                <TableCell>{price}</TableCell>
                                <TableCell>{totalNightsSum}</TableCell>
                                <TableCell>${orderTotalSum}</TableCell>
                                <TableCell className="flex gap-2">
                                    <Link href={`/rentals/edit/${id}`}>
                                        <IconButton actionType='edit'></IconButton>
                                    </Link>
                                    <DeleteButton propertyId={id}/>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}

function DeleteButton({propertyId}: { propertyId: string }) {

    const action = deleteRentalAction.bind(null, {propertyId});
    return (
        <FormContainer action={action}>
            <IconButton actionType="delete"/>
        </FormContainer>
    )
}

function EditButton() {

}

export default RentalsPage;
