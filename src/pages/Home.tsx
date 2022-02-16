import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import NavBar from '../components/NavBar';
import '../styles/components/_home.scss';

// https://www.npmjs.com/package/react-tsparticles

export const Home = () => {
    return (
        <div className='landing'>
            <div className='home content'>
                <NavBar/>
                <div className='header'>
                    <h1> {'<NetBots/>'} </h1>
                    <p> Multiplayer robot programming game. </p>
                    <div className='actions'>
                        <Link to='/'>
                            <button className='btn round success'>
                                Play now
                            </button>
                        </Link>
                        <a href='https://github.com/Eoic/net-bots'>
                            <button className='btn round'>
                                View on GitHub
                            </button>
                        </a>
                    </div>
                </div>
            </div>
            <div className='about-background'>
                <div className='about content'>
                    <section>
                        <div>
                            <h2> {'>'} Programming as gameplay </h2>
                            <p> 
                                Implement behavior of your robots by writing real code. Although game is not designed to teach you programming from scratch, it might help you to sharpen your coding skills, explore algorithms and AI programming.
                            </p>
                        </div>
                        <div>
                            Image
                        </div>
                    </section>

                    <section>
                        <div>
                            <h2> {'>'} Multiplayer </h2>
                            <p>
                                Compete against other players in a variety of player created games - 1 vs 1, 5 vs 5 vs 5, different maps and according to different game winning conditions.
                            </p>
                        </div>
                        <div>
                            Image
                        </div>
                    </section>

                    <section>
                        <div>
                            <h2> {'>'} Leaderboards </h2>
                            <p> 
                                Compete in the leaderboards according to various criteria of progress - achievements, gained experience, battles won, win / lose ratio and more.
                            </p>
                        </div>
                        <div>
                            Image
                        </div>
                    </section>
                </div>
            </div>
            <Footer/>
        </div>
    )
}