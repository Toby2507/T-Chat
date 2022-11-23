import { EntityId } from '@reduxjs/toolkit';
import { useEffect, useState } from 'react';
import { BiDotsVerticalRounded } from 'react-icons/bi';
import { BsSearch } from 'react-icons/bs';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import Loader from '../../components/Loader';
import SingleLoungeUi from '../../components/SingleLoungeUi';
import Submenu from '../../components/Submenu';
import placeholderImage from '../../images/unknownUser.png';
import { selectUser, setCurrentChat, toggleChatBox } from '../api/globalSlice';
import { selectUserIds, useGetUsersQuery } from '../auth/authSlice';

const Lounge = () => {
    const dispatch = useAppDispatch();
    const { isLoading, isSuccess, isError, error } = useGetUsersQuery();
    const currentUser = useAppSelector(selectUser);
    const userIds = useAppSelector(selectUserIds);
    const [ids, setIds] = useState<EntityId[]>([]);
    const [showOptions, setShowOptions] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedChat, setSelectedChat] = useState<number>();

    const changeCurrentChat = (index: number, userId: EntityId) => {
        setSelectedChat(index);
        dispatch(setCurrentChat(userId));
        dispatch(toggleChatBox(true));
    };

    useEffect(() => { isSuccess && setIds(userIds); }, [userIds, isSuccess]);
    useEffect(() => { isError && console.log(error); }, [error, isError]);
    return (
        <>
            {(isSuccess && !isLoading && !loading) ? (
                <section className="w-full h-screen px-4 py-6 flex flex-col items-center space-y-4 border-r border-mainGray transition-all duration-300">
                    <div className="relative w-full flex items-center justify-between">
                        <figure className="w-12 h-12 rounded-full">
                            <img src={currentUser?.profilePicture ? currentUser.profilePicture : placeholderImage} alt={currentUser?.userName} className="w-full h-full object-cover rounded-full" />
                        </figure>
                        <button type="button" onClick={() => setShowOptions(!showOptions)} className="text-white text-3xl"><BiDotsVerticalRounded /></button>
                        <Submenu setLoading={setLoading} isOpen={showOptions} />
                    </div>
                    <form className='w-full h-auto'>
                        <div className="relative w-full h-10">
                            <input
                                type="text"
                                placeholder='Search user or start new chat...'
                                className='absolute top-0 left-0 w-full h-full rounded-3xl bg-accentGray pl-12 text-white text-sm focus:outline-none placeholder:text-secondaryGray'
                            />
                            <button type="submit" aria-label='search by username' className="absolute top-3 left-4 text-white"><BsSearch /></button>
                        </div>
                    </form>
                    <div className="w-full flex flex-col gap-2 py-2 border-t-2 border-accentGray overflow-y-auto">
                        {ids.map((id, index) => (
                            <div key={id} className={selectedChat === index ? 'bg-mainGray/40' : ''} onClick={() => changeCurrentChat(index, id)}>
                                <SingleLoungeUi userId={id} />
                            </div>
                        ))}
                    </div>
                </section>
            ) : <Loader />}
        </>
    );
};

export default Lounge;