import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

type Props = {};

const AccessStatus = (props: Props) => {
    const history = useNavigate();

    return (
        <div style={{
            position: 'absolute',
            top: 10,
            left: 10,
            height: 36,
            width: 36,
            borderRadius: '50%',
            backgroundColor: '#FFFFFF',
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
                <FontAwesomeIcon icon={faUser} color={'0x2F2F2F'} textDecoration={'none'} style={{ color: '#8499B1' }} />
            </Link>
        </div>
    )
};

export default AccessStatus;
