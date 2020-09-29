const requirePromise = require('request-promise');

const receiptValidator = (request, response) => {

  console.log(request.body)

  let verificationURL = 'https://sandbox.itunes.apple.com/verifyReceipt';
  let secretKey = '518267e8a8234caf864457a1f7f52851';
  // let receiptData = request.query.receipt;
  let receiptData = request.body.receipt;
  
  const options = {
  url: verificationURL,
    method: 'POST',
    headers: {
    'User-Agent': 'Request-Promise',
    'Content-Type': 'application/x-www-form-urlencoded',
    },
    json: true
};

options.form = JSON.stringify({
    'receipt-data': receiptData,
    'password': secretKey
});

requirePromise(options).then((resData) => {
    console.log(resData);
    return resData;
}).catch(function (error) {
    console.log(error);
});

}






module.exports = {
   receiptValidator
}
