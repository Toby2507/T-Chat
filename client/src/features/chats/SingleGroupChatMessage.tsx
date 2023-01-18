import { EntityId } from '@reduxjs/toolkit';
import React from 'react';
import { useAppSelector } from '../../app/hooks';
import placeholderImg from '../../images/unknownUser.png';
import { mainUserInterface, userInterface } from '../../utilities/interfaces';
import { selectUserById } from '../auth/authSlice';
import { messageSelectors } from './chatSlice';
import { selectUser } from '../api/globalSlice';

interface singleMessageInterface {
  prevId: { id: string, isInformational: boolean; };
  currId: { id: string, isInformational: boolean; };
  nextId: { id: string, isInformational: boolean; };
  chatId: EntityId;
  isGroup: boolean;
}

const SingleGroupChatMessage = ({ currId, prevId, nextId, chatId, isGroup }: singleMessageInterface) => {
  const selectMessageById = messageSelectors(chatId, isGroup).selectById;
  const myInfo = useAppSelector(selectUser) as mainUserInterface;
  const prevMsg = useAppSelector(state => selectMessageById(state, prevId?.id));
  const currMsg = useAppSelector(state => selectMessageById(state, currId?.id));
  const nextMsg = useAppSelector(state => selectMessageById(state, nextId?.id));
  const sender = useAppSelector(state => selectUserById(state, currMsg?.sender as EntityId)) as userInterface;
  const sent = `flex flex-col items-end bg-mainBlue rounded-2xl px-4 py-2 ${nextMsg?.fromSelf === currMsg?.fromSelf ? '' : 'rounded-br-none'}`;
  const recieved = `flex flex-col items-start bg-mainGray rounded-2xl px-4 py-2 ${nextMsg?.fromSelf === currMsg?.fromSelf ? '' : 'rounded-bl-none'}`;
  const [by, action, to] = currMsg?.message.split(' ') as string[] || [];
  const actionBy = useAppSelector(state => selectUserById(state, by as EntityId)) as userInterface;
  const actionTo = useAppSelector(state => selectUserById(state, to as EntityId)) as userInterface;

  return (
    <>
      {currId?.isInformational ? (
        <p
          className="w-max self-center rounded-lg bg-mainGray px-4 py-1 text-secondaryGray text-xs text-center font-medium cursor-pointer capitalize"
        >{`${myInfo?._id === by ? "You" : actionBy?.userName || "Deleted User"} ${action} ${action === "Left" ? "" : myInfo?._id === to ? "You" : actionTo?.userName || "Deleted User"}`}</p>
      ) : (
        <>
          {currMsg?.date !== prevMsg?.date && (
            <div className="w-full flex justify-center">
              <span className="text-secondaryGray text-xs font-bold">{currMsg?.date}</span>
            </div>
          )}
          <div className={`${currMsg?.fromSelf ? "self-end" : "self-start"} w-[90%] max-w-max flex items-end gap-1`}>
            <figure className="w-6 h-6 rounded-full">
              {!currMsg?.fromSelf && currMsg?.sender !== (!nextMsg?.isInformational ? nextMsg?.sender : null) && (<img src={sender?.profilePicture || placeholderImg} alt="" className="w-full h-full object-cover rounded-full" />)}
            </figure>
            <div className={currMsg?.fromSelf ? sent : recieved}>
              {currMsg?.sender !== (!prevMsg?.isInformational ? prevMsg?.sender : null) && <p className={`text-${sender?.groupColor || "accentPurple"} font-medium text-xs`}>{currMsg?.fromSelf ? "" : sender?.userName || "Deleted User"}</p>}
              <p className="w-full text-white text-sm">{currMsg?.message}</p>
              <p className="text-white/50 text-xs tracking-wider">{currMsg?.time}</p>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default React.memo(SingleGroupChatMessage);