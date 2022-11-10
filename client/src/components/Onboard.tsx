import imgMobile from '../images/logo_mobile.svg'
import imgDesk from '../images/logo_desktop.svg'
import { Link } from 'react-router-dom'

const Onboard = () => {
    return (
        <section className="h-screen grid place-items-center grid-rows-2 lg:grid-rows-none lg:grid-cols-2">
            <figure className="w-full h-full overflow-hidden">
                <img src={imgMobile} alt="Logo" className='w-full h-full object-cover lg:hidden' />
                <img src={imgDesk} alt="Logo" className='hidden w-full h-full object-cover md:block' />
            </figure>
            <div className="flex flex-col items-center justify-center space-y-6">
                <h1 className="text-3xl text-center text-accentPurple capitalize font-semibold leading-tight md:text-5xl">connect with friends <br /> <span className="text-white">anywhere anytime</span></h1>
                <p className="w-10/12 mx-auto text-secondaryGray text-sm text-center pb-16 md:text-lg">Chat with your friends anywhere you are in the world, at any time.</p>
                <button className="bg-mainBlue py-3 w-48 rounded-3xl text-sm text-white capitalize md:text-lg"><Link to={'/auth/login'}>get started</Link></button>
            </div>
        </section >
    )
}

export default Onboard