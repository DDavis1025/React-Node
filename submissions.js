const db = require('./queries');
const uuidv4 = require('uuid/v4');
var comments = require('./comments');
var axios = require("axios").default;
require('dotenv').config();


const getSubmissions = (request, response) => {

  db.pool.query(
    'SELECT albums.id, title, date, time_added, albums.type, path FROM albums JOIN file ON albums.id = file.album_id WHERE albums.accepted IS NULL AND albums.declined IS NULL UNION ALL SELECT fields.id, title, date, time_added, fields.type, path FROM fields JOIN track_images ON fields.id = track_images.id  WHERE fields.accepted IS NULL AND fields.declined IS NULL UNION ALL SELECT fields.id, title, date, time_added, fields.type, path FROM fields JOIN video_thumbnails ON fields.id = video_thumbnails.id WHERE fields.accepted IS NULL AND fields.declined IS NULL ORDER BY time_added DESC')
    .then(results => {
      response.status(200).json(results.rows)
    }).catch(error => console.log(error));
}

const acceptedSubmissions = (request, response) => {

  db.pool.query(
    'SELECT albums.id, title, date, time_added, albums.type, path FROM albums JOIN file ON albums.id = file.album_id WHERE albums.accepted IS TRUE UNION ALL SELECT fields.id, title, date, time_added, fields.type, path FROM fields JOIN track_images ON fields.id = track_images.id  WHERE fields.accepted IS TRUE UNION ALL SELECT fields.id, title, date, time_added, fields.type, path FROM fields JOIN video_thumbnails ON fields.id = video_thumbnails.id WHERE fields.accepted IS TRUE ORDER BY time_added DESC')
    .then(results => {
      response.status(200).json(results.rows)
    }).catch(error => console.log(error));
}

const declinedSubmissions = (request, response) => {

  db.pool.query(
    'SELECT albums.id, title, date, time_added, albums.type, path FROM albums JOIN file ON albums.id = file.album_id WHERE albums.declined IS TRUE UNION ALL SELECT fields.id, title, date, time_added, fields.type, path FROM fields JOIN track_images ON fields.id = track_images.id  WHERE fields.declined IS TRUE UNION ALL SELECT fields.id, title, date, time_added, fields.type, path FROM fields JOIN video_thumbnails ON fields.id = video_thumbnails.id WHERE fields.declined IS TRUE ORDER BY time_added DESC')
    .then(results => {
      response.status(200).json(results.rows)
    }).catch(error => console.log(error));
}

const getAuth0User = async (request, response) => {
    const user_id = request.params.user_id;
    try {
 
      var options = {
       method: 'POST',
       url: 'https://dev-owihjaep.auth0.com/oauth/token',
       headers: {'content-type': 'application/json'},
       data: {
         grant_type: 'client_credentials',
         client_id: 'RGPTciPqTAlJSDoO3zkL4GT1HV3fsptj',
         client_secret: process.env.AUTH0_CLIENT_SECRET,
         audience: 'https://dev-owihjaep.auth0.com/api/v2/'
      }
     };


     let accessTokenResponse = await axios.request(options)

     var auth0UserOptions = {
     method: 'GET',
     url: `https://dev-owihjaep.auth0.com/api/v2/users/${user_id}`,
     headers: {'content-type': 'application/json', authorization: 'Bearer ' + accessTokenResponse.data.access_token}
    };

    let auth0UserResponse = await axios.request(auth0UserOptions)

    console.log(auth0UserResponse)

    response.status(200).json(auth0UserResponse.data)
  } catch(err) {
    console.log(err)
  }
}


const acceptSubmission = async (request, response) => {
  const { type, item_id } = request.params;

  console.log(type + item_id)

  try {
   if (type == 'track' || type == 'video') {
   let acceptTrackOrVideo = await db.pool.query(
            'UPDATE fields SET accepted = $1 WHERE id = $2',
            [true, item_id])

   let setDeclinedFalse = await db.pool.query(
            'UPDATE fields SET declined = $1 WHERE id = $2',
            [false, item_id])

    response.status(200).send({ message: `Success: accepted a ${type} submission` });
   } else if (type == 'album') {
    let acceptAlbum = await db.pool.query(
            'UPDATE albums SET accepted = $1 WHERE id = $2',
            [true, item_id])

    let setDeclinedFalse = await db.pool.query(
            'UPDATE albums SET declined = $1 WHERE id = $2',
            [false, item_id])

    response.status(200).send({ message: `Success: accepted a ${type} submission` });
   }
  } catch(error) {
    console.log(error)
  }
}



const declineSubmission = async (request, response) => {
  const { type, item_id } = request.params;

  try {
   if (type == 'track' || type == 'video') {
   let declineTrackOrVideo = await db.pool.query(
            'UPDATE fields SET declined = $1 WHERE id = $2',
            [true, item_id])

   let setAcceptedFalse = await db.pool.query(
            'UPDATE fields SET accepted = $1 WHERE id = $2',
            [false, item_id])

    response.status(200).send({ message: `Success: declined a ${type} submission` });
   } else if (type == 'album') {
    let declineAlbum = await db.pool.query(
            'UPDATE albums SET declined = $1 WHERE id = $2',
            [true, item_id])

    let setAcceptedFalse = await db.pool.query(
            'UPDATE albums SET accepted = $1 WHERE id = $2',
            [false, item_id])

     response.status(200).send({ message: `Success: declined a ${type} submission` });
   }
  } catch(error) {
    console.log(error)
  }
}







 module.exports = {
  getSubmissions,
  getAuth0User,
  acceptSubmission,
  declineSubmission,
  declinedSubmissions,
  acceptedSubmissions
 }