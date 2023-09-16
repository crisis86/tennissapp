import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import * as FaIcons6 from 'react-icons/fa6';
import * as HiIcons from 'react-icons/hi';
import * as FaIcons from 'react-icons/fa';
import iconhome from './assets/icone/home.svg';
import iconclass from './assets/icone/classifica-1.svg';
import iconprofilo from './assets/icone/profilo.svg';
import iconpost from './assets/icone/post.svg';
import iconchallenge from './assets/icone/sfide.svg';

import iconhomeActive from './assets/icone/home-active.svg';
import iconclassActive from './assets/icone/classifica-1-active.svg';
import iconprofiloActive from './assets/icone/profilo-active.svg';
import iconpostActive from './assets/icone/post-active.svg';
import iconchallengeActive from './assets/icone/sfide-active.svg';


const AppFooter = () => {
    const [displayusername, displayusernameupdate] = useState('');
    const [showmenu, showmenuupdateupdate] = useState(false);

    const location = useLocation();
    const iduser = parseInt(sessionStorage.getItem('iduser'))

    useEffect(() => {
        if (location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/Regolamento.html') {
            showmenuupdateupdate(false);
        } else {
        
            showmenuupdateupdate(true);
            let username = sessionStorage.getItem('iduser');
            if (username === '' || username === null) {
                //   usenavigate('/login');
            } else {
                displayusernameupdate(username);

            }
        }

    }, [location])

    return (
        <>
            {showmenu &&
                <div className="views tabs safe-areas">
                    <div id="tabbar" className="toolbar toolbar-bottom tabbar tabbar-labels color-theme-mono">
                        <div className="toolbar-inner">
                            <a href="/" className="tab-link tab-link-active">
                                <span className="icons">
                                {location.pathname === '/' || location.pathname === 'home' ? (
                                  <img src={iconhomeActive} width={30} />
                                ):(
                                   <img src={iconhome} width={30} />
                                )}
                                </span>
                            </a>
                            <a href="/Mychallenge" className="tab-link">
                                <span className="icons">
                                {location.pathname === '/Mychallenge' ? (
                                  <img src={iconchallengeActive} width={30} />
                                ):(
                                   <img src={iconchallenge} width={30} />
                                )}
                                </span>                           
                            </a>
                            <a href="/ChallengeList" className="tab-link">
                                <span className="icons">
                                {location.pathname === '/ChallengeList' ? (
                                  <img src={iconclassActive} width={30} />
                                ):(
                                   <img src={iconclass} width={30} />
                                )}
                                </span>
                            </a>
                            <a href="/post" className="tab-link">
                                <span className="icons">
                                {location.pathname === '/post' ? (
                                  <img src={iconpostActive} width={30} />
                                ):(
                                   <img src={iconpost} width={30} />
                                )}
                                </span>
                            </a>
                            <a href={'/edit/' + iduser} className="tab-link">
                                <span className="icons">
                                {location.pathname.includes('/edit') ? (
                                  <img src={iconprofiloActive} width={22} />
                                ):(
                                   <img src={iconprofilo} width={22} />
                                )}                                </span>
                            </a>
                        </div>
                    </div>
                    <div id="view-main" className="view view-main tab tab-active"></div>
                    <div id="view-components" className="view view-components tab"></div>
                    <div id="view-screens" className="view view-screens tab"></div>
                    <div id="view-integrations" className="view view-integrations tab"></div>
                    <div id="view-more" className="view view-more tab"></div>

                </div>
            }
        </>

    );
}

export default AppFooter;
