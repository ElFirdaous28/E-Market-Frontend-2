import { Route } from 'react-router-dom'
import Login from '../pages/Auth/Login'
import Register from '../pages/Auth/Register'

const AuthRoutes = () => {
    return (
        <>
            <Route path='/login' element={<Login />}></Route>
            <Route path='/register' element={<Register />}></Route>
        </>
    )
}

export default AuthRoutes