import { useAppSelector } from '../../app/hooks';
import ChatPlaceholder from '../../components/ChatPlaceholder';
import { selectChat } from '../api/globalSlice';
import ChatContainer from './ChatContainer';

const ChatRoom = () => {
  const currentChat = useAppSelector(selectChat);
  return (
    <div className="w-full h-full relative">
      {currentChat.id ? <ChatContainer /> : <ChatPlaceholder />}
    </div>
  );
};

export default ChatRoom;