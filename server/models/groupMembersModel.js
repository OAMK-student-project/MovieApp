import db from '../helpers/db.js';
//id auto-incremented

//-----Get all Group Members
    const getAllMembers = async() => {
       const result = await db.query('SELECT * FROM "Group_members"');
       return result.rows;
    }

//-----Get Group Members by group
    const getMembersByGroup = async(id) => {
        const result = await db.query('SELECT * FROM "Group_members" WHERE group_id=$1', [id])
        return result.rows;
    }

//-----Add Group Members
    //groupMemberData = { user_id, group_id, role }
    const addGroupMember = async(groupMemberData) => {
        const timestamp = new Date();
        const result = await db.query(
            'INSERT INTO "Group_members" (user_id, group_id, role, joined_at) VALUES ($1, $2, $3, $4) RETURNING *',
            [
                groupMemberData.user_id,
                groupMemberData.group_id,
                groupMemberData.role,
                timestamp
            ])
        return result.rows;
    }

//-----Update Group Members
    const updateGroupMembers = async(id, groupMemberData) => {
        const result = await db.query(
            'UPDATE "Group_members" SET role = $1 WHERE id = $2 RETURNING *',
            [
                groupMemberData.role,
                id,
            ])
    }

//-----Delete Group Member
    const deleteGroupMember = async(id) => {
        const result = await db.query(
            'DELETE FROM "Group_members" WHERE id=$1 RETURNING *', [id])
            return result.rows;
    }

export { getAllMembers, getMembersByGroup, addGroupMember, updateGroupMembers, deleteGroupMember }