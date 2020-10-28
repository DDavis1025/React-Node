const db = require('./queries');
require('dotenv').config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const uuid = require("uuid/v4");

const stripePayment = (request, response) => {
	const {product, token} = request.body;
	const idempontencyKey = uuid();

  console.log("token" + JSON.stringify(token))

	return stripe.customers.create({
    email: token.email,
    source: token.id
  }).then((customer) => {
  	stripe.charges.create({
  		amount: product.price * 100,
  		currency: "usd",
  		customer: customer.id,
  		receipt_email: token.email
  	}, {idempontencyKey})
  }).then((result) => {
  	console.log("status 200")
  	response.status(200).json(result)
  }).catch((err) => {
  	console.log(err)
  })
  
}

const subscription = async (req, res) => {
  const {email, payment_method, user_id} = req.body;
  console.log(payment_method)

try {
  const customer = await stripe.customers.create({
    payment_method: payment_method,
    email: email,
    invoice_settings: {
      default_payment_method: payment_method,
    },
  });

  const subscription = await stripe.subscriptions.create({
    customer: customer.id,
    items: [{ plan: 'price_1HZhIpB9lEAzymezwyatLvnO' }],
    expand: ['latest_invoice.payment_intent']
  });
  
  const status = subscription['latest_invoice']['payment_intent']['status'] 
  const client_secret = subscription['latest_invoice']['payment_intent']['client_secret']

  console.log("subscription" + JSON.stringify(subscription));

  const insertUserSubscription = await db.pool.query(
     	'INSERT INTO subscriptions (user_id, plan, id, customer_id, paymentMethodID, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
     	 [user_id, 'price_1HhKnJB9lEAzymezY2UsqC1b', subscription.id, subscription.customer, subscription.latest_invoice.payment_intent.payment_method, subscription.status])

  const dataUsage = await updateDataUsage(user_id)

  console.log(insertUserSubscription.rows)

  res.json({'client_secret': client_secret, 'status': status});

} catch(err) {
	res.status(500).send({ message: `An error occurred`});
	console.log(err)
}
}

const subscriptionDefaultPayment = async (req, res) => {
  const {customer, user_id} = req.body;

try {
  const subscription = await stripe.subscriptions.create({
    customer: customer,
    items: [{ plan: 'price_1HZhIpB9lEAzymezwyatLvnO' }],
    expand: ['latest_invoice.payment_intent']
  });
  
  const status = subscription['latest_invoice']['payment_intent']['status'] 
  const client_secret = subscription['latest_invoice']['payment_intent']['client_secret']

  console.log("subscription" + JSON.stringify(subscription));

  const updateSubscription = db.pool.query(
       'UPDATE subscriptions SET id = $1, status = $2 WHERE user_id = $3 AND customer_id = $4 AND plan = $5', 
       [subscription.id, subscription.status, user_id, customer, 'price_1HhKnJB9lEAzymezY2UsqC1b'])

  const dataUsage = await updateDataUsage(user_id)

  console.log("DataUsage" + JSON.stringify(dataUsage))

  console.log(updateSubscription.rows)

  res.json({'client_secret': client_secret, 'status': status});

} catch(err) {
  res.status(500).send({ message: `An error occurred`});
  console.log(err)
}
}




const retrievePaymentMethod = async (req, res) => {
  try {
  const {payment_method} = req.query;
  const paymentMethod = await stripe.paymentMethods.retrieve(
  payment_method
  );
  res.send(paymentMethod);
  } catch(err) {
    console.log(err)
  }
};

const updateDefaultPaymentMethod = async (req, res) => {
console.log("updateDefaultPaymentMethod" + JSON.stringify(req.body));
const {payment_method, customer_id, user_id} = req.body;
try {
  const customer = await stripe.customers.update(
  customer_id,
  {invoice_settings: {default_payment_method: payment_method}}
);
  const updateAuthPaymentMethod = db.pool.query(
    'UPDATE subscriptions SET paymentmethodid = $1 WHERE user_id = $2 AND customer_id = $3', 
    [payment_method, user_id, customer_id])

  res.status(200).send({ message: "Success: Set payment_method as default_payment_method" });
} catch(err) { 
      console.log(err)
      res.status(500).send({ message: `An error occurred`});
    }
}

const getUserPremium = async (request, response) => {
    let user_id = request.params.user_id

  try {
    let results = await db.pool.query(
        'SELECT * FROM subscriptions WHERE user_id = $1 AND plan = $2',
        [user_id, 'price_1HhKnJB9lEAzymezY2UsqC1b'])
        response.status(200).json(results.rows)
    } catch(err) { 
      console.log(err)
    }
}

const getAuthUserPaymentMethod = async (request, response) => {
    const {user_id} = request.query;

  try {
    let results = await db.pool.query(
        'SELECT * FROM subscriptions WHERE user_id = $1',
        [user_id])

     if (results.rowCount > 0 && results.rows[0].paymentmethodid != undefined) {
        let paymentMethod = await stripe.paymentMethods.retrieve(
        results.rows[0].paymentmethodid
        );
      console.log(paymentMethod)
      var status = { status: results.rows[0].status };
      var pm = { payment_method: true };
      paymentMethod = {...paymentMethod, ...pm, ...status};
      console.log(JSON.stringify(paymentMethod))
      response.status(200).json(paymentMethod)
     } else if (results.rowCount > 0) {
      console.log(results)
      results.rows[0].payment_method = false
      response.status(200).json(results.rows[0])
     } else {
      response.status(200).send({ message: `No data`});
     }


    } catch(err) { 
      response.status(500).send({ message: `An error occurred`});
      console.log(err)
    }
}


const createSetupIntent = async (request, response) => {
  const {customer_id} = request.body;
  const intent =  await stripe.setupIntents.create({
    customer: customer_id,
    usage: 'off_session',
  });
  response.send(intent.client_secret);
}


const listPaymentMethods = async (request, response) => {
  try {
  const customer = await stripe.customers.retrieve(
  'cus_IBsMvtEPozOOsL'
  );
  response.send(customer);
} catch(err) {
  
}
}

const retrieveCustomer = async (request, response) => {
  const {customer_id} = request.body;
  try {
  const customer = await stripe.customers.retrieve(
  customer_id
  );
  response.send(customer);
} catch(err) {
  
}
}

const attachPaymentMethodToCustomer = async (request, response) => {
  const {customer_id, payment_method} = request.body;
  try {
    const paymentMethod = await stripe.paymentMethods.attach(
    payment_method,
    {customer: customer_id}
    );
    response.send(paymentMethod);
  } catch(err) {
   response.status(500).send({ message: `An error occurred`});
 }
}

const retrieveSubscription = async (request, response) => {
  try {
  const {sub_id} = request.query;
  const subscription = await stripe.subscriptions.retrieve(
  sub_id
  );
  response.send(subscription);
  } catch(err) {
    console.log(err)
  }
}

const cancelSubscriptionPeriodEnd = async (request, response) => {
  const {sub_id} = request.body;
  try {
  const subscriptionUpdate = await stripe.subscriptions.update(sub_id, {cancel_at_period_end: true});

  response.status(200).send({ message: "Success: You canceled a subscription at period end" });
  } catch(err) {
    console.log(err)
  }
}

const cancelSubscription = async (request, response) => {
  const {sub_id, user_id, customer_id} = request.body;
  try {
  const updateAuthPaymentMethod = db.pool.query(
    'UPDATE subscriptions SET status = $1 WHERE id = $2 AND user_id = $3 AND customer_id = $4', 
    ['canceled', sub_id, user_id, customer_id])
  const deleted = await stripe.subscriptions.del(
  sub_id
  );

  const dataUsage = await updateDataUsage(user_id)

  response.status(200).send({ message: "Success: You canceled a subscription" });
  } catch(err) {
    console.log(err)
  }
}


const webhooks = async (request, response) => {
  const event = request.body;

  switch (event.type) {
    case 'customer.subscription.updated':
      console.log("event sub_id" + event.data.object.id)
      console.log("event customer_id" + event.data.object.customer)
      console.log("event status" + event.data.object.status)
      if (event.data.object.status == 'canceled') {
      const updateAuthPaymentMethod = db.pool.query(
       'UPDATE subscriptions SET status = $1 WHERE id = $2 AND customer_id = $3', 
       [event.data.object.status, event.data.object.id, event.data.object.customer])

      const dataUsage = await updateDataUsage(user_id)

      response.status(200).send({ message: "Success: You updated a user subscription to canceled" });
      }
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  
}

const detachDefaultPaymentMethod = async (request, response) => {
 const {payment_method, user_id, customer_id} = request.body;
  try {
  const updateAuthPaymentMethod = db.pool.query(
    'UPDATE subscriptions SET paymentmethodid = $1 WHERE user_id = $2 AND customer_id = $3', 
    [null, user_id, customer_id])
  const paymentMethod = await stripe.paymentMethods.detach(
    payment_method
  );
  response.status(200).send({message: "Success: You detached a payment method"});
  } catch(err) {
    console.log(err)
  }
  
}

const updateDataUsage = async (user_id) => {
      let fileSize = await db.pool.query(
            'UPDATE file SET size = $1 WHERE user_id = $2',
            [0, user_id])
      let songsSize = await db.pool.query(
            'UPDATE songs SET size = $1 WHERE user_id = $2',
            [0, user_id])
      let trackSize = await db.pool.query(
            'UPDATE track SET size = $1 WHERE author = $2',
            [0, user_id])
      let trackImagesSize = await db.pool.query(
            'UPDATE track_images SET size = $1 WHERE author = $2',
            [0, user_id])
      let userImagesSize = await db.pool.query(
            'UPDATE user_images SET size = $1 WHERE user_id = $2',
            [0, user_id])
      let videoSize = await db.pool.query(
            'UPDATE video SET size = $1 WHERE author = $2',
            [0, user_id])
      let videoImagesSize = await db.pool.query(
            'UPDATE video_thumbnails SET size = $1 WHERE author = $2',
            [0, user_id])
      let all = fileSize.rows.concat(songsSize.rows, trackSize.rows, trackImagesSize.rows,
       userImagesSize.rows, videoSize.rows, videoImagesSize.rows);

      return all;
    
}







module.exports = {
   stripePayment,
   subscription,
   updateDefaultPaymentMethod,
   getUserPremium,
   retrievePaymentMethod,
   createSetupIntent,
   listPaymentMethods,
   attachPaymentMethodToCustomer,
   retrieveCustomer,
   retrieveSubscription,
   cancelSubscription,
   cancelSubscriptionPeriodEnd,
   webhooks,
   getAuthUserPaymentMethod,
   subscriptionDefaultPayment,
   detachDefaultPaymentMethod
}