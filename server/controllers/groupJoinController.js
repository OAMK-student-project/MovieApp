
// controllers/groupJoinController.js
import * as groupJoinModel from '../models/groupJoinModel.js';
import * as groupMembersModel from '../models/groupMembersModel.js';
import db from '../helpers/db.js';

// GET owner
export const getGroupOwner = async (req, res) => {
  try {
    const groupId = req.params.id;
    const members = await groupMembersModel.getMembersByGroup(groupId);
    const owner = members.find(m => m.role === "Owner");
    return res.json({ ownerId: owner?.user_id ?? null });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

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
    const currentUserId = req.user.id;

    // Hae liittymispyyntö
    const [request] = await groupJoinModel.getRequestById(requestId);
    if (!request) return res.status(404).json({ message: 'Join request not found' });

    // Hae ryhmän jäsenet ja etsi owner
    const members = await groupMembersModel.getMembersByGroup(request.group_id);
    const owner = members.find(m => m.role === "Owner");

    // Tarkista, onko kirjautunut käyttäjä owner
    if (!owner || owner.user_id !== currentUserId) {
      return res.status(403).json({ message: "Only owner can approve or reject requests" });
    }

    if (status === 'approved') {
      // Tarkista, onko käyttäjä jo jäsen
      const existingMember = members.find(m => m.user_id === request.requester_id);
      if (existingMember) {
        return res.status(400).json({ message: 'User is already a member of this group' });
      }


      await db.query(
        'INSERT INTO "Group_members" (user_id, group_id, role, joined_at) VALUES ($1, $2, $3, NOW())',
        [request.requester_id, request.group_id, 'Member']
      );

      // Poista liittymispyyntö
      await groupJoinModel.deleteRequest(requestId);

      return res.json({ message: 'User added to group', request: { ...request, status } });
    }

    if (status === 'rejected') {
      // Varmista, että pyyntö löytyy
      const deleted = await groupJoinModel.deleteRequest(requestId);
      if (!deleted) return res.status(404).json({ message: 'Join request not found' });

      return res.json({ message: 'Request rejected and deleted', request });
    }
  } 
catch (err) {
  console.error('Error updating join request:', err);
  return res.status(500).json({
    message: 'Server error',
    error: err.message,
    detail: err.detail || null,
    stack: err.stack,
  });
}


};
// fixed now prevent owner from leaving 
/*export const leaveGroup = async (req, res) => {
  try {
    const groupId = req.params.id;
    const userId = req.user.id; // Comes from auth middleware

    // Delete the member from the group
    const deleted = await groupMembersModel.deleteGroupMemberByUserId(groupId, userId);

    if (!deleted) {
      return res.status(404).json({ message: "You are not a member of this group" });
    }

    return res.json({ message: "You left the group" });
  } catch (err) {
    console.error("Error leaving group:", err);
    return res.status(500).json({ message: "Server error" });
  }
};*/

export const leaveGroup = async (req, res) => {
  try {
    const groupId = req.params.id;
    const userId = req.user.id;

    // Hae jäsenyys ja rooli
    const members = await groupMembersModel.getMembersByGroup(groupId);
    const member = members.find(m => m.user_id === userId);

    if (!member) {
      return res.status(404).json({ message: "You are not a member of this group" });
    }

    // Estä owneria poistumasta
    if (member.role === "Owner") {
      return res.status(400).json({ message: "Owner cannot leave their own group" });
    }

    // Poista jäsen ryhmästä
    const deleted = await groupMembersModel.deleteGroupMemberByUserId(groupId, userId);
    if (!deleted) {
      return res.status(404).json({ message: "Failed to remove member" });
    }

    return res.json({ message: "You left the group" });
  } catch (err) {
    console.error("Error leaving group:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


export const deleteGroup = async (req, res) => {
  try {
    const groupId = req.params.id;
    const userId = req.user.id;

    // 1. Check if user is owner
    const ownerRes = await db.query(
      'SELECT user_id FROM "Group_members" WHERE group_id = $1 AND role = $2',
      [groupId, "Owner"]
    );

    if (ownerRes.rows.length === 0) {
      return res.status(404).json({ message: "Group not found or has no owner" });
    }

    if (ownerRes.rows[0].user_id !== userId) {
      return res.status(403).json({ message: "Only the group owner can delete this group" });
    }

    // 2. Delete join requests first
    await db.query('DELETE FROM "Group_join_requests" WHERE group_id = $1', [groupId]);

    // 3. Delete members
    await db.query('DELETE FROM "Group_members" WHERE group_id = $1', [groupId]);

    // 4. Delete the group itself
    await db.query('DELETE FROM "Groups" WHERE id = $1', [groupId]);

    return res.json({ message: "Group deleted successfully" });
  } catch (err) {
    console.error("Error deleting group:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};