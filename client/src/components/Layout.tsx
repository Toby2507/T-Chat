import { Outlet } from 'react-router-dom'

const Layout = () => {
    return (
        <main className="font-poppins w-screen h-screen bg-black bg-fixed">
            <Outlet />
        </main>
    )
}

export default Layout