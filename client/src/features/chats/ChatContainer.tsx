import { EntityId } from '@reduxjs/toolkit';
import { useEffect, useMemo, useRef, useState } from 'react';
import { BiDotsVerticalRounded } from 'react-icons/bi';
import { IoIosArrowBack } from 'react-icons/io';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import AddChat from '../../components/AddChat';
import Loader from '../../components/Loader';
import Submenu from '../../components/Submenu';
import placeholderImg from '../../images/unknownUser.png';
import { selectChat, toggleChatBox } from '../api/globalSlice';
import { selectUserById } from '../auth/authSlice';
import SingleMessage from './SingleMessage';
import { useReadMessagesQuery, useSendMessageMutation } from './chatSlice';

const ChatContainer = () => {
  const dispatch = useAppDispatch();
  const [sendMessage, { isLoading }] = useSendMessageMutation();
  const currentChat = useAppSelector(selectChat) as EntityId;
  const chat = useAppSelector(state => selectUserById(state, currentChat));
  const scrollRef = useRef<HTMLDivElement>(null);
  const messageIds = useMemo(() => chat?.messages ?? [], [chat]);
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const unreadMessages = chat?.unread as EntityId[];
  useReadMessagesQuery({ messages: unreadMessages, chat: currentChat }, { skip: unreadMessages.length === 0 });

  const handleSendMessage = async (msg: string) => {
    try {
      await sendMessage({ message: msg, to: (chat?._id as string) });
    } catch (err) { console.log(err); }
  };
  const addChatProps = { handleSendMessage, isLoading };
  useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messageIds]);
  return (
    <>
      <section className="w-full h-screen grid grid-rows-[auto_1fr_auto]">
        <div className="relative px-4 py-2 flex gap-2 items-center bg-mainGray">
          <button onClick={() => dispatch(toggleChatBox({ show: false, id: null }))}><IoIosArrowBack className='text-lg text-white' /></button>
          <figure className="w-14 h-14 rounded-full">
            <img src={chat?.profilePicture ? chat.profilePicture : placeholderImg} alt={chat?.userName} className="w-full h-full object-cover rounded-full" />
          </figure>
          <div className="flex-1 flex flex-col items-start justify-center">
            <h1 className="text-white text-base capitalize font-medium">{chat?.userName}</h1>
            <span className="text-secondaryGray text-xs">Active</span>
          </div>
          <button onClick={() => setShowOptions(!showOptions)} className="text-white text-3xl"><BiDotsVerticalRounded /></button>
          <Submenu setLoading={setLoading} isOpen={showOptions} />
        </div>
        <div className="w-full h-full p-4 flex flex-col justify-start space-y-3 overflow-y-scroll">
          {messageIds.map((id, i) => (
            <div ref={scrollRef} key={id} className="w-full flex flex-col justify-start space-y-3">
              <SingleMessage currId={id} prevId={messageIds[i - 1]} nextId={messageIds[i + 1]} chatId={currentChat} />
            </div>
          ))}
        </div>
        <AddChat {...addChatProps} />
      </section>
      {loading && <Loader />}
    </>
  );
};

export default ChatContainer;