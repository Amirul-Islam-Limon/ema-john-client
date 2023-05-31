import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import './SignUp.css'
import { AuthContext } from '../../contexts/UserContext';

const SignUp = () => {
    const [error, setError]=useState(null);
    const {user,createUser} = useContext(AuthContext);
    

    const handleSubmit=(event)=>{
        event.preventDefault();
        const form = event.target;
        const email = form.email.value;
        const password=form.password.value;
        const confirm = form.confirm.value;
        console.log(email, password, confirm);

        if(password.length < 6){
            setError("Password should be 6 character or more");
            return;
        }
        if(password !== confirm){
            setError("Your password did not match");
            return;
        }

        createUser(email,password)
        .then(result=>{
            const user = result.user;
            console.log(user);
        })
        .catch(error=>{
            console.error(error);
        })
        
    }

    return (
        <div className='form-container'>
            <h1 className='form-title'>Sign Up</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-control">
                    <label htmlFor="email">Email</label>
                    <input type="email" name="email" id="email" required/>
                </div>
                <div className="form-control">
                    <label htmlFor="password">Password</label>
                    <input type="password" name="password" id="password" required/>
                </div>
                <div className="form-control">
                    <label htmlFor="confirm">Confirm Password</label>
                    <input type="password" name="confirm" id="confirm" required/>
                </div>
                {error? <p className='error-message'>{error}</p>:""}
                <input className='btn-submit' type="submit" value="Sign Up" />
            </form>
            <p>Already Have an Account? <Link to="/login">Login</Link></p>
        </div>
    );
};

export default SignUp;