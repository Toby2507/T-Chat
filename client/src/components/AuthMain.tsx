import { Outlet } from "react-router-dom"

const AuthMain = () => {
    return (
        <section className="h-screen grid place-items-center grid-rows-2 md:grid-rows-none md:grid-cols-2">
            <div className="w-full h-full bg-authMobile bg-no-repeat bg-cover bg-center"></div>
            <div className="w-full min-h-full -mt-10 rounded-3xl bg-black flex flex-col items-center justify-center p-8">
                <Outlet />
            </div>
        </section>
    )
}

export default AuthMain