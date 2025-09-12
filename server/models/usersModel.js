const db = require('../database');

const users = {
    //Get all users
    getAll: function (callback) {
        return db.query('SELECT * FROM Users', callback);
    },

    //Get users by ID
    getById: function (id,callback) {
        return db.query('SELECT * FROM Users WHERE id=?', [id],callback);
    },

    //Get users by email
    getByEmail: function (email,callback) {
        return db.query('SELECT * FROM Users WHERE email=?',[email],callback);
    },

    //Add user
    //from my undestanding user id (id) should be automagically added to the database by postgre, thus it's "missing" from add. Tested in query.
    add: function (userAccountData, callback) {
        const timestamp = new Date(); //This gets the current date/time
        return db.query('INSERT INTO Users(email, firstname, lastname, created_at) values (?,?,?,?)',[
            userAccountData.email, 
            userAccountData.firstname, 
            userAccountData.lastname,
            timestamp],
            callback);
    },

    //Delete user
    delete: function (id, callback) {
        return db.query('DELETE FROM Users WHERE id=?',[id],callback);
    },

    // Update user
    update: function (id, userAccountData, callback) {
        return db.query(
            'UPDATE Users SET email=?, firstname=?, lastname=? WHERE id=?',
            [
                userAccountData.email,
                userAccountData.firstname,
                userAccountData.lastname,
                id
            ],
        callback);
    }

} //END

module.exports=users;