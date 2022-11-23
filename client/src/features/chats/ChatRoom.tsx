import React from 'react';
import { useAppSelector } from '../../app/hooks';
import ChatContainer from './ChatContainer';
import ChatPlaceholder from '../../components/ChatPlaceholder';
import { selectChat } from '../api/globalSlice';

const ChatRoom = () => {
  const currentChat = useAppSelector(selectChat);
  return (
    <>
      {currentChat ? <ChatContainer /> : <ChatPlaceholder />}
    </>
  );
};

export default ChatRoom; 