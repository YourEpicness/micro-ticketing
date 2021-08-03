import React from 'react'
import Link from 'next/link'
import styles from '../styles/Header.module.scss';

const Header = ({currentUser}) => {
    // shortcut way of doing links
    const links = [
        !currentUser && {label: 'Sign Up', href: '/auth/signup'},
        !currentUser && {label: 'Sign In', href: '/auth/signin'},
        currentUser && {label: 'Sign Out', href: '/auth/signout'}
    ]
        .filter(linkConfig => linkConfig)
        .map(({label, href}) => {
            return <li key={href}>
                <Link href={href}>
                    <a href="" className={styles['nav-link']}> {label}</a>
                </Link>
              
            </li>
        })


    return (
        <div className={styles['nav-container']}>
            <nav className={styles.nav}>
                <Link href="/">
                    <a className={`${styles.link} ${styles.logo}`}>TickItz</a>
                </Link>

                <div className={styles['signout']}>
                    <ul className={styles.navbar}>
                        {links}
                    </ul>
                </div>
            </nav>
        </div>
    )
}

export default Header
