import React, { Component } from "react";
import ReactDOM from "react-dom";
import axios from 'axios';
import auth0Client from "../../Auth";
import { useAuth0 } from "../../react-auth0-spa";
import {Auth0Context} from "../../react-auth0-spa"
import { Auth0Provider } from "../../react-auth0-spa";
import StripeCheckout from "react-stripe-checkout";
import { Button } from 'reactstrap';




class Payment extends Component {
  constructor(props) {
    super(props);

    this.makePayment = this.makePayment.bind(this);

    this.state = {
      product: {
        name: "Premium",
        price: 5.50
      }
    };

  }

    makePayment = token => {
      let product = this.state.product
      const body = {
        token,
        product
      }
      const headers = {
        "Content-Type": "application/json"
      }
      return fetch('/payment', {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body)
      }).then((response)=> {
        console.log("RESPONSE ", response)
        const {status} = response;
        console.log("STATUS", status)
      })
      .catch(error => console.log(error))
    }
 

  

  
  render() {
    return (
       <StripeCheckout stripeKey={process.env.REACT_APP_PUBLISHABLE_KEY} token={this.makePayment} name="Premium"
       >
       <Button style={{position: "fixed",
        top: "50%",
        left: "50%"}} color="primary" size="lg">Purchase Premium</Button>
       </StripeCheckout>
     
    );
  }
}

Payment.contextType = Auth0Context;

export default Payment;