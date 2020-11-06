import auth0 from 'auth0-js';

class Auth {
  constructor() {
    this.auth0 = new auth0.WebAuth({
      // the following three lines MUST be updated
      domain: 'dev-owihjaep.auth0.com',
      audience: 'https://dev-owihjaep.auth0.com/userinfo',
      clientID: 'z4B9Lh4mlL5pd4F8zJwtpEeLDFd3BaJX',
      redirectUri: 'http://localhosthost:3000',
      responseType: 'id_token',
      scope: 'openid profile'
    });

    // this.getUserID = this.getUserID.bind(this);
    this.getProfile = this.getProfile.bind(this);
    // this.handleAuthentication = this.handleAuthentication.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.signIn = this.signIn.bind(this);
    this.signOut = this.signOut.bind(this);
  }

  getProfile() {
    return this.profile;
  }

  getIdToken() {
    return this.idToken;
  }

  isAuthenticated() {
    return new Date().getTime() < this.expiresAt;
  }

  signIn() {
    this.auth0.authorize();
  }

//   handleAuthentication() {
//     return new Promise((resolve, reject) => {
//       this.auth0.parseHash((err, authResult) => {
//         if (err) return reject(err);
//         if (!authResult || !authResult.idToken) {
//           return reject(err);
//         }
//         this.idToken = authResult.idToken;
//         this.profile = authResult.idTokenPayload;
//         // set the time that the id token will expire at
//         this.expiresAt = authResult.idTokenPayload.exp * 1000;
//         console.log(authResult)
//         resolve();
//       });
//     })
//   }

//   getUserID() {
//   this.auth0.parseHash({ hash: window.location.hash }, function(err, authResult) {
//   if (err) {
//     return console.log(err);
//   }

//   // this.auth0.userInfo(authResult.accessToken, function(err, user) {
//   //   // Now you have the user's information
//     console.log(authResult)
//   // });
// });
// }


  signOut() {
    // clear id token, profile, and expiration
    this.idToken = null;
    this.profile = null;
    this.expiresAt = null;
  }
}

const auth0Client = new Auth();

export default auth0Client;