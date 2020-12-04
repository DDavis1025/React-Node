import {Auth0Context} from "./react-auth0-spa";
import React, { Component, useContext } from 'react';
import { BrowserRouter, Router, Route, Switch } from "react-router-dom";
import PrivacyPolicy from "./components/Terms/privacy-policy";
import WebsitePrivacyPolicy from "./components/Terms/website-privacy-policy";
import MobileTermsOfService from "./components/Terms/mobile-terms-of-service";

import Profile from "./components/Profile";
import history from "./utils/history";
import './css/styles.css';
import Navbar from './components/navbar';
import Downloaded from './components/downloaded';
import DownloadTest from './components/downloadTest';
import ImageUpload from './components/image-upload';
import AddAlbum from './components/add-album';
import Album from './components/album';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar2 from "./components/NavBar2";
import { useAuth0 } from "./react-auth0-spa";
import PrivateRoute from "./components/PrivateRoute";
import Upload from "./components/upload";
import Feed from "./components/feed";
import EditAlbum from "./components/Edit/edit-album";
import { Spinner } from 'reactstrap';
import AddVideo from "./components/add-video"
import ProfilePage from "./components/profile-page"
import ProfileAlbums from "./components/Profile/profile-albums"
import EditVideo from "./components/Edit/edit-video";
import AddTrack from "./components/addTrack";
import EditTrack from "./components/Edit/edit-track";
import UploadPage from "./components/Edit/upload_page";
import ProfileVideos from "./components/Profile/video";
import ProfileTracks from "./components/Profile/tracks";
import Payment from "./components/Payment/payment";
import Subscription from "./components/Payment/subscription";
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import Premium from "./components/Payment/premium";
import Billing from "./components/Payment/billing";
import UpdatePaymentInfo from "./components/Payment/updatePayment";
import Account from "./components/Profile/account";
import EmailNotVerified from "./components/Profile/emailNotVerified";

const stripePromise = loadStripe(process.env.REACT_APP_PUBLISHABLE_KEY);


function App() {

  const { loading } = useAuth0();
  const { isAuthenticated } = useAuth0();
  const auth0Context = useContext(Auth0Context);
  let email_verified;
  if (auth0Context.user) {
  email_verified = auth0Context.user.email_verified;
  }
  


  if (loading) {
    return <div style={{height: '100vh', display: 'flex',  justifyContent:'center', alignItems:'center'}}><Spinner style={{ width: '3rem', height: '3rem' }} /></div>
  } 


  if (auth0Context.user && isAuthenticated) {
  return (
    <BrowserRouter>
      <div className="App">
      <Router history={history}>
      <Route path="/mobile-privacy-policy" component={PrivacyPolicy}/>
      <Route path="/website-privacy-policy" component={WebsitePrivacyPolicy}/>
      <Route path="/mobile-terms-of-service" component={MobileTermsOfService}/>
      <NavBar2 />
      <Navbar/>
      {!email_verified ? 
      <Route path={["*"]} component={EmailNotVerified} />
       :
      <div>
      <Switch>
          <Route path="/" exact />
          <PrivateRoute path="/profile" component={Profile} />
        </Switch>

      <Route exact path="/" render={() => <DownloadTest />} />
      <Route path="/download-test" component={DownloadTest} />
      <Route path="/image-upload" component={ImageUpload}/>
      <Route path="/add-album" component={AddAlbum}/>
      <Route path="/downloaded" component={Downloaded} />
      <Route path="/album/upload" component={AddAlbum}/>
      <Route path="/video/upload" component={AddVideo}/>
      <Route path="/album/:albumId" component={Album}/>
      <Route path="/upload" component={Upload}/>
      <Route path="/feed" component={Feed}/>
      <Route path="/user-profile" component={ProfilePage}/>
      <Route path="/:albumId/album/edit" component={EditAlbum}/>
      <Route path="/albums" component={ProfileAlbums}/>
      <Route path="/:videoId/video/edit/" component={EditVideo}/>
      <Route path="/track/upload/" component={AddTrack}/>
      <Route path="/:trackId/track/edit/" component={EditTrack}/>
      <Route path="/uploads/" component={UploadPage}/>
      <Route path="/videos/" component={ProfileVideos}/>
      <Route path="/tracks/" component={ProfileTracks}/>
      <Route path="/premium" component={Premium}/>
      <Route path="/billing" component={Billing}/>
      <Route path="/payment" component={Payment}/>
      <Route path="/account" component={Account}/>
      <Elements stripe={stripePromise}>
      <Route path="/get-premium" component={Subscription}/>
      </Elements>
      <Elements stripe={stripePromise}>
      <Route path="/update-payment" component={UpdatePaymentInfo}/>
      </Elements>
      </div>
      }
      </Router>
      </div>
    </BrowserRouter>
  );
} else {
  return (
    <BrowserRouter>
      <div className="App">
      <Router history={history}>
      <Route path="/mobile-privacy-policy" component={PrivacyPolicy}/>
      <Route path="/website-privacy-policy" component={WebsitePrivacyPolicy}/>
      <Route path="/mobile-terms-of-service" component={MobileTermsOfService}/>
      <NavBar2 />
      <Navbar/>
      </Router>
      </div>
      </BrowserRouter>
      )

}


}

export default App;
