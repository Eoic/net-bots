import React from 'react';
import Login from '../pages/Login';
import Register from '../pages/Register';
import DrawerOverlay from './DrawerOverlay';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AccessStatus from './AccessStatus';
import { Logout } from '../pages/Logout';
import { Home } from '../pages/Home';
import { Documentation } from '../pages/Documentation';

type Props = {};

const App = (props: Props) => {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<DrawerOverlay />} />
                    <Route path='/home' element={<Home />} />
                    <Route path='/documentation' element={<Documentation />} />
                    <Route path='/login' element={<Login />} />
                    <Route path='/register' element={<Register />} />
                    <Route path='/logout' element={<Logout />} />
                </Routes>
            </BrowserRouter>
        </>
    );
};

export default App;
