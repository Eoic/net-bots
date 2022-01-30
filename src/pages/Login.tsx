import React from 'react';
import { Link } from 'react-router-dom';

type Props = {};

const Login = (props: Props) => {
    return (
        <div className='layout h-center v-center bg-default'>
            <form className='form small border shadow' method='POST'>
                <h3 className='title'> Login </h3>

                <label > Username or email </label>
                <input className='input' type='text' name='username'></input>

                <label> Password </label>
                <input className='input' type='password' name='password'></input>

                <div className='mt-8'>
                    <button type='submit' className='btn round'> Login </button>
                </div>

                <span className='mt-8'>
                    New user?
                    <Link className='link' to='/register'> Sign up </Link>
                </span>
            </form>
        </div>
    );
};

export default Login;
