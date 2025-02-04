require('dotenv').config();

const express = require('express');
const res = require('express/lib/response');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');
const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

hbs.registerPartials(__dirname + "/views/partials");

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then( data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch( error => console.log('Something went wrong when retrieving an access token', error));

// Routes
app.get('/', (req, res, next) => { res.render('home') });

app.get('/artist-search', (req, res, next) => {
  spotifyApi.searchArtists(req.query.artist)
    .then( data => { res.render('artist-search-results', data.body.artists) })
    .catch( err => console.log('searching artist error -> ', err));
});

app.get('/albums/:artistId',(req, res, next) =>{
  spotifyApi.getArtistAlbums(req.params.artistId)
    .then( data => { res.render('albums', data.body) })
    .catch( err => console.log('searching albums error ->', err));
});

app.get('/tracks/:albumId/', (req, res, next) => {
  spotifyApi.getAlbumTracks(req.params.albumId)
    .then( data => { res.render('tracks', data.body)})
    .catch( err => console.log('searching track error ->', err))
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
