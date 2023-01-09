import { EntityId } from '@reduxjs/toolkit';
import { HiPlus } from 'react-icons/hi';
import { IoClose } from 'react-icons/io5';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import ProfileUserItem from '../../components/ProfileUserItem';
import placeholderImg from '../../images/unknownUser.png';
import { groupInterface } from '../../utilities/interfaces';
import { selectChat, toggleProfile } from '../api/globalSlice';
import { selectUserById } from '../auth/authSlice';
import { useSetChatInfoMutation } from '../settings/chatSettingSlice';

const GroupProfile = () => {
  const dispatch = useAppDispatch();
  const [setChatInfo] = useSetChatInfoMutation();
  const user = useAppSelector(selectChat);
  const userInfo = useAppSelector(state => selectUserById(state, user.id as EntityId)) as groupInterface;
  const muteChat = () => { setChatInfo({ control: "mutedUsers", set: !userInfo?.isMuted as boolean, userId: user.id as string }); };
  const archiveChat = () => { setChatInfo({ control: "archivedChats", set: !userInfo?.isArchived as boolean, userId: user.id as string }); };

  return (
    <section className="w-full h-screen grid grid-rows-[auto_1fr] border-l border-mainGray">
      <article className="relative p-5 flex gap-6 items-center bg-mainGray">
        <button onClick={() => dispatch(toggleProfile(false))}><IoClose className='text-3xl text-secondaryGray' /></button>
        <h1 className="text-white text-lg font-medium tracking-widest">Group Info</h1>
      </article>
      <article className="flex flex-col items-center gap-8 px-4 py-16 overflow-x-clip overflow-y-scroll">
        {/* USER INFO */}
        <div className="flex flex-col items-center gap-4">
          <figure className="w-56 h-56 rounded-full p-2 border-2 border-secondaryGray skeleton">
            <img src={userInfo?.profilePicture ? userInfo.profilePicture : placeholderImg} alt="" className="w-full h-full object-cover rounded-full" />
          </figure>
          <div className="flex flex-col items-center gap-1">
            <h2 className="text-white text-2xl text-center tracking-tight">{userInfo?.userName}</h2>
            <p className="text-secondaryGray text-base text-center">Group</p>
          </div>
        </div>
        {/* COMMON GROUPS */}
        <section className="w-full max-w-[40rem] flex flex-col justify-center gap-4 mx-6">
          <h2 className="text-white text-lg font-medium">{`${userInfo?.members.length} Participants`}</h2>
          <div className="flex flex-col items-center justify-center bg-mainGray px-4 py-1 rounded-lg">
            {/* CREATE NEW GROUP UI */}
            <article className="group w-full flex items-center gap-3 cursor-pointer">
              <div className="w-8 h-8 grid place-items-center bg-accentGray rounded-full text-accentPurple text-xl"><HiPlus /></div>
              <div className="flex-1 flex items-center justify-between py-3 border-b border-accentGray group-last:border-none">
                <h2 className="flex-1 text-accentPurple text-sm capitalize">Add Participants</h2>
              </div>
            </article>
            {/* SINGLE USER UI */}
            {userInfo?.members.map(id => (
              <ProfileUserItem key={id} id={id} admins={userInfo?.admins} />
            ))}
          </div>
        </section>
        {/* CHAT OPTIONS */}
        <section className="w-full max-w-[40rem] flex flex-col items-center justify-center bg-mainGray px-4 py-1 rounded-lg mx-6">
          <article className="w-full flex items-center cursor-pointer py-3 border-b border-accentGray last:border-none" onClick={muteChat}>
            <p className=" text-accentPurple text-base capitalize">{userInfo?.isMuted ? "unmute Group" : "mute group"}</p>
          </article>
          <article className="w-full flex items-center cursor-pointer py-3 border-b border-accentGray last:border-none" onClick={archiveChat}>
            <p className=" text-accentPurple text-base capitalize">{userInfo?.isArchived ? "unarchive group" : "archive group"}</p>
          </article>
          <article className="w-full flex items-center cursor-pointer py-3 border-b border-accentGray last:border-none">
            <p className=" text-red-500 text-base capitalize">exit group</p>
          </article>
        </section>
      </article>
    </section>
  );
};

export default GroupProfile;