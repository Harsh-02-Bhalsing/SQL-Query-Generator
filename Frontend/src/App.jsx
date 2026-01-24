import {Routes,Route} from "react-router-dom"
import Landing from "./pages/Landing"
import PublicLayout from "./layouts/PublicLayout";
function App() {
  return (
    <Routes>
      <Route element={<PublicLayout/>}>
        <Route path="/" element={<Landing/>}/>
      </Route>
    </Routes>
  );
}

export default App;
