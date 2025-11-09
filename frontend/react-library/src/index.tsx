import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {App} from './App';
import {BrowserRouter} from "react-router-dom";
import {loadStripe} from "@stripe/stripe-js";
import {Elements} from "@stripe/react-stripe-js";

const stripePromise = loadStripe('pk_test_51SR7F3Ff3YiKRKhq8DaX7jR12gcWnjeIWBlTfRDKhKzGvwAw76Ovz7v133pBfnQPXjXsfwJzcnI1Ujoiv8BIAF8600qR04i0a0');

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <BrowserRouter>
        <Elements stripe={stripePromise}>
            <App/>
        </Elements>
    </BrowserRouter>
);

