import axios from 'axios';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CLIENT_URL } from '../utilities/constants';

export const Logout = () => {
    const history = useNavigate();

    useEffect(() => {
        axios.delete(`${CLIENT_URL}/user/logout`, { withCredentials: true }).finally(() => history('/login'));
    }, []);

    return (<p className='text'> Logging out... </p>);
}