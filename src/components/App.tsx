import React from 'react';
import Login from '../pages/Login';
import Register from '../pages/Register';
import DrawerOverlay from './DrawerOverlay';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AccessStatus from './AccessStatus';

type Props = {};

const App = (props: Props) => {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<DrawerOverlay />} />
                    <Route path='/login' element={<Login />} />
                    <Route path='/register' element={<Register />} />
                </Routes>
            </BrowserRouter>
        </>
    );
};

export default App;
