import React, { useRef } from 'react';
import { MenuStack } from './MenuStack';
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
    const menuRef = useRef<HTMLUListElement>(null);

    return (
        <div>
            <MenuStack menu={menuRef} />
            <ul className='navbar' ref={menuRef}>
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
        </div>
    )
};

export default NavBar