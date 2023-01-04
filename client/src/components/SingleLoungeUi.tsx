import { EntityId } from '@reduxjs/toolkit';
import React from 'react';
import { useAppSelector } from '../app/hooks';
import { selectUserById } from '../features/auth/authSlice';
import placeholderImg from '../images/unknownUser.png';

interface uiInterface {
  userId: EntityId;
}

const SingleLoungeUi = ({ userId }: uiInterface) => {
  const userInfo = useAppSelector(state => selectUserById(state, userId));

  return (
    <article className="relative flex items-center gap-3 pl-2 cursor-pointer">
      <figure className="w-12 h-12 rounded-full skeleton">
        <img src={userInfo?.profilePicture ? userInfo.profilePicture : placeholderImg} alt="" className="w-full h-full object-cover rounded-full" />
      </figure>
      <div className="flex-1 flex flex-col pb-2 border-b border-accentGray">
        <h2 className="text-white text-lg capitalize">{userInfo?.userName}</h2>
        <p className="text-secondaryGray text-sm">Tobi: How far guy? how you dey?</p>
      </div>
      {userInfo?.unread.length !== 0 && <span className="absolute top-[0.9rem] right-1 w-5 h-5 grid place-items-center rounded-full bg-secondaryGray text-white font-medium text-xs">{userInfo?.unread.length}</span>}
    </article>
  );
};

export default React.memo(SingleLoungeUi);