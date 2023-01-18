import { Route, Routes } from 'react-router-dom';
import AuthMain from './components/AuthMain';
import Onboard from './components/Onboard';
import ChatLayout from './components/layouts/ChatLayout';
import Layout from './components/layouts/Layout';
import ForgotPassword from './features/auth/ForgotPassword';
import Login from './features/auth/Login';
import PersistLogin from './features/auth/PersistLogin';
import RequireAuth from './features/auth/RequireAuth';
import ResetPassword from './features/auth/ResetPassword';
import SetProfilePicture from './features/auth/SetProfilePicture';
import Signup from './features/auth/Signup';
import VerifyUser from './features/auth/VerifyUser';
import CreateGroupChat from './features/chats/CreateGroupChat';
import Lounge from './features/chats/Lounge';
import UserSettings from './features/settings/UserSettings';

const App = () => {
  return (
    <Routes>
      <Route path='/*' element={<Layout />}>
        <Route index element={<Onboard />} />
        <Route element={<AuthMain />}>
          {/* PUBLIC AUTH ROUTE */}
          <Route path='signup' element={<Signup />} />
          <Route path='login' element={<Login />} />
          <Route path='forgotpassword' element={<ForgotPassword />} />
          <Route path='reset/:id/:passwordResetCode' element={<ResetPassword />} />
          {/* PROTECTED AUTH ROUTES */}
          <Route element={<PersistLogin />}>
            <Route element={<RequireAuth />}>
              <Route path='setprofilepicture' element={<SetProfilePicture />} />
              <Route path='verify' element={<VerifyUser />} />
            </Route>
          </Route>
        </Route>
        {/* GENERAL PROTECTED ROUTES */}
        <Route element={<PersistLogin />}>
          <Route element={<RequireAuth />}>
            <Route path='chat' element={<ChatLayout />}>
              <Route index element={<Lounge />} />
              <Route path='group' element={<CreateGroupChat />} />
              <Route path='group/:userId' element={<CreateGroupChat />} />
              <Route path='settings' element={<UserSettings />} />
            </Route>
          </Route>
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
