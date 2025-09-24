import { PublicClientApplication, Configuration, LogLevel, AccountInfo } from '@azure/msal-browser';

// Configuración para Microsoft Authentication Library (MSAL)
export const msalConfig: Configuration = {
  auth: {
    clientId: import.meta.env.VITE_AZURE_CLIENT_ID,
    authority: 'https://login.microsoftonline.com/common',
    redirectUri: import.meta.env.VITE_AZURE_REDIRECT_URI,
    postLogoutRedirectUri: import.meta.env.VITE_AZURE_REDIRECT_URI,
    navigateToLoginRequestUrl: true
  },
  cache: {
    cacheLocation: 'localStorage'
  },
  system: {
    loggerOptions: {
      loggerCallback: (level: LogLevel, message: string) => {
        switch (level) {
          case LogLevel.Error:
            console.error('[MSAL]', message);
            break;
          case LogLevel.Info:
            console.info('[MSAL]', message);
            break;
          case LogLevel.Verbose:
            console.debug('[MSAL]', message);
            break;
          case LogLevel.Warning:
            console.warn('[MSAL]', message);
            break;
          default:
            console.log('[MSAL]', message);
        }
      },
      piiLoggingEnabled: false
    }
  }
};

// Alcance de permisos requeridos
export const loginRequest = {
  scopes: ['User.Read', 'profile', 'email', 'openid']
};

// Configuración para Microsoft Graph API
export const graphConfig = {
  graphMeEndpoint: 'https://graph.microsoft.com/v1.0/me',
  graphPhotoEndpoint: 'https://graph.microsoft.com/v1.0/me/photo/$value'
};

// Instancia de MSAL
export const msalInstance = new PublicClientApplication(msalConfig);