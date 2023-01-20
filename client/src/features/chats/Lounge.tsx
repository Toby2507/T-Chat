import { EntityId } from '@reduxjs/toolkit';
import { useEffect, useState } from 'react';
import { BiDotsVerticalRounded } from 'react-icons/bi';
import { BsSearch } from 'react-icons/bs';
import { HiArchive } from 'react-icons/hi';
import { IoIosArrowBack } from 'react-icons/io';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import Loader from '../../components/Loader';
import SingleLoungeUi from '../../components/SingleLoungeUi';
import Submenu from '../../components/Submenu';
import LoungeLoader from '../../components/loaders/LoungeLoader';
import placeholderImage from '../../images/unknownUser.png';
import { groupInterface, userInterface } from '../../utilities/interfaces';
import { selectUser, toggleChatBox } from '../api/globalSlice';
import { selectUserEntities, useGetUsersQuery } from '../auth/authSlice';
import { useNavigate } from 'react-router-dom';

const Lounge = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { isLoading, isSuccess } = useGetUsersQuery();
    const currentUser = useAppSelector(selectUser);
    const users = useAppSelector(selectUserEntities);
    const [ids, setIds] = useState<(userInterface | groupInterface)[]>([]);
    const [showOptions, setShowOptions] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedChat, setSelectedChat] = useState<number>();
    const [showArchived, setShowArchived] = useState<boolean>(false);

    const changeCurrentChat = (index: number, id: EntityId, isGroup: boolean) => {
        setSelectedChat(index);
        dispatch(toggleChatBox({ show: true, chat: { id, isGroup } }));
    };

    useEffect(() => {
        const sortedUsers: (userInterface | groupInterface)[] = Object.values(users).map(user => user as userInterface | groupInterface).sort((a, b) => (b?.lastUpdated as number) - (a?.lastUpdated as number));
        setIds(sortedUsers);
    }, [users]);
    useEffect(() => { !currentUser?.verified && navigate('/verify', { replace: true }); }, [currentUser?.verified, navigate]);
    useEffect(() => { currentUser?.archivedChats.length === 0 && setShowArchived(false); }, [currentUser?.archivedChats]);
    return (
        <>
            <section className="w-full h-full px-2 py-6 flex flex-col items-center space-y-4 transition-all duration-300">
                <div className="relative w-full flex items-center justify-between px-2">
                    <figure className="w-12 h-12 rounded-full skeleton">
                        <img src={currentUser?.profilePicture ? currentUser.profilePicture : placeholderImage} alt={currentUser?.userName} className="w-full h-full object-cover rounded-full" />
                    </figure>
                    <button type="button" onClick={() => setShowOptions(!showOptions)} className="text-white text-3xl"><BiDotsVerticalRounded /></button>
                    <Submenu setLoading={setLoading} isOpen={showOptions} type="main" />
                </div>
                <form className='w-full h-auto px-2'>
                    {/* SEARCH BAR */}
                    <div className="relative w-full h-10">
                        <input
                            type="text"
                            placeholder='Search user or start new chat...'
                            className='absolute top-0 left-0 w-full h-full rounded-3xl bg-accentGray pl-12 text-white text-sm focus:outline-none placeholder:text-secondaryGray'
                        />
                        <button type="submit" aria-label='search by username' className="absolute top-3 left-4 text-white"><BsSearch /></button>
                    </div>
                </form>
                {isLoading && !isSuccess ? <LoungeLoader /> : (
                    <div className="w-full flex flex-col items-center gap-2 px-2 overflow-y-auto">
                        {/* SHOW ARCHIVE FUNCTIONALITY */}
                        {currentUser?.archivedChats.length !== 0 && (
                            <div className="w-full flex items-center gap-6 px-2">
                                {showArchived ? (
                                    <span className="text-xl text-secondaryGray" onClick={() => setShowArchived(false)}><IoIosArrowBack /></span>
                                ) : (
                                    <span className="text-xl text-secondaryGray"><HiArchive /></span>
                                )}
                                <h2 className="flex-1 text-base text-white" onClick={() => setShowArchived(true)}>Archived</h2>
                                <p className="text-base text-secondaryGray font-medium">{currentUser?.archivedChats.length}</p>
                            </div>
                        )}
                        {/* CHAT INSTANCES */}
                        <div className="w-full flex flex-col gap-2 py-2 border-t-2 border-accentGray">
                            {ids.filter(user => {
                                return showArchived ? (user?.isArchived && user) : (!user?.isArchived && user);
                            }).map((user, index) => (
                                <div key={user._id} className={selectedChat === index ? 'bg-mainGray/40' : ''} onClick={() => changeCurrentChat(index, user._id, user.isGroup)}>
                                    <SingleLoungeUi user={user} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </section>
            {loading && <Loader />}
        </>
    );
};

export default Lounge;