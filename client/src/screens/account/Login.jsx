import {useState} from "react";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import toast from 'react-hot-toast';

import { useUser } from "../../context/useUser";
import "./Login.css";

function Login(){
    const { signin } = useUser();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(false);
    const navigate = useNavigate();
    const url = import.meta.env.VITE_API_URL+"/user";

    async function handleClick(e) {
        e.preventDefault();
        try {
            const user = await signin(email, password, remember);
            if (user){
                toast.success("Succesful sign in!");
                 navigate("/");
            }
        } catch (error) {
            toast.error("Check email and password" || error);
        }
    }

    function toFrontpageWhenClosed(){
        navigate("/");
    }
    
    return(
        <div className="overlay" onClick={toFrontpageWhenClosed}>
            <div className="modal" onClick={(e)=>e.stopPropagation()}>
                <form>
                    <label>Login</label>
                    <input type="email" placeholder="enter email" onChange={e=>setEmail(e.target.value)}></input>
                    <input type="password" placeholder="enter password" onChange={e=>setPassword(e.target.value)}></input>
                    <button type="submit" onClick={e=>handleClick(e)}>Submit</button>
                    <NavLink to="/signup">No account? Sign in</NavLink>
                    <label>
                        <input type="checkbox" checked={remember} onChange={e=>setRemember(e.target.checked)}/>
                        Remember me
                    </label>
                </form>
            </div>
        </div>
    );
}

export default Login;