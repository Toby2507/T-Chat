import { Outlet } from 'react-router-dom';
import useWindowSize from '../../utilities/useWindowSizeHook';

const Layout = () => {
    const { width, height } = useWindowSize();
    return (
        <main className="font-poppins bg-black bg-fixed overflow-hidden" style={{ "height": `${height}px`, "width": `${width}px` }}>
            <Outlet />
        </main>
    );
};

export default Layout;