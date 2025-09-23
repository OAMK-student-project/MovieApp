import { db } from "../database.js";

const users = {
    //id auto-incremented
    
//-----Get all users
    getAll: function (callback) {
        return db.query('SELECT * FROM Users', callback);
    },

//-----Get user by ID
    getById: function (id, callback) {
        return db.query('SELECT * FROM Users WHERE id = $1', [id], callback);
    },

//-----Get user by email
    getByEmail: function (email, callback) {
        return db.query('SELECT * FROM Users WHERE email = $1', [email], callback);
    },

//-----Add user
    //from my undestanding user id (id) should be automagically added to the database by postgre, thus it's "missing" from add. Tested in query.
    //userAccountData = {email, firstname, lastname}
    add: function (userAccountData, callback) {
        const timestamp = new Date(); // current date/time
        return db.query(
            'INSERT INTO Users (email, firstname, lastname, created_at) VALUES ($1, $2, $3, $4) RETURNING *',
            [
                userAccountData.email,
                userAccountData.firstname,
                userAccountData.lastname,
                timestamp
            ],
        callback);
    },
delete: function(id, callback) {
  // ensin poista käyttäjän kaikki arviot
  db.query('DELETE FROM Reviews WHERE user_id = $1', [id], (err) => {
    if (err) return callback(err);
    // sitten poista käyttäjä
    db.query('DELETE FROM Users WHERE id = $1 RETURNING *', [id], callback);
  });
},

//-----Update user
    update: function (id, userAccountData, callback) {
        return db.query(
            'UPDATE Users SET email = $1, firstname = $2, lastname = $3 WHERE id = $4 RETURNING *',
            [
                userAccountData.email,
                userAccountData.firstname,
                userAccountData.lastname,
                id
            ],
        callback);
    }
}; // END
export default users;