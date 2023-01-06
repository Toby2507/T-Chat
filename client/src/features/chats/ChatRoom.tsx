import { useAppSelector } from '../../app/hooks';
import ChatPlaceholder from '../../components/ChatPlaceholder';
import { selectChat } from '../api/globalSlice';
import ChatContainer from './ChatContainer';

const ChatRoom = () => {
  const currentChat = useAppSelector(selectChat);
  return (
    <>
      {currentChat ? <ChatContainer /> : <ChatPlaceholder />}
    </>
  );
};

export default ChatRoom;