const db = require('../database');

const groupJoin = {
    //id auto-incremented

//-----Get all requests from table
    getAll: function(callback) {
        return db.query('SELECT * FROM Group_join_requests', callback);
    },

//-----Get requests by group id
    getById: function(groupJoinId,callback) {
        return db.query('SELECT * FROM Group_join_requests WHERE group_id=$1', [groupJoinId],callback);
    },

//-----Get join requests from a specific group and return group info
    getRequestsByGroup: function (groupJoinId, callback) {
        return db.query(
            'SELECT * FROM "Group_join_requests" gjr ' + //gjr and g are just aliases, for example: "Group_join_requests" gjr <- defines the alias
            'LEFT JOIN "Groups" g ON gjr.group_id = g.id ' +
            'WHERE gjr.group_id = $1',
            [groupJoinId],
        callback);
},

//-----Add request
    //groupJoinData = { group_id, requester_id, status }
    add: function (groupJoinData, callback) {
        const timestamp = new Date();
        return db.query(
            'INSERT INTO Group_join_requests (group_id, requester_id, status, created_at) VALUES ($1, $2, $3, $4) RETURNING *',
            [
                groupJoinData.group_id,
                groupJoinData.requester_id,
                groupJoinData.status,
                timestamp
            ],
        callback);
    },

//-----Update request
    update: function(groupJoinId, groupJoinData, callback) {
        return db.query(
            'UPDATE Group_join_requests SET status = $1 WHERE id = $2 RETURNING *', [ groupJoinData.status, groupJoinId ], 
        callback);
    },

//-----Delete request
    delete: function(groupJoinId, callback) {
        return db.query(
            'DELETE FROM Group_join_requests WHERE id=$1 RETURNING *', [groupJoinId],
            callback);
    }

}; //END
module.exports = groupJoin;