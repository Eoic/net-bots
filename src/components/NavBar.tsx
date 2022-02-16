import React from 'react'
import { NavLink } from 'react-router-dom';
import '../styles/components/_navbar.scss';

const Routes = [{
    path: '/home',
    name: 'Home'
}, {
    path: '/documentation',
    name: 'Documentation'
}, {
    path: '/login',
    name: 'Login'
}, {
    path: '/register',
    name: 'Sign up'
}];

const NavBar = () => {
    return (
        <ul className='navbar'>
            {Routes.map((route, index) => (
                <li key={index}>
                    <NavLink
                        to={route.path}
                        className={({ isActive }) => (isActive ? 'active' : '')}>
                        {route.name}
                    </NavLink>
                </li>
            ))}
        </ul>
    )
};

export default NavBar