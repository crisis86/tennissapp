import RenoveCookie from "./hooks/removeCookie";
import {useEffect } from "react";
import {useNavigate } from "react-router-dom";
const Logout = () => {

    const usenavigate = useNavigate();


    useEffect(() => {
        RenoveCookie('utente')
        sessionStorage.clear();
        usenavigate('/login')
      
     }, []);

    return ( 
       <h1>Logout</h1>
     );
}
 
export default Logout;