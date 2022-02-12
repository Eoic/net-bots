import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CLIENT_URL } from '../utilities/constants';

const Login = () => {
    const fields = ['username', 'password'];
    const [isLoading, setIsLoading] = useState(false);
    const [formErrors, setFormErrors] = useState<[]>([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        axios.get(`${CLIENT_URL}/user/profile`, { withCredentials: true }).then((response) => {
            setUser(response.data);
            setIsAuthenticated(true);
        }).catch(() => setIsAuthenticated(false));
    }, [isLoading]);

    const handleSubmit = (event) => {
        event.preventDefault();
        
        const data = {};
        const formData = new FormData(event.target);
        
        for (const field of fields)
            data[field] = formData.get(field);

        axios.post(
            `${CLIENT_URL}/user/login`,
            data,
            { withCredentials: true }
        ).catch((error) => {
            const errors = error.response.data.errors;
            setFormErrors(errors);
        }).finally(() => setTimeout(() => setIsLoading(false), 1000));
    }

    return (
        <div className='layout h-center v-center bg-default'>
            {!isAuthenticated ?
                <form className='form small border shadow' method='POST' onSubmit={handleSubmit}>
                    <h3 className='title'> Login </h3>

                    {formErrors.length > 0 && <div style={{ backgroundColor: '#dc143c4f', padding: 10, borderRadius: 3 }}>
                        {formErrors.map((error, index) => <p key={index}> {error} </p>)}
                    </div>}

                    <label > Username </label>
                    <input className='input' type='text' name='username'></input>

                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <label> Password </label>
                        <a href='#' className='link'> Forgot password? </a>
                    </div>

                    <input className='input' type='password' name='password'></input>

                    <div className='mt-8'>
                        <button type='submit' className={`btn round ${isLoading && 'loading'}`} onClick={() => setIsLoading(true)}>
                            Login
                        </button>
                    </div>

                    <span className='mt-8'>
                        New user?
                        <Link className='link' to='/register'> Sign up </Link>
                    </span>
                </form> :
                <div>
                    <p className='text'> Logged in as "{(user as any).username}". </p>
                    <span className='mt-8' style={{ display: 'block'}}>
                        <Link className='link' to='/'> Home </Link>
                        <Link className='link' to='/logout'> Logout </Link>
                    </span>
                </div>
            }
        </div>
    );
};

export default Login;
