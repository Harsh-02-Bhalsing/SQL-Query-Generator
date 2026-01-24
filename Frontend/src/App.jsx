import {Routes,Route} from "react-router-dom"
import Landing from "./pages/Landing"
import PublicLayout from "./layouts/PublicLayout";
import Signup from "./pages/Signup"
import Login from "./pages/Login"
function App() {
  return (
    <Routes>
      <Route element={<PublicLayout/>}>
        <Route path="/" element={<Landing/>}/>
        <Route path="/signup" element={<Signup/>} />
        <Route path="/login" element={<Login/>} />
      </Route>
    </Routes>
  );
}

export default App;
