import React from 'react';

type Props = {};

const Login = (props: Props) => {
    return (
        <div style={{ backgroundColor: 'white', height: '100%', width: '100%' }}>
            <form>
                <input type='text'></input>
                <input type='text'></input>
                <button type='submit' className='btn'> Login </button>
            </form>
        </div>
    );
};

export default Login;
