import {deleteReviewAction, fetchPropertyReviewsByUser,} from '@/utils/actions';
import ReviewCard from '@/components/reviews/ReviewCard';
import Title from '@/components/properties/Title';
import FormContainer from '@/components/form/FormContainer';
import {IconButton} from '@/components/form/Button';

async function ReviewsPage() {
    const reviews = await fetchPropertyReviewsByUser();

    if (reviews.length < 1) {
        return null;
    }
    return (
        <div className='mt-8'>
            <Title text='Reviews'/>
            <div className='grid md:grid-cols-2 mt-4 gap-8'>
                {reviews.map((review) => {
                    const {comment, rating} = review;
                    const {name, image} = review.property;
                    const reviewInfo = {
                        comment,
                        rating,
                        name: name,
                        image: image,
                    };
                    return (
                        <ReviewCard key={review.id} reviewInfo={reviewInfo}>
                            <DeleteReview reviewId={review.id}/>
                        </ReviewCard>);
                })}
            </div>
        </div>
    );

}

const DeleteReview = ({reviewId}: { reviewId: string }) => {
    const deleteReview = deleteReviewAction.bind(null, {reviewId});
    return (
        <FormContainer action={deleteReview}>
            <IconButton actionType='delete'/>
        </FormContainer>
    );
};

export default ReviewsPage;
