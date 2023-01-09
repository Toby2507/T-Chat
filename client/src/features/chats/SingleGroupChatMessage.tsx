import { EntityId } from '@reduxjs/toolkit';
import React from 'react';
import { useAppSelector } from '../../app/hooks';
import { messageSelectors } from './chatSlice';
import { selectUserById } from '../auth/authSlice';
import placeholderImg from '../../images/unknownUser.png';
import { userInterface } from '../../utilities/interfaces';

interface singleMessageInterface {
  prevId: EntityId;
  currId: EntityId;
  nextId: EntityId;
  chatId: EntityId;
  isGroup: boolean;
}

const SingleGroupChatMessage = ({ currId, prevId, nextId, chatId, isGroup }: singleMessageInterface) => {
  const selectMessageById = messageSelectors(chatId, isGroup).selectById;
  const prevMsg = useAppSelector(state => selectMessageById(state, prevId));
  const currMsg = useAppSelector(state => selectMessageById(state, currId));
  const nextMsg = useAppSelector(state => selectMessageById(state, nextId));
  const sender = useAppSelector(state => selectUserById(state, currMsg?.sender as EntityId)) as userInterface;
  const sent = `flex flex-col items-end bg-mainBlue rounded-2xl px-4 py-2 ${nextMsg?.fromSelf === currMsg?.fromSelf ? '' : 'rounded-br-none'}`;
  const recieved = `flex flex-col items-start bg-mainGray rounded-2xl px-4 py-2 ${nextMsg?.fromSelf === currMsg?.fromSelf ? '' : 'rounded-bl-none'}`;
  return (
    <>
      {currMsg?.date !== prevMsg?.date && (
        <div className="w-full flex justify-center">
          <span className="text-secondaryGray text-xs font-bold">{currMsg?.date}</span>
        </div>
      )}
      <div className={`${currMsg?.fromSelf ? "self-end" : "self-start"} w-[90%] max-w-max flex items-end gap-1`}>
        <figure className="w-6 min-w-6 h-6 rounded-full">
          {!currMsg?.fromSelf && currMsg?.sender !== nextMsg?.sender && (<img src={sender?.profilePicture || placeholderImg} alt="" className="w-full h-full object-cover rounded-full" />)}
        </figure>
        <div className={currMsg?.fromSelf ? sent : recieved}>
          {currMsg?.sender !== prevMsg?.sender && <p className={`${sender?.groupColor} font-medium text-xs`}>{sender?.userName}</p>}
          <p className="w-full text-white text-sm">{currMsg?.message}</p>
          <p className="text-white/50 text-xs tracking-wider">{currMsg?.time}</p>
        </div>
      </div>
    </>
  );
};

export default React.memo(SingleGroupChatMessage);