import { useEffect, useState, useMemo } from "react"
import axios from "axios"
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCrown, faTrash } from "@fortawesome/free-solid-svg-icons"
import "./GroupMembers.css"

axios.defaults.withCredentials = true

export default function GroupMembers({ groupId, isOwner=false }) {
  const API_URL = import.meta.env.VITE_API_URL
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
  const controller = new AbortController();

  (async () => {
    try {
      const res = await axios.get(
        `${API_URL}/groups/${groupId}/members`,
        { withCredentials: true, signal: controller.signal }
      );
      const arr = Array.isArray(res.data?.members) ? res.data.members : []
      setMembers(arr)
    } catch (e) {
      if (e.name === "CanceledError") return
      console.error(e)
      setError(e.response?.data?.error || "Failed to load members")
    } finally {
      setLoading(false)
    }
  })();

  return () => controller.abort()
}, [groupId, API_URL]);

  const norm = (r) => String(r || "").toLowerCase()
  const roleOrder = (r) => ({ owner:0, member:1 } [norm(r)] ?? 99)

  const sorted = useMemo(() => {
    return [...members].sort((a,b) => {
        const ra = roleOrder(a.role), rb = roleOrder(b.role)
        if (ra !== rb) return ra - rb
        const an = `${a.firstname || ""} ${a.lastname || ""}`.trim()
        const bn = `${b.firstname || ""} ${b.lastname || ""}`.trim()
        return an.localeCompare(bn, undefined, { sensitivity: "base"})
    });
  }, [members]);

  async function removeMember(memberIdentifier, member) {
  if (!window.confirm("Remove this member from the group?")) return
  try {
    await axios.delete(
      `${API_URL}/groups/${groupId}/members/${memberIdentifier}`,
      { withCredentials: true } 
    )
    setMembers(prev =>
      prev.filter(m =>
        String(m.membership_id ?? m.user_id) !== String(memberIdentifier)
      )
    )
    const who = `${member?.firstname ?? ""} ${member?.lastname ?? ""}`.trim() || "Member"
    toast.success(`${who} removed`)
  } catch (e) {
    console.error(e)
    const msg = e.response?.data?.error || e.response?.data?.message || e.message
    toast.error(msg)
  }
}

  if (loading) return <p>Loading members...</p>;
  if (error)   return <p>{error}</p>;
  if (members.length === 0) return <p>No members yet.</p>;

  return (
    <ul className="members">
      {sorted.map((m) => (
        <li key={m.membership_id ?? `${m.user_id}-${m.group_id}`} className="member-row">
          <div className="member-name">{m.firstname ?? ""} {m.lastname ?? ""}</div>
          <div className="member-email">{m.email ?? ""}</div>
          <span className={`role-badge role-${norm(m.role)}`} title={norm(m.role)}>
            {norm(m.role) === "owner" ? (
                <FontAwesomeIcon icon={faCrown} className="owner-crown" />
            ) : (
                "MEMBER"
            )}
          </span>

          {isOwner && norm(m.role) !== "owner" && (
            <button
                className="btn-remove"
                aria-label={`Remove ${m.firstname} ${m.lastname ?? ""}`}
                title="Remove member"
                onClick={() => removeMember(m.user_id, m)}
            >
                <FontAwesomeIcon icon={faTrash} />
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}