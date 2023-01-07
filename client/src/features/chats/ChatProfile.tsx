import { EntityId } from '@reduxjs/toolkit';
import { FaAngleRight } from 'react-icons/fa';
import { HiPlus } from 'react-icons/hi';
import { IoClose } from 'react-icons/io5';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import placeholderImg from '../../images/unknownUser.png';
import { selectChat, toggleProfile } from '../api/globalSlice';
import { selectUserById } from '../auth/authSlice';
import { useClearChatMutation, useSetChatInfoMutation } from '../settings/chatSettingSlice';

const ChatProfile = () => {
  const dispatch = useAppDispatch();
  const [setChatInfo] = useSetChatInfoMutation();
  const [clearChat] = useClearChatMutation();
  const userId = useAppSelector(selectChat);
  const userInfo = useAppSelector(state => selectUserById(state, userId as EntityId));
  const muteChat = () => { try { setChatInfo({ control: "mutedUsers", set: !userInfo?.isMuted as boolean, userId: userId as string }); } catch (error) { console.log(error); } };
  const archiveChat = () => { setChatInfo({ control: "archivedChats", set: !userInfo?.isArchived as boolean, userId: userId as string }); };
  const blockUser = () => { setChatInfo({ control: "blockedUsers", set: !userInfo?.isBlocked as boolean, userId: userId as string }); };
  const clearChatHistory = () => { clearChat({ messageIds: (userInfo?.messages as string[]), to: userId as string }); };

  return (
    <section className="w-full h-screen grid grid-rows-[auto_1fr] border-l border-mainGray">
      <article className="relative p-5 flex gap-6 items-center bg-mainGray">
        <button onClick={() => dispatch(toggleProfile(false))}><IoClose className='text-3xl text-secondaryGray' /></button>
        <h1 className="text-white text-lg font-medium tracking-widest">Contact Info</h1>
      </article>
      <article className="flex flex-col items-center gap-8 px-4 py-16 overflow-x-clip overflow-y-scroll">
        {/* USER INFO */}
        <div className="flex flex-col items-center gap-4">
          <figure className="w-56 h-56 rounded-full p-2 border-2 border-secondaryGray skeleton">
            <img src={userInfo?.profilePicture ? userInfo.profilePicture : placeholderImg} alt="" className="w-full h-full object-cover rounded-full" />
          </figure>
          <div className="flex flex-col items-center gap-1">
            <h2 className="text-white text-2xl text-center tracking-tight">{userInfo?.userName}</h2>
            <p className="text-secondaryGray text-base text-center">{userInfo?.email}</p>
          </div>
        </div>
        {/* COMMON GROUPS */}
        <section className="w-full max-w-[40rem] flex flex-col justify-center gap-4 mx-6">
          <h2 className="text-white text-lg font-medium">Common Groups</h2>
          <div className="flex flex-col items-center justify-center bg-mainGray px-4 py-1 rounded-lg">
            {/* CREATE NEW GROUP UI */}
            <article className="group w-full flex items-center gap-3 cursor-pointer">
              <div className="w-10 h-10 grid place-items-center bg-accentGray rounded-full text-accentPurple text-2xl"><HiPlus /></div>
              <div className="flex-1 flex items-center justify-between py-3 border-b border-accentGray group-last:border-none">
                <h2 className="flex-1 text-accentPurple text-base capitalize">{`Create Group with ${userInfo?.userName}`}</h2>
              </div>
            </article>
            {/* SINGLE GROUP UI */}
            <article className="group w-full flex items-center gap-3 cursor-pointer">
              <figure className="w-10 h-10 rounded-full skeleton">
                <img src={placeholderImg} alt="Group display" className="w-full h-full object-cover rounded-full" />
              </figure>
              <div className="flex-1 flex items-center justify-between py-3 border-b border-accentGray group-last:border-none">
                <h2 className="flex-1 text-white text-base capitalize">Group name</h2>
                <span className="text-accentGray text-xl"><FaAngleRight /></span>
              </div>
            </article>
          </div>
        </section>
        {/* CHAT OPTIONS */}
        <section className="w-full max-w-[40rem] flex flex-col items-center justify-center bg-mainGray px-4 py-1 rounded-lg mx-6">
          <article className="w-full flex items-center cursor-pointer py-3 border-b border-accentGray last:border-none" onClick={muteChat}>
            <p className=" text-accentPurple text-base capitalize">{userInfo?.isMuted ? "unmute chat" : "mute chat"}</p>
          </article>
          <article className="w-full flex items-center cursor-pointer py-3 border-b border-accentGray last:border-none" onClick={archiveChat}>
            <p className=" text-accentPurple text-base capitalize">{userInfo?.isArchived ? "unarchive chat" : "archive chat"}</p>
          </article>
          <article className="w-full flex items-center cursor-pointer py-3 border-b border-accentGray last:border-none" onClick={clearChatHistory}>
            <p className=" text-red-500 text-base capitalize">clear chat</p>
          </article>
          <article className="w-full flex items-center cursor-pointer py-3 border-b border-accentGray last:border-none" onClick={blockUser}>
            <p className=" text-red-500 text-base capitalize">{userInfo?.isBlocked ? `unblock ${userInfo?.userName}` : `block ${userInfo?.userName}`}</p>
          </article>
        </section>
      </article>
    </section>
  );
};

export default ChatProfile;