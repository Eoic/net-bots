import React from 'react'
import '../styles/components/_footer.scss';

const Footer = () => {
    return (
        <footer className='footer'>
            NetBots &copy; {new Date().getFullYear()}
        </footer>
    )
}

export default Footer