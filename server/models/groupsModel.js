import db from '../helpers/db.js';

//-----Get all groups
const getAllGroups = async () => {
  const result = await db.query('SELECT * FROM "Groups"');
  return result.rows;
};

//-----Get groups by name
const getGroupByName = async (groupData) => {
  const result = await db.query('SELECT * FROM "Groups" WHERE name=$1', [groupData.name]);
  return result.rows;
};

//-----Get groups by name and created by (owner)
const getByGroupNameAndCreator = async (groupData) => {
  const result = await db.query(
    'SELECT * FROM "Groups" WHERE name = $1 AND created_by = $2',
    [groupData.name, groupData.created_by]
  );
  return result.rows;
};

//-----Add group
const addGroup = async (groupData) => {
  const timestamp = new Date();
  const result = await db.query(
    'INSERT INTO "Groups" (name, created_by, created_at) VALUES ($1, $2, $3) RETURNING *',
    [groupData.name, groupData.created_by, timestamp]
  );
  return result.rows[0];
};

//-----Update Group (only by creator)
const updateGroup = async (id, groupData) => {
  const result = await db.query(
    'UPDATE "Groups" SET name = $1 WHERE id = $2 AND created_by = $3 RETURNING *',
    [groupData.name, id, groupData.created_by]
  );
  return result.rows[0];
};

//-----Delete Group
const deleteGroup = async (id) => {
  const result = await db.query('DELETE FROM "Groups" WHERE id=$1 RETURNING *', [id]);
  return result.rows[0];
};

// Hae kaikki ryhmät, joissa käyttäjä on jäsen
const getGroupsByUserId = async (userId) => {
  const query = `
    SELECT g.id, g.name, g.created_by, g.created_at
    FROM "Groups" g
    JOIN "Group_members" gm ON gm.group_id = g.id
    WHERE gm.user_id = $1
  `;
  const result = await db.query(query, [userId]);
  return result.rows;
};




export {
  getAllGroups,
  getGroupByName,
  getByGroupNameAndCreator,
  addGroup,
  updateGroup,
  deleteGroup,
  getGroupsByUserId // lisätty ryhmien haku johon käyttäjä kuuluu
};
