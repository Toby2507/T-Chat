import { BiDotsVerticalRounded } from 'react-icons/bi';
import { BsSearch } from 'react-icons/bs';
import Loader from '../../components/Loader';
import LogoutButton from '../auth/LogoutButton';
import { useGetAllUsersQuery } from './chatSlice';

const Lounge = () => {
    const { data: users, isLoading, error } = useGetAllUsersQuery({});
    return (
        <section className="container mx-auto px-4 py-6 flex flex-col items-center space-y-4">
            <div className="w-full flex items-center justify-between">
                <h1 className="text-white text-3xl">Rooms</h1>
                <button className="text-white text-3xl"><BiDotsVerticalRounded /></button>
            </div>
            <form className='w-full h-auto'>
                <div className="relative w-full h-10">
                    <input
                        type="text"
                        placeholder='Search user...'
                        className='absolute top-0 left-0 w-full h-full rounded-3xl bg-accentGray pl-12 text-white text-sm focus:outline-none placeholder:text-secondaryGray'
                    />
                    <button aria-label='search by username' className="absolute top-3 left-4 text-white"><BsSearch /></button>
                </div>
            </form>
            <div className="w-full flex flex-col gap-2 py-2 border-t-2 border-accentGray">
                <article className="flex items-center gap-3 pl-2">
                    <div className="w-14 h-14 rounded-full bg-mainBlue grid place-items-center uppercase text-white text-xl">R</div>
                    <div className="flex-1 flex flex-col pb-2 border-b border-accentGray">
                        <h2 className="text-white text-xl capitalize">oluwatobi salau</h2>
                        <p className="text-secondaryGray text-sm">Tobi: How far guy? how you dey?</p>
                    </div>
                </article>
                <article className="flex items-center gap-3 pl-2">
                    <div className="w-14 h-14 rounded-full bg-mainBlue grid place-items-center uppercase text-white text-xl">R</div>
                    <div className="flex-1 flex flex-col pb-2 border-b border-accentGray">
                        <h2 className="text-white text-xl capitalize">oluwatobi salau</h2>
                        <p className="text-secondaryGray text-sm">Tobi: How far guy? how you dey?</p>
                    </div>
                </article>
                <article className="flex items-center gap-3 pl-2">
                    <div className="w-14 h-14 rounded-full bg-mainBlue grid place-items-center uppercase text-white text-xl">R</div>
                    <div className="flex-1 flex flex-col pb-2 border-b border-accentGray">
                        <h2 className="text-white text-xl capitalize">oluwatobi salau</h2>
                        <p className="text-secondaryGray text-sm">Tobi: How far guy? how you dey?</p>
                    </div>
                </article>
            </div>
            <LogoutButton />
            {isLoading && <Loader />}
        </section>
    );
};

export default Lounge;