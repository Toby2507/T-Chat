import { motion } from 'framer-motion';
import React from 'react';
import { Link } from 'react-router-dom';
import LogoutButton from '../features/auth/LogoutButton';

interface submenuInterface {
  isOpen: boolean;
  type: "main" | "chat" | "group";
  options?: { name: string, opName?: string, prev?: boolean, action: () => void; }[];
  setLoading?: React.Dispatch<React.SetStateAction<boolean>>;
}

const Submenu = ({ isOpen, type, setLoading, options }: submenuInterface) => {
  const submenuVariants = {
    open: {
      display: 'block',
      clipPath: "circle(150% at 100% 0%)",
      transition: {
        type: "spring",
        stiffness: 70,
        restDelta: 2
      }
    },
    closed: {
      clipPath: "circle(0% at 100% 0%)",
      transition: {
        type: "spring",
        stiffness: 350,
        damping: 40,
        delay: 0.1
      },
      transitionEnd: { display: "none", }
    }
  };
  return (
    <motion.div
      initial={false}
      variants={submenuVariants}
      animate={isOpen ? 'open' : 'closed'}
      className={`${type === 'main' ? "bg-accentGray" : "bg-mainGray"} absolute top-[95%] right-0 shadow-2xl z-50 rounded-md`}
    >
      <div className='flex flex-col space-y-4 p-4'>
        {type === 'main' && (
          <>
            <button className='text-white/80 text-left text-sm capitalize'><Link to='group'>new group</Link></button>
            <button className='text-white/80 text-left text-sm capitalize'><Link to='settings'>settings</Link></button>
            <LogoutButton buttonStyle='text-white/80 text-left text-sm capitalize' loading={setLoading} />
          </>
        )}
        {type === 'chat' && (
          options?.map((option, index) => (
            <button key={index} className='text-white/80 text-left text-sm capitalize' onClick={option.action}>{option.prev ? option.opName : option.name}</button>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default Submenu;