import React from 'react';
import Login from '../pages/Login';
import Register from '../pages/Register';
import DrawerOverlay from './DrawerOverlay';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Logout } from '../pages/Logout';
import { Home } from '../pages/Home';
import { Documentation } from '../pages/Documentation';
import { PublicPageLayout } from './PublicPageLayout';

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<DrawerOverlay />} />
                <Route path='/home' element={<Home />} />
                <Route path='/login' element={<PublicPageLayout component={<Login />} />} />
                <Route path='/logout' element={<Logout />} />
                <Route path='/register' element={<PublicPageLayout component={<Register />} />} />
                <Route path='/documentation' element={<PublicPageLayout component={<Documentation />} />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
