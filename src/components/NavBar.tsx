import React from 'react'
import { Link } from 'react-router-dom';
import '../styles/components/_navbar.scss';

const NavBar = () => {
  return (
    <ul className='navbar'>
        <li> 
            <Link className='active' to='/home'> Home </Link>
        </li>
        <li>
            <Link to='/documentation'> Documentation </Link>
        </li>
        <li>
            <Link to='/login'> Login </Link>
        </li>
        <li> 
            <Link to='/register'> Sign up </Link>
        </li>
    </ul>
  )
}

export default NavBar