'use server'

import {clerkClient, currentUser} from "@clerk/nextjs/server";
import {createReviewSchema, imageSchema, profileSchema, propertySchema, validateWithZodSchema} from "@/utils/schemas";
import db from "@/utils/db";
import {redirect} from "next/navigation";
import {revalidatePath} from "next/cache";
import {uploadImage} from "@/utils/supabase";
import {calculateTotals} from "@/utils/calculateTotals";

export async function getAuthUser() {
    const user = await currentUser();
    if (!user) {
        throw new Error('Please login first');
    }
    if (!user.privateMetadata?.hasProfile) {
        redirect('/profile/create')
    }
    return user;
}

export async function renderError(error: unknown) {
    console.log(error);
    return {message: error instanceof Error ? error.message : 'An error occurred'};
}

export async function createProfileAction(preState: any, formData: FormData) {
    try {

        const user = await currentUser();
        if (!user) {
            throw new Error('Please login to create a profile')
        }
        const rawData = Object.fromEntries(formData);

        const data = validateWithZodSchema(profileSchema, rawData);

        await db.profile.create({
            data: {
                clerkId: user.id,
                email: user.emailAddresses[0].emailAddress,
                profileImage: user.imageUrl ?? "",
                ...data
            }
        });
        await clerkClient.users.updateUserMetadata(user.id, {
            privateMetadata: {
                hasProfile: true,
            },
        })
    } catch (e) {
        return renderError(e);
    }
    redirect('/ ')
}


export async function fetchProfileImage() {
    const user = await currentUser();
    if (!user) return null;

    const profile = await db.profile.findUnique({
        where: {
            clerkId: user.id
        },
        select: {
            profileImage: true,
        }
    });

    return profile?.profileImage;
}

export async function fetchProfile() {
    const user = await getAuthUser();
    const profile = await db.profile.findUnique({
        where: {
            clerkId: user.id
        },
    });
    if (!profile) {
        redirect('/profile/create')
    }
    return profile;
}

export async function updateProfile(preState: any, formData: FormData) {

    const user = await getAuthUser();
    try {
        const rawData = Object.fromEntries(formData);

        const data = validateWithZodSchema(profileSchema, rawData);

        await db.profile.update({
            where: {
                clerkId: user.id,
            },
            data: data,
        })
        revalidatePath('/profile')
        return {message: 'update profile succeed'}
    } catch (e) {
        return renderError(e);
    }

}

export async function updateImageAction(preState: any, formData: FormData) {
    const user = await getAuthUser();
    try {
        const image = formData.get("image") as File;
        const result = validateWithZodSchema(imageSchema, {image: image});

        const url = await uploadImage(result.image);
        await db.profile.update({
            where: {
                clerkId: user.id
            },
            data: {
                profileImage: url
            }
        })
        revalidatePath('/profile')
    } catch (e) {
        return renderError(e)
    }

    return {message: "image upload succeed"};
}

export async function createPropertyAction(preState: any, formData: FormData) {
    try {

        const user = await getAuthUser();
        const rawData = Object.fromEntries(formData);
        const file = formData.get("image") as File;
        const stringData = validateWithZodSchema(propertySchema, rawData);

        const imageData = validateWithZodSchema(imageSchema, {image: file});
        const imageUrl = await uploadImage(imageData.image);

        await db.property.create({
            data: {
                ...stringData,
                image: imageUrl,
                profileId: user.id
            }
        });

    } catch (e) {
        return renderError(e);
    }
    redirect('/')
}

export async function fetchProperty({search = "", category}: {
    search?: string,
    category?: string,
}) {
    const properties = await db.property.findMany({
        select: {
            id: true,
            name: true,
            image: true,
            tagline: true,
            price: true,
            country: true
        },
        where: {
            category: category,
            OR: [
                {name: {contains: search, mode: 'insensitive'}},
                {tagline: {contains: search, mode: 'insensitive'}},
            ]
        }
    })
    return properties;
}

export async function fetchFavoriteId({propertyId}: { propertyId: string }) {
    const user = await getAuthUser();
    const favorite = await db.favorite.findFirst({
        where: {
            propertyId: propertyId,
            profileId: user.id
        },
        select: {
            id: true
        },
    });
    return favorite?.id || null;
}

export async function toggleFavoriteAction(prevState: {
    propertyId: string,
    favoriteId?: string | null,
    pathname: string
}) {
    const user = await getAuthUser();
    const {propertyId, favoriteId, pathname} = prevState;

    try {
        if (favoriteId) {
            await db.favorite.delete({
                where: {
                    id: favoriteId
                }
            })
        } else {
            await db.favorite.create({
                data: {
                    propertyId: propertyId,
                    profileId: user.id
                }
            })
        }
        revalidatePath(pathname)
        return {message: favoriteId ? "removed the favorite house" : "added the favorite house"};
    } catch (e) {
        return renderError(e);
    }
}

export async function fetchFavorites(search?: string, category?: string) {
    const user = await getAuthUser();
    const properties = await db.favorite.findMany({
        select: {
            property: {
                select: {
                    id: true,
                    name: true,
                    image: true,
                    tagline: true,
                    price: true,
                    country: true
                }
            },
        },
        where: {
            profileId: user.id
        }
    });

    return properties.map(item => item.property);
}

export async function fetchPropertyDetail(propertyId: string) {
    const property = await db.property.findUnique({
        where: {
            id: propertyId
        },
        include: {
            profile: true,
            bookings: {
                select: {
                    checkIn: true,
                    checkOut: true,
                },
            },
        },
    });
    return property;
}

export async function createReviewAction(prevState: any, formData: FormData) {
    const user = await getAuthUser();
    try {
        const rawData = Object.fromEntries(formData);
        const validatedFields = validateWithZodSchema(createReviewSchema, rawData);
        console.log(user)
        await db.review.create({
            data: {
                ...validatedFields,
                profileId: user.id,
            },
        });

        revalidatePath(`/properties/${validatedFields.propertyId}`);
        return {message: 'Review submitted successfully'};
    } catch (error) {
        return renderError(error);
    }
}

export async function fetchPropertyReviews(propertyId: string) {
    const reviews = await db.review.findMany({
        where: {
            propertyId,
        },
        select: {
            id: true,
            rating: true,
            comment: true,
            profile: {
                select: {
                    firstName: true,
                    profileImage: true,
                },
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
    return reviews;
}

export const fetchPropertyReviewsByUser = async () => {
    const user = await getAuthUser();
    const reviews = await db.review.findMany({
        where: {
            profileId: user.id,
        },
        select: {
            id: true,
            rating: true,
            comment: true,
            property: {
                select: {
                    name: true,
                    image: true,
                },
            },
        },
    });
    return reviews;
};

export const deleteReviewAction = async (prevState: { reviewId: string }) => {
    const {reviewId} = prevState;
    const user = await getAuthUser();

    try {
        await db.review.delete({
            where: {
                id: reviewId,
                profileId: user.id,
            },
        });

        revalidatePath('/reviews');
        return {message: 'Review deleted successfully'};
    } catch (error) {
        return renderError(error);
    }
};

export async function findExistingReview(userId: string, propertyId: string) {
    const count = await db.review.count({
        where: {
            profileId: userId,
            propertyId: propertyId,
        }
    });
    console.log("hello" + count)
    return count;
}

export async function createBookingAction(propertyId: string, checkIn: Date, checkOut: Date) {
    const user = await getAuthUser();

    const property = await db.property.findUnique({
        where: {id: propertyId},
        select: {price: true},
    });
    if (!property) {
        return {message: 'Property not found'};
    }
    const {orderTotal, totalNights} = calculateTotals({
        checkIn,
        checkOut,
        price: property.price,
    });

    try {
        const booking = await db.booking.create({
            data: {
                checkIn,
                checkOut,
                orderTotal,
                totalNights,
                profileId: user.id,
                propertyId,
            },
        });
    } catch (error) {
        return renderError(error);
    }
    redirect('/bookings');
}

export async function fetchBookingsByPropertyId(propertyId: string) {
    const bookings = await db.booking.findMany({
        where: {
            propertyId: propertyId
        }
    });
    return bookings;
}
