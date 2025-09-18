
import axios from 'axios'
import  {useEffect, useState} from 'react'
import './Myinfo.css'


export default function Myinfo() {
  const [users, setUsers] = useState([])
  
useEffect(() => {
  axios.get('http://localhost:3001/users/me', {
    headers: {
      Accept: 'application/json'
    }
  })
  .then(response => {
    console.log(response.data)
    setUsers([response.data])
    
  })
 .catch(error=> {
  console.log(error)
 })
}, [])
  
  
  return (
  
  <>
  
   <div className="grid-container">
      {/* Left side */}
      <div className="container">
       
       
        <h3>Myinfo</h3>
      

      
        <p>First name:</p>
        <div>{users.length > 0 ? (
  <div>{users[0].firstname} </div>
) : (
  <p>No user found</p>
)}</div>
        <input type="text" placeholder="Current firstname" />
        <p>Last name:</p>
       {users.length > 0 ? (
  <div> {users[0].lastname}</div>
) : (
  <p>No user found</p>
)}
        <input type="text" placeholder="Current lastname" />
        <p>Email Address:</p>
        <div>{users.length > 0 ? (
  <div>{users[0].email} </div>
) : (
  <p>No user found</p>
)}</div>
        <input type="text" placeholder="Current email" />
        <button type="button">Save changes</button>
      </div>

      {/* Right side */}
      <div className="container">
        <h3>Reset password</h3>
        <p>Password old</p>
        <input type="text" placeholder="Old password" />
        <p>New password</p>
        <input type="text" placeholder="New Password" />
        <p>Confirm password</p>
        <input type="text" placeholder="Confirm new password" />
        <button type="button">Change password</button>
      </div>

      {/* Full width bottom */}
      <div className="container full-width">
        <p>
          Note that by your profile, you will{" "}
          <span style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
            Permanently
          </span>{" "}
          lose access to all of your data on your account including your
          favourites, groups and reviews.
        </p>
       <button
  type="button"
  onClick={() => {
    if (window.confirm("By deleting account you will lose all access to it, are you sure you want to delete it?")) {
      //  call your delete API or logic here
      alert("Your profile has been deleted."); 
    }
  }}>

  Delete my profile
</button>
      </div>
    </div>
  
  </>
    
  );
}
