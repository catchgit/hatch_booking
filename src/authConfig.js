// src/authConfig.js
export const msalConfig = {
    auth: {
        clientId: '1dbbe367-3728-47ad-8f4a-267cf1ff2166',
        authority: 'https://login.microsoftonline.com/ffc9f9aa-7726-465c-ad0e-ae92dc650920',
        redirectUri: 'http://localhost:5173', // Your app's redirect URI
    },
};

export const graphApiScopes = ["user.read", "User.Read.All" , "Calendars.Read", "Calendars.Read.Shared"];