const db = require('../database');

const groups = {
    //id auto-incremented

//-----Get all groups
    getAll: function(callback) {
        return db.query('SELECT * FROM Groups', callback);
    },

//-----Get groups by name
    getByName: function(groupData,callback) {
        return db.query('SELECT * FROM Groups WHERE name=$1', [groupData.name],callback)
    },

//-----Get groups by name and created by (owner)
    getByListNameAndCreator: function (groupData, callback) {
        return db.query('SELECT * FROM Groups WHERE name = $1 AND created_by = $2', [groupData.name, groupData.created_by], callback);
    },

//-----Add group
    //groupData = { name, created_by }
    add: function (groupData, callback) {
        const timestamp = new Date();
        return db.query(
            'INSERT INTO Groups (name, created_by, created_at) VALUES ($1, $2, $3) RETURNING *',
            [
                groupData.name,
                groupData.created_by, //this should come from logged-in user (Users.id)
                timestamp
            ],
        callback);
    },

//-----Update Group (only by creator)
    update: function(id, groupData, callback) {
        return db.query(
            'UPDATE Groups SET name = $1 WHERE id = $2 AND created_by = $3 RETURNING *',
            [
                groupData.name,
                id,
                groupData.created_by //this must match with logged-in user
            ], 
        callback);
    },

//-----Delete Group
    delete: function(id, callback) {
        return db.query(
            'DELETE FROM Groups WHERE id=$1 RETURNING *', [id],
            callback);
    }

}; //END
module.exports = groups;