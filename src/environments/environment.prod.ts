export const environment = {
  production: true,
  apiUrl: 'https://tatomoney-api.herokuapp.com',
  tokenWhitelistedDomains: [ new RegExp('tatomoney-api.herokuapp.com') ],
  tokenBlacklistedRoutes: [ new RegExp('\/oauth\/token') ]
};
