import './App.css';
import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom';
import Landingpage from './HomePage/landingpage';
import { Analytics } from "@vercel/analytics/react"
import Profilepage from './User Profiles/profilepage';
import Videoviewingpage from './Video Page/videoviewingpage';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landingpage />} />
      </Routes>
      <Routes>
      <Route path="/videos/:videoId" element={<Videoviewingpage/>} />
      </Routes>
      <Routes>
        {/* Other routes */}
        <Route path="/profile/:userId" element={<Profilepage />} />
      </Routes>
      <Analytics />
    </BrowserRouter>
  );
}

export default App;
