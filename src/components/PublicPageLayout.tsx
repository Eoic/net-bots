import Footer from './Footer';
import NavBar from './NavBar';
import React, { useEffect } from 'react'

type Props = {
    component: React.ReactNode
}

export const PublicPageLayout = ({ component }: Props) => {

    return (
        <div className='page bg-dark-alt'>
            <div className='navbar-wrapper'>
                <NavBar />
            </div>
            {component}
            <Footer />
        </div>
    );
}