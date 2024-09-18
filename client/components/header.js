import Link from 'next/link';


export default function Header({ currentUser }) {
    const links = [
       !currentUser && { label: 'Sign Up' , href: '/auth/signup' },
       !currentUser && { label: 'Sign In' , href: '/auth/signin' },
       currentUser && { label: 'Sign Out' , href: '/auth/signout' },
    ]
    .filter(config => config)
    .map(({ label, href}) => {
        return (
            <li key={label} className='nav-item'>
                <Link href={href} style={{ textDecoration: 'none' , paddingRight: '1rem' , color: 'black' }}>
                        {label}
                </Link>
            </li>
        )
    } )
    return (
        <nav className="navbar  navbar-light bg-light">
            <Link href="/">
               MyApp
            </Link>
            <div className='d-flex justify-content-end'>
                <ul className='nav d-flex align-items-center'>
                    {links}
                </ul>
            </div>
        </nav>
 
    )
}