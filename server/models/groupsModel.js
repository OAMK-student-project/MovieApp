const db = require('../database');

const groups = {
    //id auto-incremented

    //Get all groups
    getAll: function(callback) {
        return db.query('SELECT * FROM Groups', callback);
    },

    //Get groups by name
    getByName: function(groupName,callback) {
        return db.query('SELECT * FROM Groups WHERE name=$1', [groupName],callback)
    },

    // Get groups by name and created by (owner)
    getByListNameAndId: function (groupName, created_by, callback) {
        return db.query('SELECT * FROM Groups WHERE name = $1 AND created_by = $2', [groupName, created_by], callback);
    },

    //Add Group
    add: function() {


    },

    //Delete Group
    delete: function() {


    }

}; //END
module.exports = groups;