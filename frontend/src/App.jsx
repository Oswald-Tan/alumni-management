import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser, clearUser, setLoading } from "./features/auth/authSlice";
import { checkSession } from "./services/authService";
import AppRoutes from "./routes/AppRoutes";

function App() {
  const dispatch = useDispatch();

  // Cek session saat app pertama load
  useEffect(() => {
    const verifySession = async () => {
      dispatch(setLoading(true));
      try {
        const res = await checkSession();
        dispatch(setUser(res.data.data));
      } catch {
        dispatch(clearUser());
      }
    };
    verifySession();
  }, [dispatch]);

  return <AppRoutes />;
}

export default App;
