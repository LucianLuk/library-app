import {Redirect} from "react-router-dom";
import {useOktaAuth} from "@okta/okta-react";
import {SpinnerLoading} from "../layouts/Util/SpinnerLoading";
import OktaSignInWidget from "./OktaSignInWidget";

const LoginWidget = (config) => {
    const {oktaAuth, authState} = useOktaAuth();
    const onSuccess = (tokens) => {
        console.log('Login successful, tokens received:', tokens);
        oktaAuth.handleLoginRedirect(tokens);
    };

    const onError = (err) => {
        console.log('Sign in error: ', err);
    }

    if (!authState) {
        return (
            <SpinnerLoading/>
        );
    }

    return authState.isAuthenticated ?
        <Redirect to={{pathname: '/'}}/>
        :
        <OktaSignInWidget onSuccess={onSuccess} onError={onError} config={config} />
};

export default LoginWidget;