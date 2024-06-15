'use client';
import {useState} from 'react';
import FormContainer from '@/components/form/FormContainer';
import {Card} from '@/components/ui/card';
import TextAreaInput from '@/components/form/TextAreaInput';
import {Button} from '@/components/ui/button';
import {createReviewAction} from '@/utils/actions';
import {SubmitButton} from "@/components/form/Button";
import RatingInput from "@/components/form/Rating";

function SubmitReview({propertyId}: { propertyId: string }) {
    const [isReviewFormVisible, setIsReviewFormVisible] = useState(false);
    return (
        <div className='mt-8'>
            <Button onClick={() => setIsReviewFormVisible((prev) => !prev)}>
                Leave a Review
            </Button>
            {isReviewFormVisible && (
                <Card className='p-8 mt-8'>
                    <FormContainer action={createReviewAction}>
                        <input type='hidden' name='propertyId' value={propertyId}/>
                        <RatingInput name='rating'/>
                        <TextAreaInput
                            name='comment'
                            labelText='feedback'
                            defaultValue='Amazing place !!!'
                        />
                        <SubmitButton text='Submit' className='mt-4'/>
                    </FormContainer>
                </Card>
            )}
        </div>
    );
}

export default SubmitReview;
