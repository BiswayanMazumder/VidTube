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
import Customise_channel from './Channel Details/customise_channel';
import Uploadvideo from './Video Page/uploadvideo';
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
      <Routes>
      <Route path="/channel/:userId/editing/profile" element={<Customise_channel/>} />
      </Routes>
      <Routes>
      <Route path="/channel/uploadvideo" element={<Uploadvideo/>} />
      </Routes>
      <Analytics />
    </BrowserRouter>
  );
}

export default App;
