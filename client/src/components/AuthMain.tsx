import { Outlet } from "react-router-dom";

const AuthMain = () => {
    return (
        <section className="w-full h-full grid place-items-center grid-rows-2 overflow-hidden md:grid-rows-none md:grid-cols-2">
            <div className="w-full h-full bg-authMobile bg-no-repeat bg-cover bg-center"></div>
            <section className="w-full min-h-full -mt-10 rounded-3xl bg-black flex flex-col justify-center space-y-6 items-center px-4 py-8">
                <Outlet />
            </section>
        </section>
    );
};

export default AuthMain;