# UPDATE rows (copyright_infringing_content = true)

### UPDATE fields and/or track or video

UPDATE fields
SET copyright_infringing_content = true,
copyright_status_checked = false
WHERE id = '';

[//]: # (track)
UPDATE track
SET copyright_infringing_content = true
WHERE id = '';

UPDATE track_images
SET copyright_infringing_content = true
WHERE id = '';

[//]: # (video)
UPDATE video
SET copyright_infringing_content = true
WHERE id = '';

UPDATE video_thumbnails
SET copyright_infringing_content = true
WHERE id = '';


### UPDATE songs,albums, and file

[//]: # (set for album)
UPDATE albums
SET copyright_infringing_content = true,
copyright_status_checked = false
WHERE id = '';

UPDATE file
SET copyright_infringing_content = true
WHERE album_id = '';

UPDATE songs
SET copyright_infringing_content = true
WHERE id = '';

### UPDATE user_images
UPDATE user_images
SET copyright_infringing_content = true
WHERE id = '';



# INSERT rows (copyright_strikes_history)

[//]: # (The copyright_strikes_history table)
 Table "public.copyright_strikes_history"
   Column   |           Type           | Collation | Nullable | Default 
------------+--------------------------+-----------+----------+---------
 id         | uuid                     |           | not null | 
 user_id    | text                     |           |          | 
 video_id   | uuid                     |           |          | 
 track_id   | uuid                     |           |          | 
 song_id    | uuid                     |           |          | 
 album_id   | uuid                     |           |          | 
 created_at | timestamp with time zone |           | not null | now()
Indexes:
    "copyright_strikes_history_pkey" PRIMARY KEY, btree (id)
Foreign-key constraints:
    "copyright_strikes_history_album_id_fkey" FOREIGN KEY (album_id) REFERENCES albums(id)
    "copyright_strikes_history_song_id_fkey" FOREIGN KEY (song_id) REFERENCES songs(id)
    "copyright_strikes_history_track_id_fkey" FOREIGN KEY (track_id) REFERENCES fields(id)
    "copyright_strikes_history_video_id_fkey" FOREIGN KEY (video_id) REFERENCES fields(id)


[//]: # (INSERT for track)
INSERT INTO copyright_strikes_history VALUES
    (uuid_generate_v4(), 'auth0|5eb46d8f1cc1ac0c14910f0f', null, '3c6f7f88-6cd5-448e-8d50-04d59fff249b', null, null);

[//]: # (INSERT for video)
INSERT INTO copyright_strikes_history VALUES
    (uuid_generate_v4(), 'auth0|5eb46d8f1cc1ac0c14910f0f', '4d7f7f88-6cd5-448e-8d50-04d59fff249c', null, null, null);

[//]: # (INSERT for album and song)
INSERT INTO copyright_strikes_history VALUES
    (uuid_generate_v4(), 'auth0|5eb46d8f1cc1ac0c14910f0f', null, null, '7f8f7f88-6cd5-448e-8d50-04d59fff248b', '8d7f7f88-6cd5-448e-8d50-04d59fff249d');








