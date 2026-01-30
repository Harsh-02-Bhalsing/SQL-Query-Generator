import {Routes,Route} from "react-router-dom"
import Landing from "./pages/Landing"
import PublicLayout from "./layouts/PublicLayout";
import Signup from "./pages/Signup"
import Login from "./pages/Login"
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import Dashboard from "./pages/Dashboard"
import PrivateLayout from "./layouts/PrivateLayout";
import QueryDetailPage from "./pages/QueryDetail";
import HistoryPage from "./pages/HistoryPage";
function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<PublicLayout/>}>
          <Route path="/" element={<Landing/>}/>
          <Route path="/signup" element={<Signup/>} />
          <Route path="/login" element={<Login/>} />
        </Route>
        {/* <Route path="/dashboard" element={<PrivateRoute><Dashboard/></PrivateRoute>} /> */}
        <Route element={<PrivateLayout/>}>
          <Route element={<PrivateRoute/>}>
            <Route path="/dashboard" element={<Dashboard/>}/>
            <Route path="/history" element={<HistoryPage/>} />
            <Route path="/queries/:id" element={<QueryDetailPage />} />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
