import { EntityId } from '@reduxjs/toolkit';
import { useEffect, useMemo, useRef, useState } from 'react';
import { BiDotsVerticalRounded } from 'react-icons/bi';
import { IoIosArrowBack } from 'react-icons/io';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import AddChat from '../../components/AddChat';
import Loader from '../../components/Loader';
import Submenu from '../../components/Submenu';
import placeholderImg2 from '../../images/unknownGroup.png';
import placeholderImg from '../../images/unknownUser.png';
import { groupInterface, userInterface } from '../../utilities/interfaces';
import { selectChat, selectOnlineUsers, toggleChatBox, toggleProfile } from '../api/globalSlice';
import { selectUserById } from '../auth/authSlice';
import { useClearChatMutation, useSetChatInfoMutation } from '../settings/chatSettingSlice';
import SingleGroupChatMessage from './SingleGroupChatMessage';
import SingleMessage from './SingleMessage';
import { useReadMessagesQuery, useSendMessageMutation } from './chatSlice';
import { useLeaveGroupChatMutation } from './groupChatSlice';

const ChatContainer = () => {
  const dispatch = useAppDispatch();
  const [sendMessage, { isLoading }] = useSendMessageMutation();
  const [setChatInfo] = useSetChatInfoMutation();
  const [clearChat] = useClearChatMutation();
  const [leaveGroup] = useLeaveGroupChatMutation();
  const currentChat = useAppSelector(selectChat);
  const chat = useAppSelector(state => selectUserById(state, currentChat.id as EntityId));
  const onlineUsers = useAppSelector(selectOnlineUsers);
  const scrollRef = useRef<HTMLDivElement>(null);
  const messages = useMemo(() => chat?.messages ?? [], [chat]);
  const messageIds = messages.map(msg => msg.id);
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const unreadMessages = chat?.unread as EntityId[];
  useReadMessagesQuery({ messages: unreadMessages, chat: currentChat.id as EntityId }, { skip: !unreadMessages || unreadMessages.length === 0 });

  const handleSendMessage = async (msg: string) => {
    if (msg.trim()) {
      chat?.isGroup ? await sendMessage({ message: msg, to: (chat?._id as string), members: (chat as groupInterface).members as string[] }) : await sendMessage({ message: msg, to: (chat?._id as string) });
    }
  };
  const blockUser = () => { setChatInfo({ control: "blockedUsers", set: !(chat as userInterface)?.isBlocked as boolean, userId: currentChat.id as string }); setShowOptions(false); };
  const muteChat = () => { setChatInfo({ control: "mutedUsers", set: !chat?.isMuted as boolean, userId: currentChat.id as string }); setShowOptions(false); };
  const archiveChat = () => { setChatInfo({ control: "archivedChats", set: !chat?.isArchived as boolean, userId: currentChat.id as string }); setShowOptions(false); };
  const clearChatHistory = () => { clearChat({ messageIds: messageIds, to: currentChat.id as string }); setShowOptions(false); };
  const exitGroup = async () => { await leaveGroup(currentChat?.id as EntityId); };
  const addChatProps = { handleSendMessage, isLoading, isBlocked: (chat as userInterface)?.isBlocked as boolean, userId: currentChat.id as string };
  // SUBMENU PROPS
  const userOptions = [
    { name: "Contact Info", action: () => { dispatch(toggleProfile(true)); setShowOptions(false); } },
    { name: "Mute Notifications", opName: "Unmute Notifications", prev: chat?.isMuted, action: muteChat },
    { name: "Archive Chat", opName: "Unarchive Chat", prev: chat?.isArchived, action: archiveChat },
    { name: "Clear Chat", action: clearChatHistory },
    { name: "Block User", opName: "Unblock User", prev: (chat as userInterface)?.isBlocked, action: blockUser },
    { name: "Close Chat", action: () => { dispatch(toggleChatBox({ show: false, chat: { id: null, isGroup: false } })); setShowOptions(false); } },
  ];
  const groupOptions = [
    { name: "Group Info", action: () => { dispatch(toggleProfile(true)); setShowOptions(false); } },
    { name: "Mute Notifications", opName: "Unmute Notifications", prev: chat?.isMuted, action: muteChat },
    { name: "Archive Group", opName: "Unarchive Chat", prev: chat?.isArchived, action: archiveChat },
    { name: "Leave Group", action: exitGroup },
    { name: "Close Chat", action: () => { dispatch(toggleChatBox({ show: false, chat: { id: null, isGroup: false } })); setShowOptions(false); } },
  ];

  useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);
  return (
    <div className="w-full h-full relative">
      <section className="absolute top-0 bottom-0 h-full w-full border-l border-mainGray grid grid-rows-[auto_1fr_auto]">
        <div className="relative px-4 py-2 flex gap-2 items-center bg-mainGray">
          <button className="lg:hidden" onClick={() => dispatch(toggleChatBox({ show: false, chat: { id: null, isGroup: false } }))}><IoIosArrowBack className='text-lg text-white' /></button>
          <figure className="w-14 h-14 rounded-full">
            <img src={chat?.profilePicture ? chat.profilePicture : chat?.isGroup ? placeholderImg2 : placeholderImg} alt={chat?.userName} className="w-full h-full object-cover rounded-full" />
          </figure>
          <div className="flex-1 flex flex-col items-start justify-center" onClick={() => dispatch(toggleProfile(true))}>
            <h1 className="flex items-center gap-3 text-white text-base capitalize font-medium">
              {chat?.userName}
              {!chat?.isGroup && <span className={`${onlineUsers.includes(chat?._id as string) ? "bg-green-500" : "bg-red-500"} w-2 h-2 rounded-full`}></span>}
            </h1>
            <span className="text-secondaryGray text-xs">click here to for chat info</span>
          </div>
          <button onClick={() => setShowOptions(!showOptions)} className="hidden text-white text-3xl lg:block"><BiDotsVerticalRounded /></button>
          <Submenu setLoading={setLoading} type="chat" isOpen={showOptions} options={chat?.isGroup ? groupOptions : userOptions} />
        </div>
        <div className="w-full h-full p-4 flex flex-col justify-start gap-3 overflow-y-scroll">
          {messages.map((msg, i) => (
            <div ref={scrollRef} key={msg.id} className="w-full flex flex-col justify-start space-y-3">
              {currentChat.isGroup ? (
                <SingleGroupChatMessage currId={msg} prevId={messages[i - 1]} nextId={messages[i + 1]} chatId={currentChat.id as EntityId} isGroup={currentChat.isGroup} />
              ) : (
                <SingleMessage currId={msg} prevId={messages[i - 1]} nextId={messages[i + 1]} chatId={currentChat.id as EntityId} isGroup={currentChat.isGroup} />
              )}
            </div>
          ))}
          {!currentChat.isGroup && (chat as userInterface)?.isBlocked && <h2 className="w-max self-center rounded-lg bg-mainGray px-6 py-2 text-secondaryGray text-xs text-center font-medium cursor-pointer" onClick={blockUser}>You have blocked this user. Tap to unblock.</h2>}
        </div>
        <>
          {!currentChat.isGroup && (chat as userInterface)?.blockedMe ? (
            <h2 className="bg-mainGray px-4 py-2 text-secondaryGray text-xs text-center">You have been blocked by this user.</h2>
          ) : <AddChat {...addChatProps} />}
        </>
      </section>
      {loading && <Loader />}
    </div>
  );
};

export default ChatContainer;