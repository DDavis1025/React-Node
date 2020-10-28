import React, { Component } from "react";
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


class Billing extends Component {
  constructor(props) {
    super(props);

    this.fetchData = this.fetchData.bind(this);
 
    this.state = {
      card: null,
      payment_method: null
    };
 
  }


  componentDidMount() {
    this.fetchData() 
  }

  async fetchData() {
    const response = await axios.get(`http://localhost:8000/get-premium-user/${this.context.user.sub}`);
    console.log(JSON.stringify(response.data[0].paymentmethodid) + "response")
    const res = await axios.get('http://localhost:8000/retrieve-customer-payment-method', { params: { payment_method: response.data[0].paymentmethodid } });
    console.log(res)
    this.setState({ card: res.data.card })

    console.log(this.state.card.brand)
  }

  
  render() {
    return (
     <div>
    {this.state.card &&
     <Row>
      <Col style={{marginLeft:"auto", textAlign:"center", marginRight:"auto", minWidth:"340px", maxWidth:"500px", marginTop:"20px", marginBottom: "20px"}}>
        <Card body>
          <CardTitle>This account is billed to</CardTitle>
          <CardText><b>{this.state.card.brand}</b> ending in {this.state.card.last4}</CardText>
          <Link to="/update-payment">
          <Button>Change Card</Button>
          </Link>
        </Card>
      </Col>
      </Row>
      }        
    </div>

    );
  }
}
Billing.contextType = Auth0Context;

export default Billing;