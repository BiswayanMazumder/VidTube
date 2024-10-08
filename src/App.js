import './App.css';
import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom';
import Landingpage from './HomePage/landingpage';
import Profilepage from './User Profiles/profilepage';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landingpage />} />
      </Routes>
      <Routes>
                {/* Other routes */}
                <Route path="/profile/:userId" element={<Profilepage />} />
            </Routes>
    </BrowserRouter>
  );
}

export default App;
