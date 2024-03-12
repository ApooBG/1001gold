import React from 'react';
import styles from './header.module.css';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from './config';

function Header({isAdmin}) {
    return (
            <div className={styles.headerBackground}>
                <img className={styles.logo} src={`/images/logo.jpg`} alt="Logo" />
                <ul className={styles.navigationMenu}>
                    {isAdmin && <Link to={`/admin`}><li className={styles.cartButton}><a style={{color:"gold", fontWeight:"600"}}>АДМИН ПАНЕЛ</a></li></Link>}

                    <Link to={`/`}><li><a>НАЧАЛО</a></li></Link>
                    <Link to={`/`}><li><a>ЗА НАС</a></li></Link>
                    <Link to={`/`}><li><a>ПРОФИЛ</a></li></Link>
                    <Link to={`/cart`}><li className={styles.cartButton}><a>КОЛИЧКА</a></li></Link>
                </ul>
            </div>
    )
}

export default Header;