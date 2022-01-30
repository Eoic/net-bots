import React from 'react';
import { Link } from 'react-router-dom';

type Props = {};

const Register = (props: Props) => {
    return (
        <div className='layout h-center v-center bg-default'>
            <form className='form small border shadow' method='POST'>
                <h3 className='title'> Sign up </h3>

                <label> Username </label>
                <input className='input' type='text' name='username'></input>

                <label> Email </label>
                <input className='input' type='email' name='email'></input>

                <label> Password </label>
                <input className='input' type='password' name='password'></input>

                <label> Repeat password </label>
                <input className='input' type='password' name='repeatPassword'></input>

                <div className='mt-8'>
                    <button type='submit' className='btn round'> Sign up </button>
                </div>

                <span className='mt-8'>
                    Already registered?
                    <Link className='link' to='/login'> Login </Link>
                </span>
            </form>
        </div>
    );
};

export default Register;
