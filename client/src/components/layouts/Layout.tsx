import { Outlet } from 'react-router-dom';

const Layout = () => {
    return (
        <main className="font-poppins bg-black bg-fixed overflow-hidden" style={{ "height": `${window.innerHeight}px`, "width": `${window.innerWidth}px` }}>
            <Outlet />
        </main>
    );
};

export default Layout;