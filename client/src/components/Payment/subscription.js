import React, {useState, useContext, useEffect} from 'react';
import axios from 'axios';
// MUI Components
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
// stripe
import Checkbox from '@material-ui/core/Checkbox';
import {useStripe, useElements, CardElement} from '@stripe/react-stripe-js';
// Util imports
import {makeStyles} from '@material-ui/core/styles';
// Custom Components
import CardInput from '../CardInput';
import {Auth0Context} from "../../react-auth0-spa";
import { useHistory } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import {FormControlLabel} from '@material-ui/core';




const useStyles = makeStyles({
  root: {
    maxWidth: 500,
    width: 500
    // margin: '35vh auto'
  },
  root2: {
    maxWidth: 500,
    width: 500,
    backgroundColor: 'lightgray',
    textAlign: 'left'
    // margin: '35vh auto'
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'flex-start',
  },
  title: {
    fontSize: '20px',
    color: 'black'
  },
  price: {
    fontSize: '15px',
    color: 'black'
  },
  ulClass: {
    fontSize: '13px',
  },
  cancel: {
    fontSize: '11px',
  },
  div: {
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'flex-start',
    justifyContent: 'space-between',
  },
  button: {
    margin: '2em auto 1em',
  },
  disabledBtn: {
    pointerEvents: 'none',
    margin: '2em auto 1em',
  }
});

function Subscription() {
  const classes = useStyles();
  // State
  const [email, setEmail] = useState('');
  const [switched, setSwitched] = useState(false);
  const [defaultPayment, setDefaultPayment] = useState(false);
  const [payment_method, setPaymentMethod] = useState(undefined);
  const [customer, setCustomer] = useState(undefined);
  const [subStatus, setSubStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  const stripe = useStripe();
  const elements = useElements();

  const auth0Context = useContext(Auth0Context);

  const history = useHistory();


  useEffect(() => {
    console.log()
    getUserSubscription()
    console.log(customer)
  }, [customer]);


  const handleSubmitSub = async (event) => {

    if (!stripe || !elements) {
      console.log("stripe.js hasn't loaded")
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }
    setSubmitLoading(true)

    const result = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
      billing_details: {
        email: email,
      },
    });

    stripe.createToken(elements.getElement(CardElement)).then(function(result) {
  // Handle result.error or result.token
    console.log(JSON.stringify(result))
});
  // Handle result.error or result.token
    
    if (result.error) {
      console.log(result.error.message + "result.error.message");
    } else {

    try {
      console.log("send request + handleSubmitSub")
      const res = await axios.post('https://www.hiphopvolume.com/sub', {'payment_method': result.paymentMethod.id, 'email': email, 'user_id': auth0Context.user.sub});
      // eslint-disable-next-line camelcase
      console.log(res + "res")
      console.log(status + "status")
      const {client_secret, status} = res.data;

      if (status === 'requires_action') {
        stripe.confirmCardPayment(client_secret).then(function(result) {
          if (result.error) {
            console.log('There was an issue!');
            console.log(result.error);
            // Display error message in your UI.
            // The card was declined (i.e. insufficient funds, card has expired, etc)
          } else {
            console.log('You got the money!');
            // Show a success message to your customer
          }
        });
      } else {
        console.log('You got the money!');
        alert("Success. Your purchase was made.");
        history.push("/");
        // No additional information was needed
        // Show a success message to your customer
      }
      } catch(err) {
        alert("An error occurred. Please try again.");
        console.log(err)
     }
    }
  };

  const handleSubmitSubDefault = async (event) => {
    try {
      setSubmitLoading(true)

      console.log("send request + handleSubmitSubDefault")
      const res = await axios.post('https://www.hiphopvolume.com/sub-existing-user', {'customer': customer, 'user_id': auth0Context.user.sub});
      // eslint-disable-next-line camelcase
      console.log(res + "res")
      console.log(status + "status")
      const {client_secret, status} = res.data;

      if (status === 'requires_action') {
        stripe.confirmCardPayment(client_secret).then(function(result) {
          if (result.error) {
            console.log('There was an issue!');
            console.log(result.error);
            // Display error message in your UI.
            // The card was declined (i.e. insufficient funds, card has expired, etc)
          } else {
            console.log('You got the money!');
            // Show a success message to your customer
          }
        });
      } else {
        console.log('You got the money!');
        alert("Success. Your purchase was made.");
        history.push("/");
        // No additional information was needed
        // Show a success message to your customer
      }
      } catch(err) {
        alert("An error occurred. Please try again.");
        console.log(err)
     }
  };

  const handleSubmitSubExistingCus = async (event) => {
    console.log("send request handleSubmitSubExistingCus" + payment_method)
    try {
      setSubmitLoading(true)
      const setupIntentRes = await axios.get('https://www.hiphopvolume.com/card-wallet', {'customer_id': customer});
      console.log("send request handleSubmitSubExistingCus" + payment_method)

      const result = await stripe.confirmCardSetup(setupIntentRes.data, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          email: email,
        },
       }
      });

      if (result.error) {
      alert("Error: " + result.error.message);
      window.location.reload(false);
      // Display result.error.message in your UI.
    } else {
      // The setup has succeeded. Display a success message and send
        // result.setupIntent.payment_method to your server to save the
        // card to a Customer
      const attachedPaymentResponse = await axios.post('https://www.hiphopvolume.com/attach-payment-method', {'payment_method': result.setupIntent.payment_method, 'customer_id': customer});

      const defaultPaymentResponse = await axios.post('https://www.hiphopvolume.com/update-default-payment-method', {'payment_method': result.setupIntent.payment_method, 'customer_id': customer, 'user_id': auth0Context.user.sub });


      const res = await axios.post('https://www.hiphopvolume.com/sub-existing-user', {'customer': customer, 'user_id': auth0Context.user.sub});
      // eslint-disable-next-line camelcase
      const {client_secret, status} = res.data;

      if (status === 'requires_action') {
        stripe.confirmCardPayment(client_secret).then(function(result) {
          if (result.error) {
            alert("An error occurred. Please try again.");
            window.location.reload(false);
            console.log('There was an issue!');
            console.log(result.error);
            // Display error message in your UI.
            // The card was declined (i.e. insufficient funds, card has expired, etc)
          } else {
            alert("Success. Your purchase was made.");
            history.push("/");
            console.log('You got the money!');
            // Show a success message to your customer
          }
        });
      } else {
        console.log(res)
        console.log('You got the money!');
        alert("Success. Your purchase was made.");
        history.push("/");
        // No additional information was needed
        // Show a success message to your customer
      }
      }
    } catch(err) {
        alert("An error occurred. Please try again.");
        window.location.reload(false);
        console.log(err)
     }
  };

  const getValue = async (e)=> {
    setSwitched(!switched)
  }

  const getUserSubscription = async (e)=> {
    console.log('getUserSubscription')
    const userPaymentMethodResponse = 
    await axios.get('https://www.hiphopvolume.com/get-user-payment-method', 
      { params: { user_id: auth0Context.user.sub } });
    console.log(userPaymentMethodResponse)
    if(userPaymentMethodResponse.status == 200 && userPaymentMethodResponse.data.payment_method == true) {
      setPaymentMethod(userPaymentMethodResponse.data.card)
      setDefaultPayment(true)
      setSubStatus(userPaymentMethodResponse.data.status)
      setCustomer(userPaymentMethodResponse.data.customer)
      console.log("true" + userPaymentMethodResponse)
      setLoading(false)
    } else {
      setCustomer(userPaymentMethodResponse.data.customer_id)
      setLoading(false)
      console.log("false" + userPaymentMethodResponse)
    } 
  }

if (loading) {
  return (
   <div style={{marginLeft: "20px", marginTop: "20px"}}><h3>Loading...</h3></div>
  )
} else if (subStatus == 'active') {
  return (
   <div style={{marginLeft: "20px", marginTop: "20px"}}><h3>You are already subscribed to Premium</h3></div>
  )
} else {

  return (
    <Grid
  container
  spacing={0}
  direction="column"
  alignItems="center"
  justify="center"
  style={{ minHeight: '100vh', marginTop: '-42px'}}
 >

    <div className="sub">
    <Card className={classes.root2}>
      <CardContent>
        <Typography className={classes.title}>
          Premium
        </Typography>
        <Typography className={classes.price}>
        USD $5.00/Month
        </Typography>
        <ul className={classes.ulClass}>
        <li>80GB of media data</li>
        <li>No Ads</li>
        </ul>
        <Typography className={classes.cancel}>
        Cancel Anytime
        </Typography>
      </CardContent>
    </Card>
    <br></br>
    {defaultPayment &&
    <div>
    <FormControlLabel
     control={
     <Checkbox checked={switched} color="default" onChange={(e) => getValue(e)} />
    }
    label={"Use default payment method (" + payment_method.brand + " ending in " + payment_method.last4 + ")"}/>
    </div>
    }
    <br></br>
    {switched ? (
      <div>
     <Card className={classes.root}>
      <CardContent style={{pointerEvents: 'none'}} className={classes.content}>
        <TextField
          label='Email'
          id='outlined-email-input'
          margin='normal'
          variant='outlined'
          type='email'
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
        />
        <CardInput />
      </CardContent>
    </Card>
    </div>
        ) : ( 
        <div>
      <Card className={classes.root}>
      <CardContent className={classes.content}>
        <TextField
          label='Email'
          id='outlined-email-input'
          margin='normal'
          variant='outlined'
          type='email'
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
        />
        <CardInput />
      </CardContent>
    </Card>
    </div>
        
        )}
{switched && !submitLoading &&
  <div className={classes.div}>
          <Button variant="contained" color="primary" className={classes.button} onClick={handleSubmitSubDefault}>
            Subscribe
          </Button>
        </div>
      }

{!switched && customer == undefined && !submitLoading &&
   <div className={classes.div}>
          <Button variant="contained" color="primary" className={classes.button} onClick={handleSubmitSub}>
            Subscribe
          </Button>
        </div>
}

{!switched && customer != undefined && !submitLoading &&
   <div className={classes.div}>
          <Button variant="contained" color="primary" className={classes.button} onClick={handleSubmitSubExistingCus}>
            Subscribe
          </Button>
        </div>
}

{submitLoading &&
   <div className={classes.div}>
          <Button variant="contained" disabled color="primary" className={classes.disabledBtn}>
            Subscribe
          </Button>
        </div>
}
    </div>
    
 </Grid>
  );
 }
}
export default Subscription;