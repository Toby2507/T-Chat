import { EntityId } from '@reduxjs/toolkit';
import React from 'react';
import { useAppSelector } from '../../app/hooks';
import { messageSelectors } from './chatSlice';

interface singleMessageInterface {
  prevId: { id: string, isInformational: boolean; };
  currId: { id: string, isInformational: boolean; };
  nextId: { id: string, isInformational: boolean; };
  chatId: EntityId;
  isGroup: boolean;
}


const SingleMessage = ({ currId, prevId, nextId, chatId, isGroup }: singleMessageInterface) => {
  const selectMessageById = messageSelectors(chatId, isGroup).selectById;
  const prevMsg = useAppSelector(state => selectMessageById(state, prevId?.id));
  const currMsg = useAppSelector(state => selectMessageById(state, currId?.id));
  const nextMsg = useAppSelector(state => selectMessageById(state, nextId?.id));
  const sent = `self-end flex flex-col items-end bg-mainBlue w-[90%] max-w-max rounded-2xl px-4 py-2 ${nextMsg?.fromSelf === currMsg?.fromSelf ? '' : 'rounded-br-none'}`;
  const recieved = `self-start flex flex-col items-start bg-mainGray w-[90%] max-w-max rounded-2xl px-4 py-2 ${nextMsg?.fromSelf === currMsg?.fromSelf ? '' : 'rounded-bl-none'}`;
  return (
    <>
      {currMsg?.date !== prevMsg?.date && (
        <div className="w-full flex justify-center">
          <span className="text-secondaryGray text-xs font-bold">{currMsg?.date}</span>
        </div>
      )}
      <div className={currMsg?.fromSelf ? sent : recieved}>
        <p className="w-full text-white text-sm">{currMsg?.message}</p>
        <p className="text-white/50 text-xs tracking-wider">{currMsg?.time}</p>
      </div>
    </>
  );
};

export default React.memo(SingleMessage);