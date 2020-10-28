import React, {useState, useContext, useEffect} from 'react';
import axios from 'axios';
// MUI Components
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
// stripe
import {useStripe, useElements, CardElement} from '@stripe/react-stripe-js';
// Util imports
import {makeStyles} from '@material-ui/core/styles';
// Custom Components
import CardInput from '../CardInput';
import {Auth0Context} from "../../react-auth0-spa";
import { useHistory } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';




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
  disabled: {
  	display: 'flex',
    flexDirection: 'column',
    alignContent: 'flex-start',
  	pointerEvents: 'none',
  }
});

function UpdatePaymentInfo() {
  const classes = useStyles();
  // State
  const [email, setEmail] = useState('');
  const [customer_id, setCustomerID] = useState('');
  const [client_secret, setClientSecret] = useState('');
  const [loading, setLoading] = useState('');


  const stripe = useStripe();
  const elements = useElements();

  const auth0Context = useContext(Auth0Context);

  const history = useHistory();

  useEffect( () => {
  	async function fetchData() {
  	try {
  	const response = await axios.get(`http://localhost:8000/get-premium-user/${auth0Context.user.sub}`);
  	console.log(response)
    setCustomerID(response.data[0].customer_id)
    const res = await axios.get('http://localhost:8000/card-wallet', {'customer_id': customer_id});
    setClientSecret(res.data)
    console.log(JSON.stringify(res.data) + "res")

    console.log('created setup intent');
    } catch(err) {
        console.log(err)
    }
   }
    fetchData()
  }, []);


  const handleSubmitPaymentMethod = async (event) => {
    if (!stripe || !elements) {
      console.log("stripe.js hasn't loaded")
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }
    try {

    const result = await stripe.confirmCardSetup(client_secret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          email: email,
        },
      }
    });

    setLoading(true)
  // Handle result.error or result.token
    
    if (result.error) {
      console.log(JSON.stringify(result.error) + "result.error")
      setLoading(false)
      alert("Error: " + result.error.message);
      window.location.reload(false);
      // Display result.error.message in your UI.
    } else {
    	// The setup has succeeded. Display a success message and send
        // result.setupIntent.payment_method to your server to save the
        // card to a Customer
    	console.log(result)
    	const attachedPaymentResponse = await axios.post('http://localhost:8000/attach-payment-method', {'payment_method': result.setupIntent.payment_method, 'customer_id': customer_id});
    	console.log(attachedPaymentResponse)
  	    const defaultPaymentResponse = await axios.post('http://localhost:8000/update-default-payment-method', {'payment_method': result.setupIntent.payment_method, 'customer_id': customer_id, 'user_id': auth0Context.user.sub });
        console.log(defaultPaymentResponse)
        setLoading(false)
        alert("Success: You changed your default payment method");
        history.push("/billing");

    }
   } catch(err) {
     console.log(err)
   }
  };

  if (loading) {
    return (
  	<div>
    <Grid
  container
  spacing={0}
  direction="column"
  alignItems="center"
  justify="center"
  style={{ minHeight: '100vh', marginTop: '-38px'}}
 >
    <h3>Update Default Payment Method</h3>
<br></br>
    <Card className={classes.root}>
      <CardContent className={classes.disabled}>
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
        <CardInput/>
        <div className={classes.div}>
          <Button variant="contained" color="primary" className={classes.button} onClick={handleSubmitPaymentMethod}>
            Loading...
          </Button>
        </div>
      </CardContent>
    </Card>
    
 </Grid>
 </div>
  );
  } else {

  return (
  	<div>
    <Grid
  container
  spacing={0}
  direction="column"
  alignItems="center"
  justify="center"
  style={{ minHeight: '100vh', marginTop: '-38px'}}
 >
<h3>Update Default Payment Method</h3>
<br></br>
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
        <CardInput/>
        <div className={classes.div}>
          <Button variant="contained" color="primary" className={classes.button} onClick={handleSubmitPaymentMethod}>
            Submit
          </Button>
        </div>
      </CardContent>
    </Card>
    
 </Grid>
 </div>
  );
 }
}
export default UpdatePaymentInfo;