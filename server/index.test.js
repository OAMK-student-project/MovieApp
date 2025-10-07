import 'dotenv/config';
import { expect } from 'chai';
//import { initializeTestDb } from '../helpers/test.js';


import db from '../server/helpers/db.js';
import { initializeTestDb, clearDb, insertTestUser } from './helpers/test.js'
const url = process.env.TEST_DB_URL;

describe('User signup, signin and delete tests', function () {
  this.timeout(15000);

  const rnd = Math.random().toString(36).slice(2, 10);
  const user = {
    firstname: 'Test',
    lastname: 'User',
    email: `test.${rnd}@example.com`,
    password: 'StrongP@ssw0rd!'
  };

  let createdUserId = null;
  let accessToken = null;

  // before(async () => {
  //   await initializeTestDb();     // koko skeema sisään database.sql:stä
  // });

  it('POST /user/signup luo käyttäjän (201) ja palauttaa id sekä email', async () => {
    const response = await fetch(`${url}/user/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    });

    const data = await response.json();

    expect(response.status).to.equal(201);
    expect(data).to.be.an('object');
    expect(data).to.have.keys('id', 'firstname', 'lastname', 'email');

    createdUserId = data.id;
    expect(/^\d+$/.test(String(createdUserId))).to.equal(true);
    createdUserId = Number(createdUserId);
    expect(data.email).to.equal(user.email);
  });

  it('POST /user/signin kirjaa käyttäjän sisälle ja palauttaa statuksen 200', async () => {
    const response = await fetch(`${url}/user/signin`, {
      method: 'POST',
      headers: { 'Content-type' : 'application/json'},
      body: JSON.stringify({
        email: user.email,
        password: user.password,
        remember: false
      })
    });
    const signinData = await response.json();
    expect(response.status).to.equal(200);
    expect(signinData).to.have.keys('userID', 'email', 'accessToken');
    accessToken = signinData.accessToken;
  });

  it('POST /user/signout uloskirjaa käyttäjän ja palauttaa statuksen', async () => {
    const response = await fetch(`${url}/user/signout`, {
      method: 'POST',
      headers: { 'Content-Type' : 'application/json'},
      body: JSON.stringify({
        email:user.email,
        password: user.password,
        remember: false
      })
    });
    expect(response.status).to.equal(204);
  });

  //Tämä testi epäonnistuu vielä. Odotetaan korjauksia.
  it('DELETE /user/:id poistaa rekisteröidyn käyttäjän (200)', async () => {
    const response = await fetch(`${url}/user/signin`, {
      method: 'POST',
      headers: { 'Content-type' : 'application/json'},
      body: JSON.stringify({
        email: user.email,
        password: user.password,
        remember: false
      })
    });
    const signinData = await response.json();
    expect(response.status).to.equal(200);
    expect(signinData).to.have.keys('userID', 'email', 'accessToken');
    accessToken = signinData.accessToken;
    const delRes = await fetch(`${url}/user/${createdUserId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    const delData = await delRes.json();
    expect(delRes.status).to.equal(200);
    expect(delData).to.be.an('object');
    expect(delData).to.have.property('message', 'User deleted');
    expect(delData).to.have.property('user');
    expect(Number(delData.user.id)).to.equal(createdUserId);
    expect(delData.user).to.have.property('email', user.email);
  });
});


//Arvostelujen testit
describe('Review routes: /all, /byuser, /movie/:tmdbId, /add, /update, /delete', function () {
  this.timeout(15000);

  const rnd = Math.random().toString(36).slice(2, 10);
  const user = {
    firstname: 'Test',
    lastname: 'User',
    email: `test.${rnd}@example.com`,
    password: 'StrongP@ssw0rd!'
  };

  let createdUserId = null;
  let accessToken = null;
  const movieID = 550;
  let createdReviewId = null;

  //Rekisteröidään testikäyttäjä ja kirjaudutaan sisälle.
  before(async () => {
    const signupRes = await fetch(`${url}/user/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    });
    expect(signupRes.status).to.equal(201);

    const response = await fetch(`${url}/user/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: user.email,
        password: user.password,
        remember: false
      })
    });
    const signinData = await response.json();
    expect(response.status).to.equal(200);
    expect(signinData).to.have.keys('userID', 'email', 'accessToken');
    accessToken = signinData.accessToken;
  });

  it('GET /api/reviews/all palauttaa 200 ja taulukon', async () => {
    const response = await fetch(`${url}/api/reviews/all`, { method: 'GET' });
    expect(response.status).to.equal(200);
    const data = await response.json();
    expect(data).to.be.an('array');
  });

  it('GET /api/reviews/byuser palauttaa 401 ilman tokenia', async () => {
    const response = await fetch(`${url}/api/reviews/byuser`, { method: 'GET' });
    expect(response.status).to.equal(401);
  });

  it('POST /api/reviews/add lisää arvostelun ja palauttaa 201, review  ja movieAdded', async () => {
    const response = await fetch(`${url}/api/reviews/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        movieID,
        reviewText: 'Testiarvio',
        rating: 4
      })
    });

    expect(response.status).to.equal(201);
    const data = await response.json();
    expect(data).to.be.an('object');
    expect(data).to.have.keys('review', 'movieAdded');
    expect(data.review).to.include.all.keys('id', 'user_id', 'movie_id', 'rating', 'review_text', 'created_at');
    expect(Number(data.review.movie_id)).to.equal(movieID);
    createdReviewId = Number(data.review.id);
    expect(Number.isInteger(createdReviewId)).to.equal(true);
  });

  it('GET /api/reviews/byuser tokenilla palauttaa 200 ja taulukon', async () => {
    const response = await fetch(`${url}/api/reviews/byuser`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    expect(response.status).to.equal(200);
    const data = await response.json();
    expect(data).to.be.an('array');
    expect(data.length).to.be.greaterThan(0);
  });

  it('GET /api/reviews/movie/:tmdbId palauttaa 200 ja taulukon', async () => {
    const response = await fetch(`${url}/api/reviews/movie/${movieID}`, { 
      method: 'GET' 
    });
    expect(response.status).to.equal(200);
    const data = await response.json();
    expect(data).to.be.an('array');
    if (data.length > 0) {
      const review = data[0];
      expect(review).to.have.keys(
        'id',
        'user_id',
        'username',
        'email',
        'movie_id',
        'rating',
        'review_text',
        'created_at'
      );
    }
  });

  it('PUT /api/reviews/update päivittää arvostelun ja palauttaa 200', async () => {
    const response = await fetch(`${url}/api/reviews/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        reviewID: createdReviewId,
        rating: 5,
        reviewText: 'Päivitetty arvio'
      })
    });

    expect(response.status).to.equal(200);
    const data = await response.json();
    expect(Number(data.id)).to.equal(createdReviewId);
  });

  it('DELETE /api/reviews/delete poistaa arvostelun ja palauttaa 200 ja deletedReview sekä movieRemoved', async () => {
    const response = await fetch(`${url}/api/reviews/delete`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        reviewID: createdReviewId,
        movieID
      })
    });

    expect(response.status).to.equal(200);
    const data = await response.json();
    expect(data).to.be.an('object');
    expect(data).to.have.keys('deletedReview', 'movieRemoved');
      expect(Number(data.deletedReview.id)).to.equal(createdReviewId);
  });
});

