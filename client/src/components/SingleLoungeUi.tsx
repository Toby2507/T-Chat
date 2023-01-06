import { EntityId } from '@reduxjs/toolkit';
import React from 'react';
import { useAppSelector } from '../app/hooks';
import { selectUserById } from '../features/auth/authSlice';
import placeholderImg from '../images/unknownUser.png';
import { messageSelectors } from '../features/chats/chatSlice';

interface uiInterface {
  userId: EntityId;
}

const SingleLoungeUi = ({ userId }: uiInterface) => {
  const userInfo = useAppSelector(state => selectUserById(state, userId));
  const lastMsgId = userInfo?.messages[userInfo.messages.length - 1];
  const selectMsgById = messageSelectors(userId).selectById;
  const lastMsg = useAppSelector(state => selectMsgById(state, (lastMsgId as EntityId)));
  const showMsg = `${lastMsg?.fromSelf ? 'You:' : `${userInfo?.userName}:`} ${lastMsg?.message}`;

  return (
    <article className="relative flex items-center gap-3 pl-2 cursor-pointer">
      <figure className="w-12 h-12 rounded-full skeleton">
        <img src={userInfo?.profilePicture ? userInfo.profilePicture : placeholderImg} alt="" className="w-full h-full object-cover rounded-full" />
      </figure>
      <div className="flex-1 w-9/12 flex flex-col pb-2 border-b border-accentGray">
        <div className="flex items-center justify-between">
          <h2 className="flex-1 text-white text-lg capitalize">{userInfo?.userName}</h2>
          <p className={`text-${userInfo?.unread.length !== 0 && !userInfo?.isMuted ? "accentPurple" : "secondaryGray"} text-xs font-medium`}>{lastMsg?.time}</p>
        </div>
        <div className="flex items-center justify-between gap-1">
          <p className="text-secondaryGray text-sm truncate">{lastMsg ? showMsg : "click to start chatting..."}</p>
          {userInfo?.unread.length !== 0 && !userInfo?.isMuted && <span className="w-5 h-5 px-[0.4rem] grid place-items-center rounded-full bg-accentPurple text-black font-medium text-xs">{userInfo?.unread.length}</span>}
        </div>
      </div>
    </article>
  );
};

export default React.memo(SingleLoungeUi);