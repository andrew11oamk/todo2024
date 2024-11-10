import { Link, useNavigate } from "react-router-dom";
import './Authentication.css';
import React from "react"; 
import { useUser } from "../context/useUser";

export const AuthenticationMode = Object.freeze({
    Login: 'Login',
    Register: 'Register'
})

export default function Authentication({authenticationMode}) {
    const { user, setUser, signUp, signIn } = useUser()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (authenticationMode === AuthenticationMode.Register) {
                await signUp()
                navigate('/login')
            } else {
                await signIn()
                navigate('/')
            }
        } catch(error) {
            const message = error.message && error.response.data ? error.response.data.error : error
            alert(message)
        }
    }
    return (
        <div>
            <h3>{authenticationMode === AuthenticationMode.Login ? 'Sign In' : 'Sign Up'}</h3>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email</label>
                    <input type="email" value={user.email} onChange={e => setUser({...user,email: e.target.value})} />
                </div>
                <div>
                    <label>Password</label>
                    <input type="password" value={user.password} onChange={e => setUser({...user,password: e.target.value})}/>
                </div>
                <div>
                    <button>{authenticationMode === AuthenticationMode.Login ? 'Log In' : 'Submit'}</button>
                </div>
                <div>
                    <Link to={authenticationMode === AuthenticationMode.Login ? '/register' : '/login'}>
                    {authenticationMode === AuthenticationMode.Login ? 'No account? Sign Up' : 'Already sign up? Sign In'}
                    </Link>
                </div>
            </form>
        </div>
    )
}