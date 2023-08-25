import { useEffect } from "react";
import {Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Home = () => {

  const usenavigate = useNavigate();
  const uname = sessionStorage.getItem('email')
  const datiuserloging= JSON.parse(localStorage.getItem('datiuserlogin'))
 

  useEffect(() => {
let email = sessionStorage.getItem('email')
 
if (email==='' || email===null) {
  toast.error('Not Authenticate session');
  usenavigate('/login');
}
}, []);


  return ( 
      <div className="backgroundhome">
        
      
      <h2>Tennis App V: 1.1</h2>
      
      <p> tu sei il giocatore <b> {datiuserloging.email} </b> </p>     
      <p>Versione Demo per test funzionalità e Debug</p>
      </div> 
   );
}
 
export default Home;
