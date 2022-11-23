import React from 'react';
import LogoutButton from '../features/auth/LogoutButton';
import { motion } from 'framer-motion';

interface submenuInterface {
  isOpen: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const Submenu = ({ isOpen, setLoading }: submenuInterface) => {
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
      className="absolute top-[95%] right-0 bg-mainGray z-50 rounded-md"
    >
      <div className='flex flex-col space-y-4 p-4'>
        <button className='text-secondaryGray text-left text-sm capitalize'>new group</button>
        <button className='text-secondaryGray text-left text-sm capitalize'>settings</button>
        <LogoutButton buttonStyle='text-secondaryGray text-left text-sm capitalize' loading={setLoading} />
      </div>
    </motion.div>
  );
};

export default Submenu;