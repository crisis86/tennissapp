import React from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';

export const SidebarData = [
  {
    title: 'Home',
    path: '/',
    icon: <AiIcons.AiFillHome />,
    cName: 'nav-text'
  },
  {
    title: 'Player',
    path: '/Player',
    icon: <IoIcons.IoIosPaper />,
    cName: 'nav-text'
  },
  {
    title: 'Classifica',
    path: '/ChallengeList',
    icon: <IoIcons.IoIosPaper />,
    cName: 'nav-text'
  },
   {
    title: 'Posts',
    path: '/Post',
    icon: <IoIcons.IoIosPaper />,
    cName: 'nav-text'
  }, 
  {
    title: 'Eventi',
    path: '/AdminChallenge',
    icon: <IoIcons.IoIosPaper />,
    cName: 'nav-text'
  },
  {
    title: 'Landing',
    path: '/Presentation.html',
    icon: <IoIcons.IoIosPaper />,
    cName: 'nav-text'
  }
];
