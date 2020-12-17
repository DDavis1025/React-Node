const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const rateLimit = require("express-rate-limit");
const db = require('./queries');
const album = require('./albums');
const image = require('./image-upload');
const apiCall = require('./test');
const artist = require('./artist')
const query = require('./query');
const video = require('./video');
const track = require('./track');
const comment = require('./comments');
const notification = require('./notifications');
const payment = require('./payment');
const submissions = require('./submissions');
const copyright = require('./copyright');
const port = 8000;
var multer = require('multer');
var jwt = require('express-jwt');
var jwks = require('jwks-rsa');
var aws = require('aws-sdk');
var multerS3 = require('multer-s3');
var info = require('./info');
var receiptValidator = require('./receiptValidation');
require('dotenv').config()



// var jwtCheck = jwt({
//   secret: jwks.expressJwtSecret({
//     cache: true,
//     rateLimit: true,
//     jwksRequestPerMinute: 5,
//     jwksUri: 'https://dev-owihjaep.auth0.com/.well-known/jwks.json'
//   }),
//   audience: 'https://dillonsapi.com',
//   issuer: 'https://dev-owihjaep.auth0.com/',
//   algorithms: ['RS256']
// });

// app.use(jwtCheck);

aws.config.update({
    secretAccessKey: process.env.IAM_USER_SECRET,
    accessKeyId: process.env.IAM_USER_KEY,
    region: 'us-east-1'
});

var s3 = new aws.S3();

exports.s3 = s3;

app.get('/authorized', function (req, res) {
    res.send('Secured Resource');
});


// var storage = multer.diskStorage({
// 	destination: (req, file, cb) => {
// 		cb(null, 'public')
// 	}, 
// 	filename: (req, file, cb) => {
// 		cb(null, Date.now() + '-' +file.originalname)
// 	}
// })

var storage = multerS3 ({
        s3: s3,
        bucket: info.BUCKET_NAME,
        key: function (req, file, cb) {
            console.log(file);
            cb(null, Date.now() + '-' + file.originalname); //use Date.now() for unique file keys
        }
    });

// var storage = multer.diskStorage({
// 	destination: (req, file, cb) => {
// 		cb(null, 'public')
// 	}, 
// 	filename: (req, file, cb) => {
// 		cb(null, Date.now() + '-' +file.originalname)
// 	}
// })



var upload = multer({ storage: storage }).fields([{
           name: 'file', maxCount: 1
         }, {
           name: 'songs', maxCount: 30
         }, {
           name: 'video', maxCount: 1
         }, {
           name: 'track', maxCount: 1
         }]);

app.use(bodyParser.urlencoded({extended: true}));

app.use(bodyParser.json())

app.use(cors());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); 
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Credentials', true);
  next();
});

const apiLimiter = rateLimit({
  windowMs: 20 * 60 * 1000, // 30 minutes
  max: 3,
  message:
    "Too many requests sent. Please wait 20 minutes before trying again."
});



app.use(express.static(path.join(__dirname, 'client/build')));

app.get("/", (req, res) => {
 res.sendFile(path.join(__dirname, "public", "index.html"));
});


// app.get('/', (request, response) => {
//   response.json({ info: 'Node.js, Express, and Postgres API' })
// })

//SONGS ROUTES
app.get('/songs', db.getSongs)
// app.get('/albums/:album_id/songs', db.getSongsByAlbumId)
app.get('/songs/:id', db.getSongById);
// app.post('/albums/:id/songs', db.addSong)
// app.put('/songs/:id', db.updateSong)
// app.post('/albums/:id/songs', db.upsertSong)
// app.put('/songs/:id', db.upsertSong)
// app.delete('/albums/:album_id/songs/', db.deleteSong)

//ALBUMS ROUTES
// app.get('/albums', album.getAlbums)


app.get('/albums', query.getAll);
app.get('/albums/:id', query.getAllByID);
app.get('/artist/:id', artist.getArtistByID);
app.get('/allArtist/:id', artist.getAllArtistByID);
app.get('/following/:id', artist.getFollowingByUserId);
app.get('/follows/:id', artist.getFollowedByFollowerID);
app.get('/user/:id', artist.getUserImageByID);
app.get('/video/:id', video.getVideoByID);
app.get('/track/:id', track.getTrackByID);
app.get('/artist/video/:id', video.videoByArtistID);
app.get('/allArtist/video/:id', video.allVideoByArtistID);
app.get('/artist/track/:id', track.trackByArtistID);
app.get('/allArtist/track/:id', track.allTrackByArtistID);
app.get('/videos', video.getAllVideos);
app.get('/video_path/:id', video.getVideoPathByID);
app.get('/tracks', track.getAllTracks);
app.get('/trackAndImage/:id', track.trackPathAndImageByID);
app.get('/comments/:id', comment.getCommentsByMediaId);
app.get('/subComments/:id', comment.getSubCommentsByParentId);
app.get('/commentLikes/:id', comment.getCommentLikesByCommentID);
app.get('/commentLikesByUserID/:comment_id/:user_id', comment.getCommentLikesByUserID);
app.get('/singleComment/:id/:user_id', comment.addedComment);
app.get('/commentByUser/:id/:user_id', comment.getCommentsByUser);
app.get('/getNotications/:id', notification.getNoticationsByUser);
app.get('/getPostImage/:id', notification.getPostImageById);
app.get('/getSongData/:id', notification.getAlbumSongData);
app.get('/getSubCommentsNotications/:id/:second_id', notification.getSubCommentNotificationByIDs);
app.get('/getSubCommentsNoticationsById/:id', notification.getSubCommentNotificationByID);
app.get('/getComment/:id', comment.getCommentById);
app.get('/getParentSubCommentAndReply/:reply_id/:parent_subID', notification.getParentSubCommentAndReply);
app.get('/postLikeByUserID/:post_id/:supporter_id', query.getPostLikeByUser);
app.get('/getLikesByPostID/:post_id', query.getLikesByPostID);
app.get('/getTrackAuthor/:id', track.getTrackAuthor);
app.get('/getByPostID/:id', notification.getPostById);
app.get('/getAuthorByPostID/:id', comment.getAuthorByPostId);
app.get('/getFollower/:user_id/:follower_id', artist.getFollower);
app.get('/getCommentLikes/:comment_id/', comment.getCommentLikes);
app.get('/getNewNotifications/:id/', notification.getNewNoticationsByUser);
app.get('/getUserInfo/:user_id/', artist.getUserInfo);
app.get('/getUsername/:username/', artist.checkUsername);
app.get('/verifyReceipt/:receipt/', receiptValidator.receiptValidator);
app.get('/purchase/:user_id/:productIdentifier', artist.getPurchase);
app.get('/dataUsage/:user_id', artist.getDataUsage);
app.get('/get-premium-user/:user_id', payment.getUserPremium);
app.get('/card-wallet', payment.createSetupIntent);
app.get('/list-payment-methods', payment.listPaymentMethods);
app.get('/retrieve-customer-payment-method', payment.retrievePaymentMethod);
app.get('/retrieve-customer', payment.retrieveCustomer);
app.get('/retrieve-subscription', payment.retrieveSubscription);
app.get('/get-user-payment-method', payment.getAuthUserPaymentMethod);
app.get('/checkCopyrightInfringement/:user_id', artist.checkForCopyrightInfringement);
app.get('/getSubmissions', submissions.getSubmissions);
app.get('/declinedSubmissions', submissions.declinedSubmissions);
app.get('/acceptedSubmissions', submissions.acceptedSubmissions);
app.get('/getAuth0User/:user_id', submissions.getAuth0User);
app.get('/albums/copyright_infringing/:user_id', copyright.copyrightInfringingAlbumsByArtist);
app.get('/videos/copyright_infringing/:user_id', copyright.copyrightInfringingVideosByArtist);
app.get('/tracks/copyright_infringing/:user_id', copyright.copyrightInfringingTracksByArtist);
app.get('/songs/copyright_infringing/:album_id', copyright.copyrightInfringingSongByAlbum);

// app.get('/test/:id', apiCall.testGet);
app.post('/follower', artist.addFollower);
app.post('/userImageUpload', upload, artist.upsertUserImage);
app.post('/comment', comment.addData)
app.post('/sub_comment', comment.addSubComment)
app.post('/addCommentLike', comment.addCommentLike)
app.post('/subCommentLike/:id', comment.updateSubCommentIsLiked)
app.post('/postSubCommentNoticationIDs/:id/:second_id', notification.getSubCommentNotificationByIDs);
app.post('/postLike/', query.addPostLike);
app.post('/updateUserInfo/', artist.updateUserInfo);
app.post('/verifyReceipt', receiptValidator.receiptValidator);
app.post('/purchase', artist.addPurchase);
app.post('/payment', payment.stripePayment);
app.post('/sub', payment.subscription);
app.post('/sub-existing-user', payment.subscriptionDefaultPayment);
app.post('/update-default-payment-method', payment.updateDefaultPaymentMethod);
app.post('/attach-payment-method', payment.attachPaymentMethodToCustomer);
app.post('/cancel-subscription', payment.cancelSubscription);
app.post('/cancel-subscription-period-end', payment.cancelSubscriptionPeriodEnd);
app.post('/webhooks', payment.webhooks);
app.post('/detach-payment-method', payment.detachDefaultPaymentMethod);
app.post('/deleteAuth0Account/:user_id', artist.deleteAuth0Account);
app.post('/emailVerification', apiLimiter, artist.emailVerification);
app.post('/setCopyrightInfringementTrueTrack/:user_id/:item_id', copyright.setCopyrightInfringementTrueTrack);
app.post('/setCopyrightInfringementTrueTrackImage/:user_id/:item_id/:item_image_id', copyright.setCopyrightInfringementTrueTrackImage);
app.post('/setCopyrightInfringementFalseTrackImage/:item_id/:item_image_id', copyright.setCopyrightInfringementFalseTrackImage);
app.post('/setCopyrightInfringementFalseTrack/:item_id', copyright.setCopyrightInfringementFalseTrack);
app.post('/setCopyrightInfringementTrueVideo/:user_id/:item_id', copyright.setCopyrightInfringementTrueVideo);
app.post('/setCopyrightInfringementFalseVideo/:item_id', copyright.setCopyrightInfringementFalseVideo);
app.post('/setCopyrightInfringementTrueAlbum/:user_id/:item_id/:item_song_id', copyright.setCopyrightInfringementTrueAlbum);
app.post('/setCopyrightInfringementFalseAlbum/:item_id/:item_song_id', copyright.setCopyrightInfringementFalseAlbum);
app.post('/setCopyrightInfringementTrueAlbumImage/:user_id/:album_id/:item_id', copyright.setCopyrightInfringementTrueAlbumImage);
app.post('/setCopyrightInfringementFalseAlbumImage/:album_id/:item_id', copyright.setCopyrightInfringementFalseAlbumImage);

// app.get('/albums/:id/songs', apiCall.selectSongs);
// app.post('/albums/', apiCall.addData);
// app.post('/tokenRequest', options, query.tokenRequest);

app.post('/albums/:id', upload, apiCall.upsertAlbum);
app.put('/albums/:id', upload, apiCall.upsertAlbum);
app.put('/video/:id', upload, video.updateVideoByID);
app.put('/track/:id', upload, track.updateTrackByID);
app.put('/acceptSubmission/:type/:item_id', submissions.acceptSubmission);
app.put('/declineSubmission/:type/:item_id', submissions.declineSubmission);
// app.delete('/albums/:id', album.deleteAlbum)

// app.get('/albums/:id/images', image.getImageByAlbumId)
app.post('/albums', upload, apiCall.addData);
app.post('/video', upload, video.addData);
app.post('/track', upload, track.addData);

// app.post('/upload', image.upsertImage);

// app.put('/albums', apiCall.addData);
app.delete('/albums/:id/songs', apiCall.deleteSongs);
app.delete('/albums/:id/', apiCall.deleteAll);
app.delete('/following/:user_id/:follower_id', artist.deleteFollowing);
app.delete('/video/:id', video.deleteVideo);
app.delete('/track/:id', track.deleteTrack);
app.delete('/deleteCommentLike/:comment_id/:user_id', comment.deleteCommentLike);
app.delete('/deleteComment/:comment_id/:user_id', comment.deleteComment);
app.delete('/deleteSubComment/:comment_id/:user_id', comment.deleteSubComment);
app.delete('/deletePostLike/:post_id/:supporter_id', query.deletePostLike);
app.delete('/cancel-subscription', payment.cancelSubscription);
app.delete('/deleteAccountData/:user_id', artist.deleteAccountData);
app.delete('/deleteSubscription', artist.deleteSubscription);
app.delete('/removeProfile/:user_id', artist.removeProfile);



app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});








app.listen(process.env.PORT || port, () => {
  console.log(`App running on port ${port}.`)
})


// app.listen(port, () => {
//   console.log(`App running on port ${port}.`)
// })


module.exports = {
  express,
  app,
}
