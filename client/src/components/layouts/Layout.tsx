import { Outlet } from 'react-router-dom';

const Layout = () => {
    return (
        <main className="font-poppins setDeviceHeight w-full bg-black bg-fixed">
            <Outlet />
        </main>
    );
};

export default Layout;