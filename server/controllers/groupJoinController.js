import * as groupJoinModel from '../models/groupJoinModel.js';

// Send join request
export const requestJoinGroup = async (req, res) => {
  try {
    const groupId = req.params.id;
    const requesterId = req.body.user_id; // should come from auth middleware

    // check if already requested
    const existing = await groupJoinModel.getRequestsById(groupId);
    if (existing.some(r => r.requester_id === requesterId)) {
      return res.status(400).json({ message: 'Request already sent' });
    }

    // add new request
    const newRequest = await groupJoinModel.addRequest({
      group_id: groupId,
      requester_id: requesterId,
      status: 'pending',
    });

    res.status(201).json({ message: 'Join request sent', request: newRequest });
  } catch (err) {
    console.error('Error creating join request:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// List requests for a group
export const getGroupRequests = async (req, res) => {
  try {
    const groupId = req.params.id;
    const requests = await groupJoinModel.getRequestsByGroup(groupId);
    res.json(requests);
  } catch (err) {
    console.error('Error fetching requests:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Approve / reject a join request
export const updateJoinRequest = async (req, res) => {
  try {
    const requestId = req.params.requestId;
    const { status } = req.body; // "approved" or "rejected"

    const updated = await groupJoinModel.updateRequest(requestId, { status });
    if (!updated) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.json({ message: `Request ${status}`, request: updated });
  } catch (err) {
    console.error('Error updating join request:', err);
    res.status(500).json({ message: 'Server error' });
  }
};