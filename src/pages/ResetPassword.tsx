import React, { useState } from 'react';

const ResetPassword = () => {
    const fields = ['email'];
    const [isLoading, setIsLoading] = useState(false);
    const [formErrors, setFormErrors] = useState<[]>([]);
    
    return (
        <div className='center-vh'>
            <form className='form small border shadow bg-dark' method='POST'>
                <h3 className='title'> Reset your password </h3>

                {formErrors.length > 0 && <div style={{ backgroundColor: '#dc143c4f', padding: 10, borderRadius: 3 }}>
                    {formErrors.map((error, index) => <p key={index}> {error} </p>)}
                </div>}

                <label> Email </label>
                <input className='input' type='email' name='email'></input>

                <div className='mt-8'>
                    <button type='submit' className={`btn round ${isLoading && 'loading'}`} onClick={() => setIsLoading(true)}>
                        Send a recovery link
                    </button>
                </div>
            </form>
        </div>
    )
}

export default ResetPassword