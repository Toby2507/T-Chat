import { motion } from 'framer-motion';
import { useAppSelector } from '../../app/hooks';
import { showChatBox } from '../api/globalSlice';
import ChatRoom from './ChatRoom';
import Lounge from './Lounge';

const ChatContainer = () => {
  const showChatbox = useAppSelector(showChatBox);
  const mobileVariants = {
    Lounge: {
      x: 0,
    },
    Chatroom: {
      x: '-100%',
    }
  };
  const tabletVariants = {
    Lounge: {
      x: 0,
    },
    Chatroom: {
      x: '-60%'
    }
  };
  return (
    <>
      <section className="relative w-full h-screen overflow-hidden md:hidden">
        <motion.div
          initial={false}
          variants={mobileVariants}
          animate={showChatbox ? 'Chatroom' : 'Lounge'}
          transition={{ duration: 0.3 }}
          className="absolute top-0 left-0 flex items-center h-full w-full"
        >
          <div className="shrink-0 grow-1 w-full h-full"><Lounge /></div>
          <div className="shrink-0 grow-1 w-full h-full"><ChatRoom /></div>
        </motion.div>
      </section>
      <section className="hidden relative w-full h-screen overflow-hidden md:block lg:hidden">
        <motion.div
          initial={false}
          variants={tabletVariants}
          animate={showChatbox ? 'Chatroom' : 'Lounge'}
          transition={{ duration: 0.3 }}
          className="absolute top-0 left-0 flex items-center h-full w-full"
        >
          <div className="shrink-0 grow-1 w-[60%] h-full"><Lounge /></div>
          <div className="shrink-0 grow-1 w-full h-full"><ChatRoom /></div>
        </motion.div>
      </section>
      <section className="hidden lg:grid grid-cols-[30%_70%] place-items-center h-screen w-full overflow-hidden">
        <Lounge />
        <ChatRoom />
      </section>
    </>
  );
};

export default ChatContainer;