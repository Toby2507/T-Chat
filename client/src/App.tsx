import { Routes, Route } from 'react-router-dom'
import AuthMain from './components/AuthMain';
import Layout from './components/Layout';
import Onboard from './components/Onboard';
import Login from './features/auth/Login';
import Signup from './features/auth/Signup';
import ChatRoom from './features/chats/ChatRoom';
import Lounge from './features/chats/Lounge';

const App = () => {
  return (
    <Routes>
      <Route path='/*' element={<Layout />}>
        <Route index element={<Onboard />} />
        <Route path='auth' element={<AuthMain />}>
          <Route path='signup' element={<Signup />} />
          <Route path='login' element={<Login />} />
        </Route>
        <Route path='lounge' element={<Lounge />} />
        <Route path='chat' element={<ChatRoom />} />
      </Route>
    </Routes>
  );
}

export default App;
