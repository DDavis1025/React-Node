const db = require('./queries');
const uuidv4 = require('uuid/v4');
var axios = require("axios").default;
require('dotenv').config();


const setCopyrightInfringementTrueTrack = async (request, response) => {
  const uuid = uuidv4();
  const { user_id, item_id } = request.params;

  try {
   let updateFieldsCopyright = await db.pool.query(
            'UPDATE fields SET copyright_infringing_music = $1, copyright_status_checked = $2 WHERE id = $3',
            [true, false, item_id])

   let updateTrackCopyright = await db.pool.query(
            'UPDATE track SET copyright_infringing_content = $1 WHERE id = $2',
            [true, item_id])

   let insertCopyrightStrikeTrack = await db.pool.query (
   'INSERT INTO copyright_strikes_history VALUES ($1, $2, $3, $4, $5, $6)',
   [uuid, user_id, null, item_id, null, null])

   let copyrightStrikes = await db.pool.query(
            'SELECT COUNT(*)::smallint from active_strikes WHERE user_id = $1',
            [user_id])

   if (copyrightStrikes.rows[0].count >= 5) {
    response.status(200).json({"copyright_strikes": copyrightStrikes.rows[0].count });
   } else {
    response.status(200).send({ message: `Success: copyright set for item ${item_id}` });
   }

  } catch(error) {
    if (error.code == 23505) {
    response.status(409).json({ message: "Copyright strike for this item already exists" });
    }
    console.log(error)
  }
}

const setCopyrightInfringementTrueTrackImage = async (request, response) => {
  const uuid = uuidv4();
  const { user_id, item_id, item_image_id } = request.params;

  try {
   let updateFieldsCopyright = await db.pool.query(
            'UPDATE fields SET copyright_infringing_image = $1, copyright_status_checked_image = $2 WHERE id = $3',
            [true, false, item_id])

   let updateTrackImagesCopyright = await db.pool.query(
            'UPDATE track_images SET copyright_infringing_content = $1 WHERE image_id = $2',
            [true, item_image_id])

   let insertCopyrightStrikeTrack = await db.pool.query (
   'INSERT INTO copyright_strikes_history (id, user_id, track_image_id) VALUES ($1, $2, $3) RETURNING *',
   [uuid, user_id, item_image_id])

   let copyrightStrikes = await db.pool.query(
            'SELECT COUNT(*)::smallint from active_strikes WHERE user_id = $1',
            [user_id])

   if (copyrightStrikes.rows[0].count >= 5) {
    response.status(200).json({"copyright_strikes": copyrightStrikes.rows[0].count });
   } else {
    response.status(200).send({ message: `Success: copyright set for item ${item_image_id}` });
   }

  } catch(error) {
    if (error.code == 23505) {
    response.status(409).json({ message: "Copyright strike for this item already exists" });
    }
    console.log(error)
  }
}

const setCopyrightInfringementFalseTrackImage = async (request, response) => {
  const { item_id, item_image_id } = request.params;

  try {

    let updateFieldsCopyright = await db.pool.query(
            'UPDATE fields SET copyright_infringing_image = $1, copyright_status_checked_image = $2 WHERE id = $3',
            [false, null, item_id])

   let updateImageCopyright = await db.pool.query(
            'UPDATE track_images SET copyright_infringing_content = $1 WHERE image_id = $2',
            [false, item_image_id])

   let insertCopyrightStrikeTrack = await db.pool.query (
   'DELETE FROM copyright_strikes_history WHERE track_image_id = $1',
   [item_id])

    response.status(200).send({ message: `Success: copyright infringement removed for item ${item_image_id}` });

  } catch(error) {
    console.log(error)
  }
}


const setCopyrightInfringementFalseTrack = async (request, response) => {
  const { item_id } = request.params;

  try {
   let updateFieldsCopyright = await db.pool.query(
            'UPDATE fields SET copyright_infringing_music = $1, copyright_status_checked = $2 WHERE id = $3',
            [false, null, item_id])

   let updateTrackCopyright = await db.pool.query(
            'UPDATE track SET copyright_infringing_content = $1 WHERE id = $2',
            [false, item_id])

   let insertCopyrightStrikeTrack = await db.pool.query (
   'DELETE FROM copyright_strikes_history WHERE track_id = $1',
   [item_id])

    response.status(200).send({ message: `Success: copyright infringement removed for item ${item_id}` });

  } catch(error) {
    console.log(error)
  }
}

const setCopyrightInfringementTrueVideo = async (request, response) => {
  const uuid = uuidv4();
  const { user_id, item_id } = request.params;

  try {
   let updateFieldsCopyright = await db.pool.query(
            'UPDATE fields SET copyright_infringing_music = $1, copyright_status_checked = $2 WHERE id = $3',
            [true, false, item_id])

   let updateVideoCopyright = await db.pool.query(
            'UPDATE video SET copyright_infringing_content = $1 WHERE id = $2',
            [true, item_id])

   let insertCopyrightStrikeVideo = await db.pool.query (
   'INSERT INTO copyright_strikes_history VALUES ($1, $2, $3, $4, $5, $6)',
   [uuid, user_id, item_id, null, null, null])

   let copyrightStrikes = await db.pool.query(
            'SELECT COUNT(*)::smallint from active_strikes WHERE user_id = $1',
            [user_id])

   if (copyrightStrikes.rows[0].count >= 5) {
    response.status(200).json({"copyright_strikes": copyrightStrikes.rows[0].count });
   } else {
    response.status(200).send({ message: `Success: copyright set for item ${item_id}` });
   }

  } catch(error) {
    if (error.code == 23505) {
    response.status(409).json({ message: "Copyright strike for this item already exists" });
    }
    console.log(error)
  }
}



const setCopyrightInfringementFalseVideo = async (request, response) => {
  const { item_id } = request.params;

  try {
   let updateFieldsCopyright = await db.pool.query(
            'UPDATE fields SET copyright_infringing_music = $1, copyright_status_checked = $2 WHERE id = $3',
            [false, null, item_id])

   let updateVideoCopyright = await db.pool.query(
            'UPDATE video SET copyright_infringing_content = $1 WHERE id = $2',
            [false, item_id])

   let insertCopyrightStrikeTrack = await db.pool.query (
   'DELETE FROM copyright_strikes_history WHERE video_id = $1',
   [item_id])

    response.status(200).send({ message: `Success: copyright infringement removed for item ${item_id}` });

  } catch(error) {
    console.log(error)
  }
}


const setCopyrightInfringementTrueAlbum = async (request, response) => {
  const uuid = uuidv4();
  const { user_id, item_id, item_song_id } = request.params;

  try {
   let updateFieldsCopyright = await db.pool.query(
            'UPDATE albums SET copyright_infringing_music = $1, copyright_status_checked = $2 WHERE id = $3',
            [true, false, item_id])

   let updateVideoCopyright = await db.pool.query(
            'UPDATE songs SET copyright_infringing_content = $1 WHERE id = $2',
            [true, item_song_id])

   let insertCopyrightStrikeAlbum = await db.pool.query (
   'INSERT INTO copyright_strikes_history (id, user_id, album_id, song_id) VALUES ($1, $2, $3, $4) RETURNING *',
   [uuid, user_id, item_id, item_song_id])


   let copyrightStrikes = await db.pool.query(
            'SELECT COUNT(*)::smallint from active_strikes WHERE user_id = $1',
            [user_id])

   if (copyrightStrikes.rows[0].count >= 5) {
    response.status(200).json({"copyright_strikes": copyrightStrikes.rows[0].count });
   } else {
    response.status(200).send({ message: `Success: copyright set for album ${item_id} and song ${item_song_id}` });
   }

  } catch(error) {
    if (error.code == 23505) {
    response.status(409).json({ message: "Copyright strike for this item already exists" });
    }
    console.log(error)
  }
}


const setCopyrightInfringementFalseAlbum = async (request, response) => {
  const { item_id, item_song_id } = request.params;

  try {
   let updateFieldsCopyright = await db.pool.query(
            'UPDATE albums SET copyright_infringing_music = $1, copyright_status_checked = $2 WHERE id = $3',
            [false, null, item_id])

   let updateVideoCopyright = await db.pool.query(
            'UPDATE songs SET copyright_infringing_content = $1 WHERE id = $2',
            [false, item_song_id])

   let insertCopyrightStrikeTrack = await db.pool.query (
   'DELETE FROM copyright_strikes_history WHERE album_id = $1 AND song_id = $2',
   [item_id, item_song_id])

    response.status(200).send({ message: `Success: copyright infringement removed for album ${item_id} and song ${item_song_id}` });

  } catch(error) {
    console.log(error)
  }
}


const setCopyrightInfringementTrueAlbumImage = async (request, response) => {
  const uuid = uuidv4();
  const { user_id, album_id, item_id } = request.params;

  try {
   let updateFieldsCopyright = await db.pool.query(
            'UPDATE albums SET copyright_infringing_image = $1, copyright_status_checked_image = $2 WHERE id = $3',
            [true, false, album_id])

   let updateVideoCopyright = await db.pool.query(
            'UPDATE file SET copyright_infringing_content = $1 WHERE image_id = $2',
            [true, item_id])

   let insertCopyrightStrikeAlbum = await db.pool.query (
   'INSERT INTO copyright_strikes_history (id, user_id, album_id, album_image_id) VALUES ($1, $2, $3, $4) RETURNING *',
   [uuid, user_id, album_id, item_id])


   let copyrightStrikes = await db.pool.query(
            'SELECT COUNT(*)::smallint from active_strikes WHERE user_id = $1',
            [user_id])

   if (copyrightStrikes.rows[0].count >= 5) {
    response.status(200).json({"copyright_strikes": copyrightStrikes.rows[0].count });
   } else {
    response.status(200).send({ message: `Success: copyright set for album image ${item_id} and album ${album_id}` });
   }

  } catch(error) {
    if (error.code == 23505) {
    response.status(409).json({ message: "Copyright strike for this item already exists" });
    }
    console.log(error)
  }
}


const setCopyrightInfringementFalseAlbumImage = async (request, response) => {
  const { album_id, item_id } = request.params;

  try {
   let updateFieldsCopyright = await db.pool.query(
            'UPDATE albums SET copyright_infringing_image = $1, copyright_status_checked_image = $2 WHERE id = $3',
            [false, null, album_id])

   let updateVideoCopyright = await db.pool.query(
            'UPDATE file SET copyright_infringing_content = $1 WHERE image_id = $2',
            [false, item_id])

   let insertCopyrightStrikeTrack = await db.pool.query (
   'DELETE FROM copyright_strikes_history WHERE album_id = $1 AND album_image_id = $2',
   [album_id, item_id])

    response.status(200).send({ message: `Success: copyright infringement removed for album image ${item_id} and album ${album_id}` });

  } catch(error) {
    console.log(error)
  }
}


const copyrightInfringingAlbumsByArtist = (request, response) => {
  const id = request.params.user_id;
    db.pool.query('SELECT * FROM albums JOIN file ON albums.id = file.album_id WHERE albums.author = $1 AND albums.copyright_infringing_music IS TRUE OR albums.copyright_infringing_image IS TRUE ORDER BY time_added DESC', 
      [id])
    .then(results => {
      response.status(200).json(results.rows)
    }).catch(error => console.log(error));
}

const copyrightInfringingVideosByArtist = (request, response) => {
    const id = request.params.user_id;
    db.pool.query('SELECT * FROM fields JOIN video_thumbnails ON fields.id = video_thumbnails.id WHERE fields.author = $1 AND fields.copyright_infringing_music IS TRUE OR fields.copyright_infringing_image IS TRUE ORDER BY time_added DESC', 
      [id])
    .then((results) => {
     response.status(200).json(results.rows)
    }).catch(error => console.log("GET video by artist ID" + error));
}

const copyrightInfringingTracksByArtist = (request, response) => {
    const id = request.params.user_id;
    db.pool.query('SELECT * FROM fields JOIN track_images ON fields.id = track_images.id WHERE fields.author = $1 AND fields.copyright_infringing_music IS TRUE OR fields.copyright_infringing_image IS TRUE ORDER BY time_added DESC', 
      [id])
    .then((results) => {
     response.status(200).json(results.rows)
    }).catch(error => console.log(error));
}


const copyrightInfringingSongByAlbum = (request, response) => {
  const id = request.params.album_id;
    db.pool.query('SELECT * FROM songs WHERE album_id = $1 AND copyright_infringing_content IS TRUE', 
      [id])
    .then(results => {
      response.status(200).json(results.rows)
    }).catch(error => console.log(error));
}




 module.exports = {
  setCopyrightInfringementTrueTrack,
  setCopyrightInfringementTrueTrackImage,
  setCopyrightInfringementFalseTrackImage,
  setCopyrightInfringementFalseTrack,
  setCopyrightInfringementTrueVideo,
  setCopyrightInfringementFalseVideo,
  setCopyrightInfringementTrueAlbum,
  setCopyrightInfringementFalseAlbum,
  setCopyrightInfringementTrueAlbumImage,
  setCopyrightInfringementFalseAlbumImage,
  copyrightInfringingAlbumsByArtist,
  copyrightInfringingVideosByArtist,
  copyrightInfringingTracksByArtist,
  copyrightInfringingSongByAlbum
 }