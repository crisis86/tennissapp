import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Appheader = () => {
    const [displayusername, displayusernameupdate] = useState('');
    const [showmenu, showmenuupdateupdate] = useState(false);
    const usenavigate = useNavigate();
    const location = useLocation();

    const [badge, setbadge] = useState(false)
    const fullname = sessionStorage.getItem('fullname');

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

    

    function checksfida() {
        fetch(window.$produrl + "/challenge?status!=cancel&q=" +fullname,
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


                    <span style={{ float: 'left' }}>Ciao <i>{sessionStorage.getItem('fullname')}</i>  </span>
                    {badge && <span className="badge">News</span>}
                    <span>  <Link className="logout" style={{ float: 'right', color: '#ffffff !important' }} to={'/logout'}>Logout</Link> </span>
                </div>
            }
        </div>
    );
}

export default Appheader;