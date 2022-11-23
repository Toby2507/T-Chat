import { EntityId } from '@reduxjs/toolkit';
import { useEffect, useState } from 'react';
import { BiDotsVerticalRounded } from 'react-icons/bi';
import { IoIosArrowBack } from 'react-icons/io';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import AddChat from '../../components/AddChat';
import Loader from '../../components/Loader';
import Submenu from '../../components/Submenu';
import placeholderImg from '../../images/unknownUser.png';
import { selectChat, toggleChatBox } from '../api/globalSlice';
import { selectUserById } from '../auth/authSlice';
import { selectAllMessages, useLazyGetMessagesQuery, useSendMessageMutation } from './chatSlice';

const ChatContainer = () => {
  const dispatch = useAppDispatch();
  const [sendMessage, { isLoading }] = useSendMessageMutation();
  const currentChat = useAppSelector(selectChat) as EntityId;
  const chat = useAppSelector(state => selectUserById(state, currentChat));
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [getMessages, { isLoading: isloading }] = useLazyGetMessagesQuery();
  const messages = useAppSelector(state => selectAllMessages(state, currentChat));

  const handleSendMessage = async (msg: string) => {
    try {
      await sendMessage({ message: msg, to: chat?._id });
    } catch (err) { console.log(err); }
  };

  const addChatProps = { handleSendMessage, isLoading };
  useEffect(() => {
    const fetchChat = async () => {
      try {
        await getMessages(currentChat).unwrap();
      } catch (err) { console.log(err); }
    };
    fetchChat();
  }, [currentChat, getMessages]);
  return (
    <>
      <section className="h-screen grid grid-rows-[auto_1fr_auto]">
        <div className="relative px-4 py-2 flex gap-2 items-center bg-mainGray">
          <button onClick={() => dispatch(toggleChatBox(false))}><IoIosArrowBack className='text-lg text-white' /></button>
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
        <div className="w-full h-full p-4 flex flex-col justify-start space-y-2 overflow-y-scroll">
          <div className="flex flex-col space-y-2">
            <article className="w-full max-w-max bg-mainGray text-white text-sm px-4 py-2 rounded-3xl last-of-type:rounded-bl-none">How are you?</article>
            <article className="w-full max-w-max bg-mainGray text-white text-sm px-4 py-2 rounded-3xl last-of-type:rounded-bl-none">Did you have a good weekend?</article>
            <article className="w-full max-w-max bg-mainGray text-white text-sm px-4 py-2 rounded-3xl last-of-type:rounded-bl-none">Can I get the result today or tomorrow?</article>
            <p className="text-secondaryGray text-xs">10 July 2022 10:15pm</p>
          </div>
          <div className="self-end flex flex-col items-end space-y-2">
            <article className="w-full max-w-max bg-mainBlue text-white text-sm px-4 py-2 rounded-3xl last-of-type:rounded-br-none">Hey, I did thank you</article>
            <article className="w-full max-w-max bg-mainBlue text-white text-sm px-4 py-2 rounded-3xl last-of-type:rounded-br-none">Sure no problem, I’ll try to get it to you as soon as possible.</article>
            <p className="text-secondaryGray text-xs">10 July 2022 10:17pm</p>
          </div>
          <div className="flex flex-col space-y-2">
            <article className="w-full max-w-max bg-mainGray text-white text-sm px-4 py-2 rounded-3xl last-of-type:rounded-bl-none">Brother, complete asap please</article>
            <p className="text-secondaryGray text-xs">10 July 2022 10:18pm</p>
          </div>
          <div className="self-end flex flex-col items-end space-y-2">
            <article className="w-full max-w-max bg-mainBlue text-white text-sm px-4 py-2 rounded-3xl last-of-type:rounded-br-none">Hi, I'm done. I'll send it to you now</article>
            <article className="w-full max-w-max bg-mainBlue text-white text-sm px-4 py-2 rounded-3xl last-of-type:rounded-br-none">Check your slack bro</article>
            <p className="text-secondaryGray text-xs">11 July 2022 7:59am</p>
          </div>
          <div className="flex flex-col space-y-2">
            <article className="w-full max-w-max bg-mainGray text-white text-sm px-4 py-2 rounded-3xl last-of-type:rounded-bl-none">Okay, thanks.</article>
            <p className="text-secondaryGray text-xs">11 July 2022 8:14pm</p>
          </div>
        </div>
        <AddChat {...addChatProps} />
      </section>
      {loading && <Loader />}
    </>
  );
};

export default ChatContainer;