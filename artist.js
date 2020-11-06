const db = require('./queries');
const fs = require('fs');
var path = require('path');
var indexJS = require('./index');
var info = require('./info');
var axios = require("axios").default;
require('dotenv').config();

const getArtistByID = (request, response) => {
	const id = request.params.id;
    db.pool.query('SELECT * FROM albums JOIN file ON albums.id = file.album_id WHERE author = $1 ORDER BY time_added DESC', [id])
    .then(results => {
      response.status(200).json(results.rows)
      console.log('+ SELECT for artists')
    }).catch(error => console.log(error));
}

const addFollower = (request, response) => {
    db.pool.query('INSERT INTO user_followers (user_id, follower_id) VALUES ($1, $2) RETURNING *', 
      [request.body.user_id, request.body.follower_id])
    .then(results => {
      let message = "started following you"
      return db.pool.query(
        'INSERT INTO notifications (user_id, supporter_id, supporter_username, supporter_picture, message, new) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
         [request.body.user_id, request.body.follower_id, request.body.follower_username, request.body.follower_picture, message, true])
      }).then(()=> {
      response.status(200).send({ message: `Success: Added Follower`});
     }).catch(error => console.log(error));

}

const getFollowingByUserId = (request, response) => {
	const id = request.params.id;

	db.pool.query('SELECT user_id FROM user_followers WHERE follower_id = $1', [id])
    .then(results => {
      response.status(200).json(results.rows)
      console.log(`SELECT user_id FROM user_followers WHERE follower_id = ${id}`)
    }).catch(error => console.log(error));
}

const getFollowedByFollowerID = (request, response) => {
	const id = request.params.id;

	db.pool.query('SELECT follower_id FROM user_followers WHERE user_id = $1', [id])
    .then(results => {
      response.status(200).json(results.rows)
      console.log(`SELECT follower_id FROM user_followers WHERE user_id = ${id}`)
    }).catch(error => console.log(error));
}

const deleteFollowing = (request, response) => {
  const user_id = request.params.user_id;
  const follower_id = request.params.follower_id;
  
  db.pool.query('DELETE FROM user_followers WHERE user_id = $1 AND follower_id = $2', [user_id, follower_id])
 .then((results) => {
    let message = "started following you"
    db.pool.query('DELETE FROM notifications WHERE user_id = $1 AND supporter_id = $2 AND message = $3', 
    [user_id, follower_id, message])
   }).then((results)=> {
   response.status(200).send({ message: `DELETED following with user_id ${user_id} and follower_id ${follower_id}` });
 }).catch((err)=>{console.log(err)})
}

const uploadImage = (request, response) => {
    const { user_id } = request.body;
    console.log("request.body" + JSON.stringify(request.body))
    console.log("request.file" + JSON.stringify(request.files))
    db.pool.query(
        'INSERT INTO user_images (user_id, image_name, "path", size) VALUES ($1, $2, $3, $4) RETURNING *',
        [user_id, request.files.filename, request.files.key, request.files.size])
      .then((res) => {
        response.status(200).send({ message: "Success: Uploaded Image" });
        console.log(`Success: Uploaded User Image + ${res.rows}`)

      }).catch(error => console.log(error));
    
}



const upsertUserImage = (request, response) => {
    const { user_id } = request.body;
    let picture_path = request.files.file[0].key

    db.pool.query('SELECT * FROM user_images WHERE user_id = $1', 
    [user_id])
    .then((res) => {
        if (res.rowCount > 0) {
          Promise.resolve().then(()=> {
          var params = {  Bucket: info.BUCKET_NAME, Key: picture_path };
          indexJS.s3.deleteObject(params, function(err, data) {
          if (err) console.log(err, err.stack);  // error
          else     console.log("deleted" + data);                 // deleted
          });
          // fs.unlinkSync(path.join(__dirname, picture_path))
          }).then(()=> {
          db.pool.query('UPDATE user_images SET user_id = $1, image_name = $2, type = $3, size = $4, "path" = $5 WHERE user_id = $1', 
          [user_id, request.files.file[0].filename, request.files.file[0].mimetype, request.files.file[0].size, request.files.file[0].key])
          .then((res) => {
          response.status(200).send({ message: "Success: Updated Image" });
          console.log(`Success: Updated User Image + ${res.rows}`)
       }).catch((error) => {
        response.status(500).send({ message: error });
        console.log(error)
        });
       })
        } else {
            db.pool.query(
            'INSERT INTO user_images (user_id, image_name, type, size, "path") VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [user_id, request.files.file[0].filename, request.files.file[0].mimetype, request.files.file[0].size, request.files.file[0].key])
            .then((res) => {
            response.status(200).send({ message: "Success: Added Image" });
            console.log("Success: Added User Image" + JSON.stringify(request.body))
          }).catch((error) =>  {
          response.status(500).send({ message: error });
          console.log(error)
        });
      }
    }).catch((error) => {
      response.status(500).send({ message: error });
      console.log(error)
    });
    
}


const getUserImageByID = (request, response) => {
  const id = request.params.id;
    db.pool.query('SELECT * FROM user_images WHERE user_id = $1', [id])
    .then(results => {
      response.status(200).json(results.rows)
      console.log('Got user image path by id')
    }).catch(error => console.log(error));
}


const getFollower = async (request, response) => {
    const user_id = request.params.user_id;
    const follower_id = request.params.follower_id
    try {
      let followResult = await db.pool.query('SELECT * FROM user_followers WHERE user_id = $1 AND follower_id = $2', 
      [user_id, follower_id])
      response.status(200).json(followResult.rows)
    } catch(err) {
       console.log(err)
    }
}

const updateUserInfo = async (request, response) => {
    const user_id = request.body.user_id;
    const username = request.body.username.toLowerCase();
    try {
      let selectUsername = await db.pool.query('SELECT username FROM user_info WHERE user_id = $1', 
      [user_id])
         if (selectUsername.rowCount > 0) {
           let updateUsernameResult = await db.pool.query('UPDATE user_info SET username = $1 WHERE user_id = $2', 
           [username, user_id])
           response.status(200).json(updateUsernameResult.rows)
         } else {
           let insertUsernameResult = await db.pool.query(
            'INSERT INTO user_info (user_id, username) VALUES ($1, $2) RETURNING *',
            [user_id, username])
            response.status(200).json(insertUsernameResult.rows)
         }
    } catch(err) {
       console.log(err)
    }
}


const getUserInfo = async (request, response) => {
    const user_id = request.params.user_id;
    try {
      let usernameResult = await db.pool.query('SELECT username FROM user_info WHERE user_id = $1', 
      [user_id])
      response.status(200).json(usernameResult.rows)
    } catch(err) {
       console.log(err)
    }
}

const checkUsername = async (request, response) => {
    const username = request.params.username;
      let usernameResult = await db.pool.query('SELECT username FROM user_info WHERE username = $1', 
      [username])
      response.status(200).json(usernameResult.rows)
}

const addPurchase = async (request, response) => {
  const user_id = request.body.user_id;
  const productIdentifier = request.body.productIdentifier;
  try {
      let purchase = await db.pool.query(
            'INSERT INTO purchases (user_id, productIdentifier) VALUES ($1, $2) RETURNING *',
            [user_id, productIdentifier])
            response.status(200).json(purchase.rows)
  } catch(error) { 
    console.log(error) 
  }
}

const getPurchase = async (request, response) => {
  const user_id = request.params.user_id;
  const productIdentifier = request.params.productIdentifier;
  try {
      let purchase = await db.pool.query(
            'SELECT * FROM purchases WHERE user_id = $1 AND productIdentifier = $2',
            [user_id, productIdentifier])
            response.status(200).json(purchase.rows)
  } catch(error) { 
    console.log(error) 
  }
}


const getDataUsage = async (request, response) => {
  const user_id = request.params.user_id;
  try {
      let fileSize = await db.pool.query(
            'SELECT size FROM file WHERE user_id = $1',
            [user_id])
      let songsSize = await db.pool.query(
            'SELECT size FROM songs WHERE user_id = $1',
            [user_id])
      let trackSize = await db.pool.query(
            'SELECT size FROM track WHERE author = $1',
            [user_id])
      let trackImagesSize = await db.pool.query(
            'SELECT size FROM track_images WHERE author = $1',
            [user_id])
      let userImagesSize = await db.pool.query(
            'SELECT size FROM user_images WHERE user_id = $1',
            [user_id])
      let videoSize = await db.pool.query(
            'SELECT size FROM video WHERE author = $1',
            [user_id])
      let videoImagesSize = await db.pool.query(
            'SELECT size FROM video_thumbnails WHERE author = $1',
            [user_id])
      let all = await fileSize.rows.concat(songsSize.rows, trackSize.rows, trackImagesSize.rows,
       userImagesSize.rows, videoSize.rows, videoImagesSize.rows);
      let size = 0;
      for (x in all) {
        size += all[x].size
        console.log(all[x].size)
      }
      size *= 0.000000001
      let obj = {};
      obj.size = size;
      if (size >= 80) {
        obj.overPremium = true;
      } else {
        obj.overPremium = false;
      } 
      if (size >= 0.3) {
        obj.overFree = true;
      } else {
        obj.overFree = false;
      }
      response.status(200).json(obj)      

  } catch(error) { 
    console.log(error) 
  }
}

const deleteAccountData = async (request, response) => {
  const user_id = request.params.user_id;

      let deleteFromAlbums = await db.pool.query(
            'DELETE FROM albums WHERE author = $1',
            [user_id])
      let deleteFromCommentLikes = await db.pool.query(
            'DELETE FROM comment_likes WHERE user_id = $1',
            [user_id])
      let deleteFromFields = await db.pool.query(
            'DELETE FROM fields WHERE author = $1',
            [user_id])
      let deleteFromFile = await db.pool.query(
            'DELETE FROM file WHERE user_id = $1',
            [user_id])
      let deleteFromNotifications = await db.pool.query(
            'DELETE FROM notifications WHERE user_id = $1 AND supporter_id = $1',
            [user_id])
      let deleteFromPostLikes = await db.pool.query(
            'DELETE FROM post_likes WHERE user_id = $1',
            [user_id])
      let deleteFromPurchases = await db.pool.query(
            'DELETE FROM purchases WHERE user_id = $1',
            [user_id])
      let deleteFromSongs = await db.pool.query(
            'DELETE FROM songs WHERE user_id = $1',
            [user_id])
      let deleteFromSubComments = await db.pool.query(
            'DELETE FROM sub_comments WHERE user_id = $1',
            [user_id])
      let deleteFromTrack = await db.pool.query(
            'DELETE FROM track WHERE author = $1',
            [user_id])
      let deleteFromTrackImages = await db.pool.query(
            'DELETE FROM track_images WHERE author = $1',
            [user_id])
      let deleteFromUserFollowers = await db.pool.query(
            'DELETE FROM user_followers WHERE user_id = $1',
            [user_id])
      let deleteFromUserImages = await db.pool.query(
            'DELETE FROM user_images WHERE user_id = $1',
            [user_id])
      let deleteFromUserInfo = await db.pool.query(
            'DELETE FROM user_info WHERE author = $1',
            [user_id])
      let deleteFromVideo = await db.pool.query(
            'DELETE FROM video WHERE author = $1',
            [user_id])
      let deleteFromVideoThumbnails = await db.pool.query(
            'DELETE FROM video_thumbnails WHERE author = $1',
            [user_id])
      let deleteFromSubscriptions = await db.pool.query(
            'DELETE FROM subscriptions WHERE user_id = $1',
            [user_id])

      response.status(200).send({ message: "Success Deleting Account" });
    
}


const deleteAuth0Account = async (request, response) => {
  const user_id = request.params.user_id;

  try {

  var options = {
  method: 'POST',
  url: 'https://dev-owihjaep.auth0.com/oauth/token',
  headers: {'content-type': 'application/json'},
  data: {
    grant_type: 'client_credentials',
    client_id: 'ryuREoZEzPeJs57fsOK6Qt2hTsIv1a00',
    client_secret: process.env.AUTH0_CLIENT_SECRET,
    audience: 'https://dev-owihjaep.auth0.com/api/v2/'
   }
  };


  let accessTokenResponse = await axios.request(options)

  var deleteAccountOptions = {
  method: 'DELETE',
  url: `https://dev-owihjaep.auth0.com/api/v2/users/${user_id}`,
  headers: {'content-type': 'application/json', authorization: 'Bearer ' + accessTokenResponse.data.access_token}
  };

  let dltResponse = await axios.request(deleteAccountOptions)


  response.status(200).send({ message: "Success Deleting Auth0 Account" });
} catch(err) {
  console.log(err)
}



    
}


module.exports = {
   getArtistByID,
   addFollower,
   getFollowingByUserId,
   getFollowedByFollowerID,
   uploadImage,
   upsertUserImage,
   getUserImageByID,
   deleteFollowing,
   getFollower,
   getUserInfo,
   updateUserInfo,
   checkUsername,
   addPurchase,
   getPurchase,
   getDataUsage,
   deleteAccountData,
   deleteAuth0Account
}