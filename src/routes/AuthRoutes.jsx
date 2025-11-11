import { Route } from 'react-router-dom'
import Login from '../pages/login'
import Register from '../pages/Register'
import Products from '../pages/Products'

const AuthRoutes = () => {
    return (
        <>
            <Route path='/login' element={<Login />}></Route>
            <Route path='/register' element={<Register />}></Route>
        </>
    )
}

export default AuthRoutes