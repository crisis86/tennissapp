import React, { useState, useEffect } from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import { Link, useLocation } from 'react-router-dom';
import { SidebarData } from './SidebarData';
import { IconContext } from 'react-icons';
import logotennis from './assets/logo.svg';



function Navbar() {
  const iduser = parseInt(sessionStorage.getItem('iduser'))
  const [sidebar, setSidebar] = useState(false);
  const [challenge, setchallenge] = useState([]);
  const showSidebar = () => setSidebar(!sidebar);
  const [badge, setbadge] = useState(false)
  const myrole = sessionStorage.getItem('userrole')
  const location = useLocation();
  
  useEffect(() => {

}, []);



// console.log(SidebarData);
  return (
    <> 
    { location.pathname !='/Presentation.html' &&
   <div>
      <IconContext.Provider value={{ color: '#fff' }}>
        <div className='navbar'>
          <Link style={{display: myrole==='admin' ? '' : 'none' }} to='#' className='menu-bars'>
            <FaIcons.FaBars onClick={showSidebar} />
          </Link>
          <div className='logo'><img height="60px" src={logotennis} alt='logo'></img></div>
        </div>
        
        <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
          <ul className='nav-menu-items' onClick={showSidebar}>
            <li className='navbar-toggle'>
              <Link to='#' className='menu-bars'>
                <AiIcons.AiOutlineClose />
              </Link>
            </li>
            {SidebarData.map((item, index) => {
              return (
                <li key={index} className={item.cName}>
                  <Link className='' to={item.path}>
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                  
                </li>
                
              );
            })}
          </ul>
        </nav>
      </IconContext.Provider>
    </div>
}
</>
  );
}


export default Navbar;