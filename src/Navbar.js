import React, { useState, useEffect } from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { SidebarData } from './SidebarData';
import { IconContext } from 'react-icons';
import logotennis from './assets/Super-tennis.png';

function Navbar() {
  const iduser = parseInt(sessionStorage.getItem('iduser'))
  const [sidebar, setSidebar] = useState(false);
  const [challenge, setchallenge] = useState([]);
  const showSidebar = () => setSidebar(!sidebar);
  const [badge, setbadge] = useState(false)


  useEffect(() => {

    if(iduser !== null || iduser !== 0) {
    //  notificasfida();
    }


}, []);



  function notificasfida() {
       
  
    fetch(window.$produrl+"/challenge?status!=cancel", {
        method:'GET'
        }).then(res => {
            if (!res.ok) {
           // console.log('nulla')
                return false 
            }
            return res.json();
        }).then(res => {
                       
          setchallenge(res);
           
          const found = challenge.filter(obj => {
          
           if (obj.id === iduser) { 
          if (obj.status === 'processing' || obj.status === "pending") {
           
            setbadge(true);
            }
            }
          return obj.id===iduser;
           
        })

        console.log(found)

        console.log(badge)

        });
  }

// console.log(SidebarData);
  return (
   <div>
      <IconContext.Provider value={{ color: '#fff' }}>
        <div className='navbar'>
          <Link to='#' className='menu-bars'>
            <FaIcons.FaBars onClick={showSidebar} />
          </Link>
          <div className='logo'><img width="150px" src={logotennis} alt='logo'></img></div>
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
  );
}

export default Navbar;