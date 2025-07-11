'use server'

import {clerkClient, currentUser} from "@clerk/nextjs/server";
import {createReviewSchema, imageSchema, profileSchema, propertySchema, validateWithZodSchema} from "@/utils/schemas";
import db from "@/utils/db";
import {redirect} from "next/navigation";
import {revalidatePath} from "next/cache";
import {uploadImage} from "@/utils/supabase";
import {calculateTotals} from "@/utils/calculateTotals";
import {formatDate} from "@/utils/format";

const getAdminUser = async () => {
    const user = await getAuthUser();
    if (user.id !== process.env.ADMIN_USER_ID) redirect('/');
    return user;
};

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

// export async function updateImageAction(preState: any, formData: FormData) {
//     const user = await getAuthUser();
//     try {
//         const image = formData.get("image") as File;
//         const result = validateWithZodSchema(imageSchema, {image: image});
//
//         const url = await uploadImage(result.image);
//         await db.profile.update({
//             where: {
//                 clerkId: user.id
//             },
//             data: {
//                 profileImage: url
//             }
//         })
//         revalidatePath('/profile')
//     } catch (e) {
//         return renderError(e)
//     }
//
//     return {message: "image upload succeed"};
// }

//  test
export const updateImageAction = async (
    prevState: any,
    formData: FormData
): Promise<{ message: string }> => {
    const user = await getAuthUser();
    const propertyId = formData.get('id') as string;

    try {
        const image = formData.get('image') as File;
        const validatedFields = validateWithZodSchema(imageSchema, { image });
        const fullPath = await uploadImage(validatedFields.image);

        await db.property.update({
            where: {
                id: propertyId,
                profileId: user.id,
            },
            data: {
                image: fullPath,
            },
        });
        revalidatePath(`/rentals/${propertyId}/edit`);
        return { message: 'Property Image Updated Successful' };
    } catch (error) {
        return renderError(error);
    }
};

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

    await db.booking.deleteMany({
        where: {
            profileId: user.id,
            paymentStatus: false,
        },
    });

    let bookingId: null | string = null;

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
        bookingId = booking.id;
    } catch (error) {
        return renderError(error);
    }
    console.log(bookingId);
    redirect(`/checkout?bookingId=${bookingId}`);
}

export async function fetchBookings() {
    const user = await getAuthUser();
    const bookings = await db.booking.findMany({
        where: {
            profileId: user.id,
            paymentStatus: true
        },
        include: {
            property: {
                select: {
                    id: true,
                    name: true,
                    country: true,
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }

    });
    return bookings;
}


export async function deleteBookingAction(prevState: { bookingId: string }) {
    const {bookingId} = prevState;
    const user = await getAuthUser();

    try {
        const result = await db.booking.delete({
            where: {
                id: bookingId,
                profileId: user.id,
            },
        });

        revalidatePath('/bookings');
        return {message: 'Booking deleted successfully'};
    } catch (error) {
        return renderError(error);
    }
}

export const fetchRentals = async () => {
    const user = await getAuthUser();
    const rentals = await db.property.findMany({
        where: {
            profileId: user.id,
        },
        select: {
            id: true,
            name: true,
            price: true,
        },
    });

    const rentalsWithBookingSums = await Promise.all(
        rentals.map(async (rental) => {
            const totalNightsSum = await db.booking.aggregate({
                where: {
                    propertyId: rental.id,
                    paymentStatus: true,
                },
                _sum: {
                    totalNights: true,
                },
            });

            const orderTotalSum = await db.booking.aggregate({
                where: {
                    propertyId: rental.id,
                    paymentStatus: true,
                },
                _sum: {
                    orderTotal: true,
                },
            });

            return {
                ...rental,
                totalNightsSum: totalNightsSum._sum.totalNights,
                orderTotalSum: orderTotalSum._sum.orderTotal,
            };
        })
    );

    console.log(rentalsWithBookingSums);
    return rentalsWithBookingSums;
};

export const fetchRentalDetails = async (propertyId: string) => {
    const user = await getAuthUser();

    return db.property.findUnique({
        where: {
            id: propertyId,
            profileId: user.id,
        },
    });
};

export async function deleteRentalAction(prevState: { propertyId: string }) {
    const {propertyId} = prevState;
    const user = await getAuthUser();

    try {
        await db.property.delete({
            where: {
                id: propertyId,
                profileId: user.id,
            },
        });

        revalidatePath('/rentals');
        return {message: 'Rental deleted successfully'};
    } catch (error) {
        return renderError(error);
    }
}

export const updatePropertyAction = async (
    prevState: any,
    formData: FormData
): Promise<{ message: string }> => {
    const user = await getAuthUser();
    const propertyId = formData.get('id') as string;

    try {

        const rawData = Object.fromEntries(formData);
        const validatedFields = validateWithZodSchema(propertySchema, rawData);
        await db.property.update({
            where: {
                id: propertyId,
                profileId: user.id,
            },
            data: {
                ...validatedFields,
            },
        });

        revalidatePath(`/rentals/${propertyId}/edit`);
        return {message: 'Update Successful'};
    } catch (error) {
        return renderError(error);
    }
};

export const fetchReservations = async () => {
    const user = await getAuthUser();

    const reservations = await db.booking.findMany({
        where: {
            paymentStatus: true,
            property: {
                profileId: user.id,
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
        include: {
            property: {
                select: {
                    id: true,
                    name: true,
                    price: true,
                    country: true,
                },
            },
        },
    });
    return reservations;
};

export const fetchStats = async () => {
    await getAdminUser();

    const usersCount = await db.profile.count();
    const propertiesCount = await db.property.count();
    const bookingsCount = await db.booking.count({
        where: {
            paymentStatus: true,
        },
    });

    return {
        usersCount,
        propertiesCount,
        bookingsCount,
    };
};

export const fetchChartsData = async () => {
    await getAdminUser();
    const date = new Date();
    date.setMonth(date.getMonth() - 6);
    const sixMonthsAgo = date;

    const bookings = await db.booking.findMany({
        where: {
            paymentStatus: true,
            createdAt: {
                gte: sixMonthsAgo,
            },
        },
        orderBy: {
            createdAt: 'asc',
        },
    });
    const bookingsPerMonth = bookings.reduce((total, current) => {
        const date = formatDate(current.createdAt, true);
        const existingEntry = total.find((entry) => entry.date === date);
        if (existingEntry) {
            existingEntry.count += 1;
        } else {
            total.push({date, count: 1});
        }
        return total;
    }, [] as Array<{ date: string; count: number }>);
    return bookingsPerMonth;
};


export async function fetchPropertyRating(propertyId: string) {
    const result = await db.review.groupBy({
        by: ['propertyId'],
        _avg: {
            rating: true,
        },
        _count: {
            rating: true,
        },
        where: {
            propertyId,
        },
    });

    // empty array if no reviews
    return {
        rating: result[0]?._avg.rating?.toFixed(1) ?? 0,
        count: result[0]?._count.rating ?? 0,
    };
}



export const fetchReservationStats = async () => {
    const user = await getAuthUser();

    const properties = await db.property.count({
        where: {
            profileId: user.id,
        },
    });

    const totals = await db.booking.aggregate({
        _sum: {
            orderTotal: true,
            totalNights: true,
        },
        where: {
            property: {
                profileId: user.id,
            },
        },
    });

    return {
        properties,
        nights: totals._sum.totalNights || 0,
        amount: totals._sum.orderTotal || 0,
    };
};

// file of the const string
// const str_vacation_day_code = "vacation_day_code" // "vacation_day_code" is the database column key

// file of the calling getCommon code
// getCommonCode(str_vacation_day_code)

// file of the action api
export const getCommonCode = async (key: string) => {
    fetch("http://localhost:8080/time_card_db/")
    // sql: select key, value from common_code where status = 1 and key = key
    // return the database value
}
