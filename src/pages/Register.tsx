import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import NavBar from '../components/NavBar';

type Props = {};

const Register = (props: Props) => {
    const [formErrors, setFormErrors] = useState<[]>([]);

    return (
        <div className='center-vh'>
            <form className='form small border shadow bg-dark' method='POST'>
                <h3 className='title'> Sign up </h3>

                {formErrors.length > 0 && <div style={{ backgroundColor: '#dc143c4f', padding: 10, borderRadius: 3 }}>
                    {formErrors.map((error, index) => <p key={index}> {error} </p>)}
                </div>}

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
