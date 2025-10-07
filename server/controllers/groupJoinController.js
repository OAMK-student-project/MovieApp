/*import * as groupJoinModel from '../models/groupJoinModel.js';

// Lähetä liittymispyyntö
export const requestJoinGroup = async (req, res) => {
  try {
    const groupId = req.params.id;
    const requesterId = req.user.id; // vaihdettu auth-tokenista tulevaan ID:hen

    // yritetään lisätä pyyntö
    const newRequest = await groupJoinModel.addRequest({
      group_id: groupId,
      requester_id: requesterId,
      status: 'pending',
    });

    return res.status(201).json({
      message: 'Join request sent',
      request: newRequest,
    });
  } catch (err) {
    // duplikaatti (unique constraint violation)
    if (err.code === '23505') {
      return res.status(400).json({ message: 'You already sent a request to this group' });
    }

    console.error('Error creating join request:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Listaa liittymispyynnöt tietylle ryhmälle
export const getGroupRequests = async (req, res) => {
  try {
    const groupId = req.params.id;
    const requests = await groupJoinModel.getRequestsByGroup(groupId);

    return res.json({
      groupId,
      requests,
    });
  } catch (err) {
    console.error('Error fetching join requests:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Hyväksy tai hylkää liittymispyyntö

export const updateJoinRequest = async (req, res) => {
  try {
    const requestId = req.params.requestId;
    const { status } = req.body; // "approved" tai "rejected"

    if (status === "rejected") {
      // Poistetaan rivi kokonaan, niin voi tehdä uuden pyynnön myöhemmin
      const deleted = await groupJoinModel.deleteRequest(requestId);
      if (!deleted) {
        return res.status(404).json({ message: 'Join request not found' });
      }
      return res.json({
        message: 'Request rejected and deleted',
        request: deleted,
      });
    }

    // Muuten vain päivitetään status esim. "approved"
    const updated = await groupJoinModel.updateRequest(requestId, { status });
    if (!updated) {
      return res.status(404).json({ message: 'Join request not found' });
    }

    return res.json({
      message: `Request ${status}`,
      request: updated,
    });
  } catch (err) {
    console.error('Error updating join request:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};*/
    

import * as groupJoinModel from '../models/groupJoinModel.js';
import db from '../helpers/db.js';

// Lähetä liittymispyyntö
export const requestJoinGroup = async (req, res) => {
  try {
    const groupId = req.params.id;
    const requesterId = req.user.id;

    const newRequest = await groupJoinModel.addRequest({
      group_id: groupId,
      requester_id: requesterId,
      status: 'pending',
    });

    return res.status(201).json({
      message: 'Join request sent',
      request: newRequest,
    });
  } catch (err) {
    if (err.code === '23505' || err.message.includes('already sent')) {
      return res.status(400).json({ message: 'You already sent a request to this group' });
    }

    console.error('Error creating join request:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Listaa liittymispyynnöt tietylle ryhmälle
export const getGroupRequests = async (req, res) => {
  try {
    const groupId = req.params.id;
    const requests = await groupJoinModel.getRequestsByGroup(groupId);

    return res.json({
      groupId,
      requests,
    });
  } catch (err) {
    console.error('Error fetching join requests:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Hyväksy tai hylkää liittymispyyntö
export const updateJoinRequest = async (req, res) => {
  try {
    const requestId = req.params.requestId;
    const { status } = req.body;

    const [request] = await groupJoinModel.getRequestById(requestId);
    if (!request) return res.status(404).json({ message: 'Join request not found' });

    if (status === 'approved') {
      // Lisää käyttäjä jäseneksi
      await db.query(
        'INSERT INTO "Group_members" (user_id, group_id, joined_at) VALUES ($1, $2, NOW())',
        [request.requester_id, request.group_id]
      );

      // Poista join request
      await groupJoinModel.deleteRequest(requestId);

      return res.json({
        message: 'User added to group',
        request: { ...request, status },
      });
    }

    if (status === 'rejected') {
      const deleted = await groupJoinModel.deleteRequest(requestId);
      return res.json({
        message: 'Request rejected and deleted',
        request: deleted,
      });
    }
  } catch (err) {
    console.error('Error updating join request:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};