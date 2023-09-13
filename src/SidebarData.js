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
    icon: <FaIcons.FaCartPlus />,
    cName: 'nav-text'
  },
   {
    title: 'Posts',
    path: '/Post',
    icon: <FaIcons.FaCartPlus />,
    cName: 'nav-text'
  }, 
  {
    title: 'Le mie Sfide',
    path: '/Mychallenge',
    icon: <FaIcons.FaCartPlus />,
    cName: 'nav-text'
  },
  {
    title: 'AdmiChallenge',
    path: '/AdminChallenge',
    icon: <FaIcons.FaCartPlus />,
    cName: 'nav-text'
  }
];
