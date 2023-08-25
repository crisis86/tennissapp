import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Appheader = () => {
    const [displayusername, displayusernameupdate] = useState('');
    const [showmenu, showmenuupdateupdate] = useState(false);
    const usenavigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.pathname === '/login' || location.pathname === '/register') {
            showmenuupdateupdate(false);
        } else {
            showmenuupdateupdate(true);
            let username = sessionStorage.getItem('iduser');
            if (username === '' || username === null) {
                usenavigate('/login');
            } else {
                displayusernameupdate(username);
              
            }
        }

    }, [location])
    return (
        <div>
            {showmenu &&
                <div className="header">

                    
                    <span style={{ float: 'left' }}>Welcome <i>{sessionStorage.getItem('fullname')}</i>  </span>
                   <span>  <Link className="logout" style={{ float: 'right', color: '#ffffff !important' }} to={'/login'}>Logout</Link> </span>
                </div>
            }
        </div>
    );
}

export default Appheader;