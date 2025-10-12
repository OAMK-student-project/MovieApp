// controllers/deleteController.js
import db from '../helpers/db.js';
import { revokeRefreshToken } from '../helpers/auth.js';

export const deleteProfile = async (req, res, next) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  const client = await db.connect();

  try {
    await client.query('BEGIN');

    // --- DELETE REVIEWS ---
    await client.query('DELETE FROM "Reviews" WHERE user_id = $1', [userId]);

    // --- DELETE FAVOURITE LISTS AND MOVIES ---
    const { rows: lists } = await client.query(
      'SELECT id FROM "Favourite_lists" WHERE user_id = $1',
      [userId]
    );
    for (const list of lists) {
      await client.query('DELETE FROM "Favourite_movies" WHERE favourite_id = $1', [list.id]);
    }
    await client.query('DELETE FROM "Favourite_lists" WHERE user_id = $1', [userId]);

    // --- DELETE GROUP JOIN REQUESTS & MEMBERSHIPS ---
    await client.query('DELETE FROM "Group_join_requests" WHERE requester_id = $1', [userId]);
    await client.query('DELETE FROM "Group_members" WHERE user_id = $1', [userId]);

    // --- DELETE OWNED GROUPS & RELATED DATA ---
    const { rows: ownedGroups } = await client.query(
      'SELECT id FROM "Groups" WHERE created_by = $1',
      [userId]
    );
    for (const group of ownedGroups) {
      await client.query('DELETE FROM "Group_movies" WHERE group_id = $1', [group.id]);
      await client.query('DELETE FROM "Group_join_requests" WHERE group_id = $1', [group.id]);
      await client.query('DELETE FROM "Group_members" WHERE group_id = $1', [group.id]);
      await client.query('DELETE FROM "Groups" WHERE id = $1', [group.id]);
    }

    // --- DELETE REFRESH TOKENS ---
    await revokeRefreshToken(userId); // now revokes all tokens safely

    // --- DELETE USER ---
    await client.query('DELETE FROM "Users" WHERE id = $1', [userId]);

    await client.query('COMMIT');

    // --- CLEAR COOKIE ---
    res.clearCookie('rt', {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production'
    });

    res.status(200).json({ message: 'Your profile and all related data have been deleted.' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error deleting user and related data:', err);
    next({ status: 500, message: 'Failed to delete user and related data.' });
  } finally {
    client.release();
  }
};