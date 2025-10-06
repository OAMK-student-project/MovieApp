import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import UserContext from "./UserContext";

axios.defaults.withCredentials = true;

function UserProvider({ children }) {
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    //const [refreshToken, setRefreshToken] = useState(null);
    const [remaining, setRemaining] = useState(null);
    const url = import.meta.env.VITE_API_URL + "/user";

    const signin = async (email, password, remember) => {
        const headers = { headers: { "Content-Type": "application/json" } };
        const { data } = await axios.post(url+"/signin", {email, password, remember}, headers);
        setAccessToken(data.accessToken);
        setUser(prev => ({ ...(prev ?? {}), userID: data.userID, email: data.email, identifiedUser: true }));
        if (remember) localStorage.setItem("uid", String(data.userID));
        return true;
    };

    const signout = async () => {
    try {
        const uid = user?.userID ?? localStorage.getItem("uid");
        if (uid) {
        const headers = { headers: { "Content-Type": "application/json" } };
        await axios.post(url + "/signout", { userID: uid }, headers); // backend clearCookie + revoke
        toast.success("Succesful sign out!");
        }
    } catch (error) {
        toast.error("Sign out failed");
        console.error(error);
    }

    setUser(null);
    setAccessToken(null);
    setRemaining(null);
    localStorage.removeItem("uid");
    };

    const signup = async (email, password, firstname, lastname) => {
    try {
        const headers = { headers: { "Content-Type": "application/json" } };
        const { data } = await axios.post(
        url + "/signup",
        { email, password, firstname, lastname },
        headers
        );
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
    };

    const refreshTokens = async () => {
        try {
            const uid = user?.userID ?? localStorage.getItem("uid");
            if (!uid) return;
            const headers = { headers: { "Content-Type": "application/json" } };
            const { data } = await axios.post(url + "/refresh", { userID: uid, remember: Boolean(localStorage.getItem("uid"))  }, headers); 
            setAccessToken(data.accessToken);
            setUser(prev => ({ ...(prev ?? {}), userID: Number(uid), identifiedUser: true }));
        return;
        } catch (error) {
            console.error(error);
        }
    }

    function parseAccessToken() {
        try {
            const base64Url = accessToken.split('.')[1];
            let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const pad = base64.length % 4;
            if (pad) base64 += '='.repeat(4 - pad);
            const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
            );
            return JSON.parse(jsonPayload);
        } catch (e) {
            console.error("Virhe tokenin parsimisessa", e);
            return null;
        }
    }

    useEffect(()=>{
        if(!accessToken && localStorage.getItem("uid")) {
            refreshTokens();
        }
    },[]);

    useEffect(() => {
    const id = axios.interceptors.request.use((config) => {
        if (accessToken) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    });
    return () => axios.interceptors.request.eject(id);
    }, [accessToken]);


    useEffect(() => {
        let timeoutId;
        if (!accessToken) return;

        const payload = parseAccessToken();
        if(!payload?.exp) return;

        const now = Math.floor(Date.now()/1000);
        const secondsLeft = payload.exp - now;
        setRemaining(secondsLeft);

        const takeAction = Math.max((secondsLeft - 60)* 1000, 0);
        timeoutId = setTimeout(()=>{
            refreshTokens();
        }, takeAction);

        const intervalId = setInterval(()=>{
            const now2 = Math.floor(Date.now()/1000);
            setRemaining(payload.exp - now2);
        }, 1000);

        return(()=>{
            clearTimeout(timeoutId);
            clearInterval(intervalId);
        });
    }, [accessToken]);

    useEffect(()=>{
    }, [user]);
    return (
        <UserContext.Provider value={{ user, signin, signout, signup }}>
            {children}
        </UserContext.Provider>
    );
}

export default UserProvider;
