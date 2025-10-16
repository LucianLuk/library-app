export const oktaConfig = {
    clientId: '0oawgwqgppw4VkpNT697',
    issuer: 'https://integrator-3452376.okta.com/oauth2/default',
    redirectUri: 'http://localhost:3000/login/callback',
    scopes: ['openid', 'profile', 'email'],
    pkce: true,
    disableHttpsCheck: true, // Only for development purposes
}