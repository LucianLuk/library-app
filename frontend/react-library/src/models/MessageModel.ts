class MessageModel {
    title: string;
    question: string;
    id?: number;
    userEmail?: string;
    adminEmail?: string;
    response?: string;
    closed?: boolean;

    constructor(
        title: string,
        question: string,
        id?: number,
        userEmail?: string,
        adminEmail?: string,
        response?: string,
        closed?: boolean
    ) {
        this.title = title;
        this.question = question;
        this.id = id;
        this.userEmail = userEmail;
        this.adminEmail = adminEmail;
        this.response = response;
        this.closed = closed;
    }
}

export default MessageModel;