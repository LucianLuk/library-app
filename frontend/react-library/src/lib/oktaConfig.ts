export const oktaConfig = {
    clientId: '0oawrco4xl9GoUmnp697',
    issuer: 'https://integrator-3452376.okta.com/oauth2/default',
    redirectUri: window.location.origin + '/login/callback',
    scopes: ['openid', 'profile', 'email'],
    pkce: true,
    disableHttpsCheck: true, // Only for development purposes
}