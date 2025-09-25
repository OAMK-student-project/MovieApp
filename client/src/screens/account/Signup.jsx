import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useUser } from "../../context/useUser.js";
import "./Signup.css";

function Signup(){
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const { signup } = useUser();
  const navigate = useNavigate();

  async function handleSubmit(e){
    e.preventDefault();
    const ok = await signup(email, password, firstname, lastname);
    if (ok) navigate("/login");
  }

  function toLoginWhenClosed(){
    navigate("/login");
  }

  return (
    <div className="overlay" onClick={toLoginWhenClosed}>
      <div className="modal" onClick={(e)=>e.stopPropagation()}>
        <label>Sign up</label>
        <form className="signUpForm" onSubmit={handleSubmit}>
          <input type="text" placeholder="first name" value={firstname} onChange={e=>setFirstname(e.target.value)} />
          <input type="text" placeholder="last name" value={lastname} onChange={e=>setLastname(e.target.value)} />
          <input type="email" placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} />
          <input type="password" placeholder="password" value={password} onChange={e=>setPassword(e.target.value)} />
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
