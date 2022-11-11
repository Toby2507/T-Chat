import { Route, Routes } from 'react-router-dom';
import AuthMain from './components/AuthMain';
import Layout from './components/Layout';
import Onboard from './components/Onboard';
import Login from './features/auth/Login';
import SetProfilePicture from './features/auth/SetProfilePicture';
import Signup from './features/auth/Signup';
import VerifyUser from './features/auth/VerifyUser';
import ChatRoom from './features/chats/ChatRoom';
import Lounge from './features/chats/Lounge';

const App = () => {
  return (
    <Routes>
      <Route path='/*' element={<Layout />}>
        <Route index element={<Onboard />} />
        <Route element={<AuthMain />}>
          <Route path='signup' element={<Signup />} />
          <Route path='login' element={<Login />} />
          <Route path='setprofilepicture' element={<SetProfilePicture />} />
          <Route path='verify' element={<VerifyUser />} />
        </Route>
        <Route path='lounge' element={<Lounge />} />
        <Route path='chat' element={<ChatRoom />} />
      </Route>
    </Routes>
  );
};

export default App;
