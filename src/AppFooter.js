import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import * as FaIcons6 from 'react-icons/fa6';
import * as HiIcons from 'react-icons/hi';
import * as FaIcons from 'react-icons/fa';

const AppFooter = () => {
    const [displayusername, displayusernameupdate] = useState('');
    const [showmenu, showmenuupdateupdate] = useState(false);
    const usenavigate = useNavigate();
    const location = useLocation();
    const iduser = parseInt(sessionStorage.getItem('iduser'))

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
        <>
            {showmenu &&
                <div className="views tabs safe-areas">
                    <div id="tabbar" className="toolbar toolbar-bottom tabbar tabbar-labels color-theme-mono">
                        <div className="toolbar-inner">
                            <a href="/" className="tab-link tab-link-active">
                                <span className="icons">
                                    <FaIcons6.FaHouse style={{ fontSize: '25px', color: '#32ab32' }} />,
                                </span>
                                {/*   <span className="tabbar-label" data-i18n="home">Home</span> */}
                            </a>
                            <a href="/Mychallenge" className="tab-link">
                                <span className="icons">
                                    <FaIcons.FaCalendarAlt style={{ fontSize: '25px', color: '#32ab32' }} />,

                                </span>
                                {/* <span className="tabbar-label" data-i18n="components">Components</span> */}
                            </a>
                            <a href="/ChallengeList" className="tab-link">
                                <span className="icons">
                                    <HiIcons.HiChartBar style={{ fontSize: '25px', color: '#32ab32' }} />,

                                </span>
                                {/*  <span className="tabbar-label" data-i18n="screens">Screens</span> */}
                            </a>
                            <a href="/post" className="tab-link">
                                <span className="icons">
                                    <FaIcons6.FaRegNewspaper style={{ fontSize: '25px', color: '#32ab32' }} />,
                                </span>
                                {/*   <span className="tabbar-label" data-i18n="integrations">Integrations</span> */}
                            </a>
                            <a  href={'/edit/' + iduser} className="tab-link">
                                <span className="icons">
                                    <HiIcons.HiUser style={{ fontSize: '25px', color: '#32ab32' }} />,
                                </span>
                                {/*  <span className="tabbar-label" data-i18n="more">More</span> */}
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
