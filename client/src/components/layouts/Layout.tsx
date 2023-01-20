import { useLayoutEffect, useRef, useState } from 'react';
import { Outlet } from 'react-router-dom';

const Layout = () => {
    const mainRef = useRef<HTMLElement>(null);
    const [size, setSize] = useState<[number, number]>([0, 0]);
    useLayoutEffect(() => {
        const updateSize = () => setSize([window.innerWidth, window.innerHeight]);
        window.addEventListener('resize', updateSize);
        updateSize();
        return () => window.removeEventListener('resize', updateSize);
    }, []);
    return (
        <main ref={mainRef} className="font-poppins bg-black bg-fixed overflow-hidden" style={{ "height": `${size[1]}px`, "width": `${size[0]}px` }}>
            <Outlet />
        </main>
    );
};

export default Layout;