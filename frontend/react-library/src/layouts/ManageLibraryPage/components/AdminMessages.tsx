import {useOktaAuth} from "@okta/okta-react";
import {useEffect, useState} from "react";
import MessageModel from "../../../models/MessageModel";
import {SpinnerLoading} from "../../Util/SpinnerLoading";
import {Pagination} from "../../Util/Pagination";
import {AdminMessage} from "./AdminMessage";
import AdminMessageRequest from "../../../models/AdminMessageRequest";

export const AdminMessages = () => {

    const {authState} = useOktaAuth();

    // Normal Loading Pieces
    const [isLoadingAdminMessages, setIsLoadingAdminMessages] = useState(true);
    const [httpError, setHttpError] = useState(null);

    // Messages Endpoint State
    const [adminMessages, setAdminMessages] = useState<MessageModel[]>([]);
    const [messagesPerPage] = useState(5);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    // Recall userEffect
    const [buttonSubmit, setButtonSubmit] = useState(false);

    useEffect(() => {
        const fetchUserMessages = async () => {
            if (authState && authState?.isAuthenticated) {
                const url = `${process.env.REACT_APP_API}/messages/search/findByClosed/?closed=false&page=${currentPage - 1}&size=${messagesPerPage}`;
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                };
                const fetchResponse = await fetch(url, requestOptions);
                if (!fetchResponse.ok) {
                    throw new Error('Something went wrong!');
                }
                const responseJson = await fetchResponse.json();

                setAdminMessages(responseJson._embedded.messages);
                setTotalPages(responseJson.page.totalPages);
            }
            setIsLoadingAdminMessages(false);
        }
        fetchUserMessages().catch((error: any) => {
            setIsLoadingAdminMessages(false);
            setHttpError(error.message);
        })
        window.scrollTo(0, 0);
    }, [authState, currentPage, buttonSubmit]);

    if (isLoadingAdminMessages) {
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

    async function submitResponseToQuestion(id: number, response: string) {
        const url = `${process.env.REACT_APP_API}/messages/secure/admin/responseMessage`;
        if (authState && authState?.isAuthenticated && id !== null && response !== '') {
            const adminMessageRequest: AdminMessageRequest = new AdminMessageRequest(id, response);
            const requestOptions = {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(adminMessageRequest)
            };
            const submitQuestionResponse = await fetch(url, requestOptions);
            if (!submitQuestionResponse.ok) {
                throw new Error('Something went wrong!');
            }
            setButtonSubmit(!buttonSubmit);
        }
    }

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div className='mt-3'>
            {adminMessages.length > 0 ?
                <>
                    <h5>Pending Q/A: </h5>
                    {adminMessages.map(message => (
                        <AdminMessage message={message} key={message.id} submitResponse={submitResponseToQuestion}/>
                    ))}
                </>
                :
                <h5>No pending Q/A</h5>
            }
            {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate}/>}
        </div>
    );
}