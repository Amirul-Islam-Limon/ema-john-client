import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../images/Logo.svg';
import './Header.css';
import { AuthContext } from '../../contexts/UserContext';

const Header = () => {
    const {user, logOut}=useContext(AuthContext);
    console.log(user);

    return (
        <nav className='header'>
            <img src={logo} alt="" />
            <div>
                <Link to="/">Shop</Link>
                <Link to="/orders">Orders</Link>
                <Link to="/inventory">Inventory</Link>
                <Link to="/about">About</Link>
                {
                    user?.email?
                    <button onClick={logOut} className='btn-log-out'>Log Out</button>
                    :
                    <>
                        <span className='login-signUp'>
                        <Link to="/login">Login</Link>
                        <Link to="/signup">Sign Up</Link>
                        </span>
                    </>
                }
                <span className='user-email'>{user?.email}</span>
            </div>
        </nav>
    );
};

export default Header;