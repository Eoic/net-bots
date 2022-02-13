import React from 'react';
import NavBar from '../components/NavBar';
import '../styles/components/_home.scss';

// https://www.npmjs.com/package/react-tsparticles

export const Home = () => {
    return (
        <div className='landing'>
            <div className='home'>
                <NavBar/>
                <div className='header'>
                    <h1> {'<NetBots/>'} </h1>
                    <p> Multiplayer robot programming game. </p>
                    <div className='actions'>
                        <button className='btn round success'>
                            Play now
                        </button>
                        <button className='btn round'>
                            View on GitHub
                        </button>
                    </div>
                </div>
            </div>
            <div className='about'>
                <section>
                    <h2> Programming as gameplay </h2>
                    <p> Implement behavior of your robots by writing real code. 
                        Sharpen your coding skills, explore algorithms and AI programming
                    </p>
                </section>
            </div>
        </div>
    )
}