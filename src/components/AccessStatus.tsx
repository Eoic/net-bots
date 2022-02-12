import { faCalendar, faUser, faLock, faLockOpen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CLIENT_URL } from '../utilities/constants';

type Props = {};

const AccessStatus = (props: Props) => {
    const history = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        axios.get(`${CLIENT_URL}/user/profile`, { withCredentials: true }).then(() => {
            setIsAuthenticated(true);
        }).catch(() => setIsAuthenticated(false));
    }, []);

    return (
        <div style={{
            position: 'absolute',
            top: 10,
            left: 10,
            height: 36,
            width: 36,
            borderRadius: '50%',
            backgroundColor: `${isAuthenticated ? '#00917C' : 'crimson'}`,
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            boxShadow: '0 0 5px rgba(0, 0, 0, 1)'
        }}
            onClick={(event) => {
                event.preventDefault();
                history('/login');
            }}
        >
            <Link to='login' onClick={(event) => event.preventDefault()}>
                {
                    isAuthenticated ?
                        <FontAwesomeIcon icon={faLockOpen} textDecoration={'none'} style={{ color: '#FFFFFF' }} /> :
                        <FontAwesomeIcon icon={faLock} textDecoration={'none'} style={{ color: '#FFFFFF' }} />
                }
            </Link>
        </div>
    )
};

export default AccessStatus;
