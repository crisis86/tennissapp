import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import * as FaIcons from 'react-icons/fa';

const Appheader = () => {
    const [displayusername, displayusernameupdate] = useState('');
    const [showmenu, showmenuupdateupdate] = useState(false);
    const usenavigate = useNavigate();
    const location = useLocation();
 
    const [badge, setbadge] = useState(false)
    const datiuserloging = JSON.parse(localStorage.getItem('datiuserlogin'))

    //const [contatore, setcount] = useState(0);


    useEffect(() => {

         
          //  let count = parseInt(sessionStorage.getItem("onlineUsers") || "0", 10);
          //  count += 1;
          //  sessionStorage.setItem("onlineUsers", count);
          //  setcount(count);
     

        if (location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/Regolamento.html') {
            showmenuupdateupdate(false);
        } else {
            showmenuupdateupdate(true);
            let username = sessionStorage.getItem('iduser');
            if (username === '' || username === null) {
              //  usenavigate('/login');
            } else {
                displayusernameupdate(username);

            }
        }

    }, [location])

   

    function checksfida() {
        fetch(window.$produrl + "/challenge?status!=complete",
            {
                headers: {
                    accept: 'application/json',
                }
            }).then((res) => {

                return res.json();
            }).then((resp) => {
                if (Object.keys(resp).length === 0) {
                    setbadge(false)
                } else {
                    setbadge(true)
                }
            }).catch((err) => {
                console.log(err.message)

            });
    }

    return (
        <div>
            {showmenu &&
                <div className="header">


                    <span style={{ marginTop:'3px', float: 'left' }}><b>Ciao,</b> <i>{sessionStorage.getItem('fullname')} - {sessionStorage.getItem('clubname')}</i> 
                    </span>
                    {badge === true && <span className="badge">News</span>}
                    <span>  <Link className="logout" style={{ float: 'right', color: '#ffffff !important' }} to={'/logout'}>
                    <FaIcons.FaSignOutAlt style={{color: '#ffffff' }} /></Link> </span>
                </div>
            }
        </div>
    );
}

export default Appheader;