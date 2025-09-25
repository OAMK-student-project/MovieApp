import { createContext } from "react";

const userContext = createContext({
    userID: null,
    email: null,
    accessToken: null,
    refreshToken: null,
    identifiedUser: false,
    rememberMe: false,
});

export default userContext;