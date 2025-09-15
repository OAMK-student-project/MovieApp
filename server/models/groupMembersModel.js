const db = require('../database');

const groupMembers = {
    //id auto-incremented

//-----Get all Group Members
    getAll: function(callback) {
        return db.query('SELECT * FROM Group_members', callback);
    },

//-----Get Group Members by group
    getByName: function(groupId,callback) {
        return db.query('SELECT * FROM Group_members WHERE group_id=$1', [groupId],callback)
    },

//-----Add Group Members
    //groupMemberData = { user_id, group_id, role }
    add: function (groupMemberData, callback) {
        const timestamp = new Date();
        return db.query(
            'INSERT INTO Group_members (user_id, group_id, role, joined_at) VALUES ($1, $2, $3, $4) RETURNING *',
            [
                groupMemberData.user_id,
                groupMemberData.group_id,
                groupMemberData.role,
                timestamp
            ],
        callback);
    },

//-----Update Group Members
    update: function(id, groupMemberData, callback) {
        return db.query(
            'UPDATE Group_members SET role = $1 WHERE id = $2 RETURNING *',
            [
                groupMemberData.role,
                id,
            ], 
        callback);
    },

//-----Delete Group Member
    delete: function(id, callback) {
        return db.query(
            'DELETE FROM Group_members WHERE id=$1 RETURNING *', [id],
            callback);
    }

}; //END
module.exports = groupMembers;