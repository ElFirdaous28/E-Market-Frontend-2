import { lazy } from 'react';
import { Route } from 'react-router-dom';

const Register = lazy(() => import('../pages/Auth/Register'));
const Login = lazy(() => import('../pages/Auth/Login'));

const AuthRoutes = () => {
  return (
    <>
      <Route path="/login" element={<Login />}></Route>
      <Route path="/register" element={<Register />}></Route>
    </>
  );
};

export default AuthRoutes;
