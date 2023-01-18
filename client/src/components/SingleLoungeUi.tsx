import { EntityId } from '@reduxjs/toolkit';
import React from 'react';
import { useAppSelector } from '../app/hooks';
import { selectUserById } from '../features/auth/authSlice';
import { messageSelectors } from '../features/chats/chatSlice';
import placeholderImg2 from '../images/unknownGroup.png';
import placeholderImg from '../images/unknownUser.png';
import { groupInterface, messageInterface, userInterface } from '../utilities/interfaces';

interface uiInterface {
  user: userInterface | groupInterface;
}

const SingleLoungeUi = ({ user }: uiInterface) => {
  const userMsgs = user.messages.filter(msg => !msg.isInformational).map(msg => msg.id);
  const lastMsgId = userMsgs[(userMsgs.length - 1)];
  const selectMsgById = messageSelectors(user._id, user.isGroup).selectById;
  const lastMsg = useAppSelector(state => selectMsgById(state, (lastMsgId as EntityId))) as messageInterface;
  const sender = useAppSelector(state => selectUserById(state, (lastMsg?.sender as EntityId))) as userInterface;
  const showMsg = `${lastMsg?.fromSelf ? 'You:' : `${sender?.userName || "Deleted User"}:`} ${lastMsg?.message}`;

  return (
    <article className="relative flex items-center gap-3 pl-2 cursor-pointer">
      <figure className="w-12 h-12 rounded-full skeleton">
        <img src={user.profilePicture ? user.profilePicture : user.isGroup ? placeholderImg2 : placeholderImg} alt="" className="w-full h-full object-cover rounded-full" />
      </figure>
      <div className="flex-1 w-9/12 flex flex-col pb-2 border-b border-accentGray">
        <div className="flex items-center justify-between">
          <h2 className="flex-1 text-white text-lg capitalize">{user.userName}</h2>
          <p className={`text-${user.unread.length !== 0 && !user.isMuted ? "accentPurple" : "secondaryGray"} text-xs font-medium`}>{lastMsg?.time}</p>
        </div>
        <div className="flex items-center justify-between gap-1">
          <p className="text-secondaryGray text-sm truncate">{lastMsg ? showMsg : "click to start chatting..."}</p>
          {user.unread.length !== 0 && !user.isMuted && <span className="w-5 h-5 px-[0.4rem] grid place-items-center rounded-full bg-accentPurple text-black font-medium text-xs">{user.unread.length}</span>}
        </div>
      </div>
    </article>
  );
};

export default React.memo(SingleLoungeUi);