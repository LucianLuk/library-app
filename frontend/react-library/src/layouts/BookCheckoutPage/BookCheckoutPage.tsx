import {useEffect, useState} from "react";
import bookModel from "../../models/BookModel";
import BookModel from "../../models/BookModel";
import {SpinnerLoading} from "../Util/SpinnerLoading";
import {StarReview} from "../Util/StarReview";
import {CheckoutReviewBox} from "./CheckoutReviewBox";
import ReviewModel from "../../models/ReviewModel";
import {LatestReviews} from "./LatestReviews";
import {useOktaAuth} from "@okta/okta-react";
import ReviewRequestModel from "../../models/ReviewRequestModel";

export const BookCheckoutPage = () => {

    const {authState} = useOktaAuth();

    const [book, setBook] = useState<bookModel>();
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);

    // Review State
    const [reviews, setReviews] = useState<ReviewModel[]>([]);
    const [totalStars, setTotalStars] = useState(0);
    const [isLoadingReviews, setIsLoadingReviews] = useState(true);

    // Loans Count State
    const [currentLoansCount, setCurrentLoansCount] = useState(0);
    const [isLoadingCurrentLoansCount, setIsLoadingCurrentLoansCount] = useState(true);

    // Is Book Checked Out
    const [isBookCheckedOut, setIsBookCheckedOut] = useState(false);
    const [isLoadingIsBookCheckedOut, setIsLoadingIsBookCheckedOut] = useState(true);

    const [isReviewSubmitted, setIsReviewSubmitted] = useState(false);
    const [isLoadingUserReview, setIsLoadingUserReview] = useState(true);

    const bookId = (window.location.pathname).split('/')[2];

    useEffect(() => {
        const fetchBook = async () => {
            const baseUrl: string = `${process.env.REACT_APP_API}/books/${bookId}`;
            const response = await fetch(baseUrl);
            if (!response.ok) {
                throw new Error('Something went wrong!');
            }
            const responseJson = await response.json();
            const loadedBook: BookModel = {
                id: responseJson.id,
                title: responseJson.title,
                author: responseJson.author,
                description: responseJson.description,
                copies: responseJson.copies,
                copiesAvailable: responseJson.copiesAvailable,
                category: responseJson.category,
                img: responseJson.img,
            };
            setBook(loadedBook);
            setIsLoading(false);
        };
        fetchBook().catch((error: any) => {
            setIsLoading(false);
            setHttpError(error.message);
        })
    }, [isBookCheckedOut]);

    useEffect(() => {
        const fetchBookReviews = async () => {
            const reviewUrl: string = `${process.env.REACT_APP_API}/reviews/search/findByBookId?bookId=${bookId}`;

            const responseReviews = await fetch(reviewUrl);

            if (!responseReviews.ok) {
                throw new Error('Something went wrong!');
            }

            const responseJsonReviews = await responseReviews.json();
            const responseData = responseJsonReviews._embedded.reviews;
            const loadedReviews: ReviewModel[] = [];
            let weightedStarReviews: number = 0;

            for (const key in responseData) {
                loadedReviews.push({
                    id: responseData[key].id,
                    book_id: responseData[key].bookId,
                    userEmail: responseData[key].userEmail,
                    date: responseData[key].date,
                    rating: responseData[key].rating,
                    reviewDescription: responseData[key].reviewDescription
                });
                weightedStarReviews += responseData[key].rating;
            }

            if (loadedReviews) {
                const round = (Math.round((weightedStarReviews / loadedReviews.length) * 100) / 100);
                setTotalStars(Number(round));
            }

            setReviews(loadedReviews);
            setIsLoadingReviews(false);
        };

        fetchBookReviews().catch((error: any) => {
            setIsLoadingReviews(false);
            setHttpError(error.message);
        });
    }, [isReviewSubmitted]);

    useEffect(() => {
        const fetchUserReviewBook = async () => {
            if (authState && authState.isAuthenticated) {
                const url = `${process.env.REACT_APP_API}/reviews/secure/user/book?bookId=${bookId}`;
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                }
                const userReviewResponse = await fetch(url, requestOptions);
                if (!userReviewResponse.ok) {
                    throw new Error('Something went wrong!');
                }
                const userReviewResponseJson = await userReviewResponse.json();
                setIsReviewSubmitted(userReviewResponseJson);
            }
            setIsLoadingUserReview(false);
        };
        fetchUserReviewBook().catch((error: any) => {
            setIsLoadingUserReview(false);
            setHttpError(error.message);
        });
    }, [authState])

    useEffect(() => {
        const fetchUserCurrentLoansCount = async () => {
            if (authState && authState.isAuthenticated) {
                const loansCountUrl: string = `${process.env.REACT_APP_API}/books/secure/currentLoans/count`;
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                }
                const responseCurrentLoansCount = await fetch(loansCountUrl, requestOptions);
                if (!responseCurrentLoansCount.ok) {
                    throw new Error('Something went wrong!');
                }
                const responseJsonCurrentLoansCount = await responseCurrentLoansCount.json();

                setCurrentLoansCount(responseJsonCurrentLoansCount);
            }
            setIsLoadingCurrentLoansCount(false);
        };
        fetchUserCurrentLoansCount().catch((error: any) => {
            setIsLoadingCurrentLoansCount(false);
            setHttpError(error.message);
        });
    }, [authState, isBookCheckedOut]);

    useEffect(() => {
        const fetchUserIsBookCheckedOut = async () => {
            if (authState && authState.isAuthenticated) {
                const isBookCheckedOutUrl =
                    `${process.env.REACT_APP_API}/books/secure/isBookCheckedOutByUser?bookId=${bookId}`;
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                }
                const responseIsBookCheckedOut = await fetch(isBookCheckedOutUrl, requestOptions);
                if (!responseIsBookCheckedOut.ok) {
                    throw new Error('Something went wrong!');
                }
                const responseJsonIsBookCheckedOut = await responseIsBookCheckedOut.json();
                setIsBookCheckedOut(responseJsonIsBookCheckedOut);
            }
            setIsLoadingIsBookCheckedOut(false);
        }
        fetchUserIsBookCheckedOut().catch((error: any) => {
            setIsBookCheckedOut(false);
            setHttpError(error.message);
        });
    }, [authState]);

    if (isLoading || isLoadingReviews || isLoadingCurrentLoansCount || isLoadingIsBookCheckedOut || isLoadingUserReview) {
        return (
            <SpinnerLoading/>
        );
    }

    if (httpError) {
        return (
            <div className='container m-5'>
                <p>{httpError}</p>
            </div>
        )
    }

    async function checkoutBook() {
        const checkoutUrl: string = `${process.env.REACT_APP_API}/books/secure/checkout?bookId=${book?.id}`;
        const requestOptions = {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type': 'application/json'
            }
        }
        const checkoutResponse = await fetch(checkoutUrl, requestOptions);
        if (!checkoutResponse.ok) {
            throw new Error('Something went wrong!');
        }
        setIsBookCheckedOut(true);
    }

    async function submitReview(starInput: number, reviewDescriptionInput: string) {
        let bookId: number = 0;
        if (book?.id) {
            bookId = book.id;
        }

        const reviewRequestModel = new ReviewRequestModel(starInput, bookId, reviewDescriptionInput);
        const submitReviewUrl: string = `${process.env.REACT_APP_API}/reviews/secure/postReview`;
        const requestOptions = {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reviewRequestModel)
        };
        const submitReviewResponse = await fetch(submitReviewUrl, requestOptions);
        if (!submitReviewResponse.ok) {
            throw new Error('Something went wrong!');
        }
        setIsReviewSubmitted(true);
    }

    return (
        <div>
            <div className='container d-none d-lg-block'>
                <div className='row mt-5'>
                    <div className='col-sm-2 col-md-2'>
                        {
                            book?.img ?
                                <img src={book?.img} width='226' height='349' alt='Book'/>
                                :
                                <img src={require('./../../Images/BooksImages/book-luv2code-1000.png')}
                                     width='226' height='349' alt='Book'/>
                        }
                    </div>
                    <div className='col-4 col-md-4 container'>
                        <div className='ml-2'>
                            <h2>{book?.title}</h2>
                            <h5 className='text-primary'>{book?.author}</h5>
                            <p className='lead'>{book?.description}</p>
                            <StarReview Rating={totalStars} size={32}/>
                        </div>
                    </div>
                    <CheckoutReviewBox book={book} mobile={false} currentLoansCount={currentLoansCount}
                                       isAuthenticated={authState?.isAuthenticated}
                                       isBookCheckedOut={isBookCheckedOut}
                                       checkoutBook={checkoutBook}
                                       isReviewSubmitted={isReviewSubmitted}
                                       submitReview={submitReview}/>
                </div>
                <hr/>
                <LatestReviews reviews={reviews} bookId={book?.id} mobile={false}/>
            </div>
            <div className='container d-lg-none mt-5'>
                <div className='d-flex justify-content-center align-items-center'>
                    {
                        book?.img ?
                            <img src={book?.img} width='226' height='349' alt='Book'/>
                            :
                            <img src={require('./../../Images/BooksImages/book-luv2code-1000.png')}
                                 width='226' height='349' alt='Book'/>
                    }
                </div>
                <div className='mt-4'>
                    <div className='ml-2'>
                        <h2>{book?.title}</h2>
                        <h5 className='text-primary'>{book?.author}</h5>
                        <p className='lead'>{book?.description}</p>
                        <StarReview Rating={totalStars} size={32}/>
                    </div>
                </div>
                <CheckoutReviewBox book={book} mobile={true} currentLoansCount={currentLoansCount}
                                   isAuthenticated={authState?.isAuthenticated}
                                   isBookCheckedOut={isBookCheckedOut}
                                   checkoutBook={checkoutBook}
                                   isReviewSubmitted={isReviewSubmitted}
                                   submitReview={submitReview}/>
                <hr/>
                <LatestReviews reviews={reviews} bookId={book?.id} mobile={true}/>
            </div>
        </div>
    );
}