import React from 'react';
import './header.css';
import logo from './images/logo.jpg';
import { Link } from 'react-router-dom';


function Header({isAdmin}) {
    return (
            <div className="headerBackground">
                <img className="logo" src={logo} />
                <ul className='navigationMenu'>
                {isAdmin && <Link to={`/admin`}><li className="cartButton"><a style={{color:"gold", fontWeight:"600"}}>АДМИН ПАНЕЛ</a></li></Link>}

                <Link to={`/`}><li><a>НАЧАЛО</a></li></Link>
                <Link to={`/`}><li><a>ЗА НАС</a></li></Link>
                <Link to={`/`}><li><a>ПРОФИЛ</a></li></Link>
                <Link to={`/cart`}><li className="cartButton"><a>КОЛИЧКА</a></li></Link>
                </ul>
            </div>
    )
}

export default Header;