import ReactDOM from "react-dom";
import styled from 'styled-components';
import { ButtonToggle } from "reactstrap";
import { Container, Row, Col } from 'reactstrap';
import { Progress } from 'reactstrap';
import axios from 'axios';
import auth0Client from "../../Auth";
import { useAuth0 } from "../../react-auth0-spa";
import {Auth0Context} from "../../react-auth0-spa"
import { Auth0Provider } from "../../react-auth0-spa";
import Profile from '../Profile';
import { withRouter } from "react-router";
import {
   BrowserRouter as Router,
   Switch,
   Route,
   Link
} from "react-router-dom";
import {
  Card, Button, CardImg, CardTitle, CardText, CardDeck,
  CardSubtitle, CardBody, CardLink
} from 'reactstrap';
import { useHistory } from 'react-router-dom';
import React, {useState, useContext, useEffect} from 'react';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css';


function Account() {
  // State
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [card, setCard] = useState('');
  const [payment_method, setPaymentMethod] = useState('');
  const [sub, setSub] = useState('');
  const [customer, setCustomer] = useState('');

  const auth0Context = useContext(Auth0Context);

  const history = useHistory();

  const { logout } = useAuth0();

  useEffect( () => {
  	async function fetchData() {
  	try {




  	const response = await axios.get(`https://www.hiphopvolume.com/get-premium-user/${auth0Context.user.sub}`);
    console.log(response)
    if(response.status == 200 && response.data[0] != undefined) {
     setPaymentMethod(response.data[0].paymentmethodid)
     console.log(response.data[0].id)
     setSub(response.data[0].id)
     setCustomer(response.data[0].customer_id)
     if (response.data[0].paymentmethodid != undefined) {
     const payment_method_response = await axios.get('https://www.hiphopvolume.com/retrieve-customer-payment-method', { params: { payment_method: response.data[0].paymentmethodid } });
     setCard(payment_method_response.data.card)
     const res = await axios.get('https://www.hiphopvolume.com/retrieve-subscription', { params: { 'sub_id': response.data[0].id } });
     setStatus(res.data.status)
     } else {
      const res = await axios.get('https://www.hiphopvolume.com/retrieve-subscription', { params: { 'sub_id': response.data[0].id } });
      setStatus(res.data.status)
      console.log(JSON.stringify(res.data.status) + "sub res")
     }
    } else { 
    }

    console.log('created setup intent');
    } catch(err) {
        console.log(err)
    }
   }
    fetchData()
  }, []);

  async function cancelSubcription() {

    try {
    confirmAlert({
      title: 'Confirm to cancel',
      message: 'Do you want to cancel now or at the end of your period',
      buttons: [
        {
          label: 'Now',
          onClick: async () => { 
            const cancelSubcriptionNow = await axios.post('https://www.hiphopvolume.com/cancel-subscription', {'sub_id': sub, 'customer_id': customer, 'user_id': auth0Context.user.sub});
            alert('Your subscription has been canceled') 
            window.location.reload(false);
          }
        },
        {
          label: 'End of Period',
          onClick: async () => { 
            const cancelSubcriptionPeriodEnd = await axios.post('https://www.hiphopvolume.com/cancel-subscription-period-end', {'sub_id': sub});
            alert('Okay. Your subscription will be canceled at the end of this period') }
        }
      ]
    });
  // Do nothing!
    } catch(err) {
        console.log(err)
    }
   }

   async function detachPaymentMethod() {
    try {
    if (window.confirm('Are you sure you want to detach this card as your payment method')) {
      const detachPaymentMethod = await axios.post('https://www.hiphopvolume.com/detach-payment-method', {'payment_method': payment_method, 'user_id': auth0Context.user.sub, 'customer_id': customer});
      alert('Okay. Your payment method was detached');
      window.location.reload(false);
  // Save it!
    } else {
  // Do nothing!
    console.log('Cancel was clicked');
    }
  // Do nothing!
    } catch(err) {
        console.log(err)
    }
   }
  
   async function deleteAccount() {
    try {
    if (status == 'active') {
    if (window.confirm('Deleting your account will cancel your subscription')) {
     deleteAccountFunction()
  // Save it!
    } else {
  // Do nothing!
    console.log('Cancel was clicked');
    } 
  } else {
    if (window.confirm('Are you sure you want to delete your account?')) {
     deleteAccountFunction()
  // Save it!
    } else {
     
    }
  }
  // Do nothing!
    } catch(err) {
        console.log(err)
    }
   }

  async function deleteAccountFunction() {
    try {

      const deleteAuth0Account = await axios.post(`https://www.hiphopvolume.com/deleteAuth0Account/${auth0Context.user.sub}`);

      console.log("deleteAuth0Account" + deleteAuth0Account)

      const deleteAccountData = await axios.delete(`https://www.hiphopvolume.com/deleteAccountData/${auth0Context.user.sub}`);

      console.log("deleteAccountData" + deleteAccountData)

      if (sub) {
        const deleteSubscription = await axios.delete('https://www.hiphopvolume.com/deleteSubscription', {'sub_id': sub });
      }


      alert('Okay. Your account was deleted');

      logout({
        return_to: "https://www.hiphopvolume.com/"
      })

      // history.push('/');
    } catch(err) {
      console.log(err)
    }
  }


  return (
    <div>
    <div>
    {card &&
     <Row>
      <Col style={{position: 'relative',
      left: '40px', minWidth:"340px", maxWidth:"500px", marginTop:"20px", marginBottom: "20px", textAlign: 'left'}}>
      <h2>Billing</h2>
        <Card body>
          <CardTitle>This account is billed to</CardTitle>
          <CardText><b>{card.brand}</b> ending in {card.last4}</CardText>
          <Link to="/update-payment">
          <Button style={{marginRight: "10px"}}>Change Card</Button>
          </Link>
          <br></br>
          {status != 'active' && 
          <Button style={{width: "100px"}} onClick={detachPaymentMethod} size="sm">Detach Card</Button>
          }
        </Card>
      </Col>
      </Row>
      }        
    </div>
    <div>
     <Row>
      <Col style={{position: 'relative',
      left: '40px', minWidth:"340px", maxWidth:"500px", marginTop:"20px", marginBottom: "20px"}}>
      <h2>Your Plan</h2>
        <Card body>
        {status == 'active' ? (
        <div>
          <CardTitle><h3><b>Premium</b></h3></CardTitle>
          <ul style={{textAlign: "left", marginLeft: '-19px'}} className="premiumUL">
          <li>80GB of media data</li>
          <li>No Ads</li>
          </ul>
          <CardText></CardText>
          <Button onClick={cancelSubcription}>Cancel</Button>
          </div>
        ) : ( 
        <div>
        <CardTitle><h3><b>Free</b></h3></CardTitle>
          <CardText></CardText>
          <Link to="/premium">
          <Button>Get Premium</Button>
          </Link>
          </div>
          )}
        </Card>
      </Col>
      </Row>     
    </div>
    <div>
     <Row>
      <Col style={{position: 'relative',
      left: '40px', minWidth:"340px", maxWidth:"500px", marginTop:"20px", marginBottom: "20px"}}>
        <Card body>
        <div>
          <CardTitle><h3><b>Delete Account</b></h3></CardTitle>
          <CardText></CardText>
          <Button onClick={deleteAccount}>Delete</Button>
          </div>
        </Card>
      </Col>
      </Row>     
    </div>

     <div>
     <Row>
      <Col style={{position: 'relative',
      left: '40px', minWidth:"340px", maxWidth:"500px", marginTop:"20px", marginBottom: "20px"}}>
        <Card body>
        <div>
          <CardTitle><h3><b>Copyright Infringing Content</b></h3></CardTitle>
          <CardText></CardText>
          <CardLink href={"/copyright_infringment/albums/"}>
          <Button>View</Button>
          </CardLink>
          </div>
        </Card>
      </Col>
      </Row>     
    </div>
    </div>
  	

  );
 };
export default Account;