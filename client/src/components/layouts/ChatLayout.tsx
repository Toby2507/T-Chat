import { motion } from 'framer-motion';
import { Outlet } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import { selectChat, showChatBox, showProfile } from '../../features/api/globalSlice';
import ChatProfile from '../../features/chats/ChatProfile';
import ChatRoom from '../../features/chats/ChatRoom';
import GroupProfile from '../../features/chats/GroupProfile';
import useWindowSize from '../../utilities/useWindowSizeHook';

const ChatLayout = () => {
  const showChatbox = useAppSelector(showChatBox);
  const showProfileBox = useAppSelector(showProfile);
  const isGroup = useAppSelector(selectChat).isGroup;
  const { width } = useWindowSize();
  const mobileVariants = {
    Lounge: {
      x: 0,
    },
    Chatroom: {
      x: window.innerWidth * -1,
    }
  };
  const tabletVariants = {
    Lounge: {
      x: 0,
    },
    Chatroom: {
      x: window.innerWidth * -0.6,
    }
  };
  const variant = {
    open: {
      display: 'block',
      x: 0,
      transition: {
        type: "spring",
        stiffness: 150,
        damping: 40
      }
    },
    close: {
      x: window.innerWidth,
      transition: {
        type: "spring",
        stiffness: 150,
        damping: 40
      },
      transitionEnd: { display: "none" }
    }
  };
  return (
    <div className="relative w-full h-full overflow-clip">
      <section className="w-full h-full overflow-hidden md:hidden">
        <motion.div
          initial={false}
          variants={mobileVariants}
          animate={showChatbox ? 'Chatroom' : 'Lounge'}
          transition={{ duration: 0.3 }}
          className="flex items-center h-full w-full"
        >
          <div className="shrink-0 h-full" style={{ "width": `${width}px` }}><Outlet /></div>
          <div className="shrink-0 h-full" style={{ "width": `${width - 16}px`, "maxWidth": `${width}px` }}><ChatRoom /></div>
        </motion.div>
      </section>
      <section className="hidden w-full h-full overflow-hidden md:block lg:hidden">
        <motion.div
          initial={false}
          variants={tabletVariants}
          animate={showChatbox ? 'Chatroom' : 'Lounge'}
          transition={{ duration: 0.3 }}
          className="flex items-center h-full w-full"
        >
          <div className="shrink-0 h-full" style={{ "width": `${width * 0.6}px` }}><Outlet /></div>
          <div className="shrink-0 h-full" style={{ "width": `${width}px`, "maxWidth": `${width}px` }}><ChatRoom /></div>
        </motion.div>
      </section>
      <section className="hidden lg:grid grid-cols-[30%_70%] place-items-center h-full w-full overflow-hidden">
        <Outlet />
        <ChatRoom />
      </section>
      <motion.div
        initial={false}
        animate={showProfileBox ? "open" : "close"}
        variants={variant}
        className="absolute top-0 right-0 bottom-0 w-full bg-black grid place-items-center z-50 lg:w-[30%]"
      >
        {isGroup ? <GroupProfile /> : <ChatProfile />}
      </motion.div>
    </div>
  );
};

export default ChatLayout;