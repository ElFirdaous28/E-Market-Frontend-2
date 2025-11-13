import AppRoutes from "./routes/AppRoutes";
import { ToastContainer } from 'react-toastify';
import { useAuth } from "./hooks/useAuth";

function App() {
  const { initAuth } = useAuth(); // ✅ triggers the initAuth query on app load

  return (<>
    <AppRoutes />

    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
  </>);

}

export default App
