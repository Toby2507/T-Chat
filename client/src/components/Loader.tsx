import { motion } from 'framer-motion';
import Logo from '../images/logo_icon.svg';

const Loader = () => {
  const animate = { x: ["-50%", "150%", "-50%"] };
  const transition = { duration: 1.5, ease: 'easeInOut', repeat: Infinity };
  return (
    <div className="absolute -top-10 left-0 right-0 bottom-0 flex flex-col space-y-4 items-center justify-center bg-black z-50">
      <div className="flex items-center space-x-4">
        <img src={Logo} alt="Logo" className='w-10 h-10 object-cover' />
        <h1 className="text-white text-2xl font-bold tracking-wider">T Chat</h1>
      </div>
      <motion.div className="relative w-60 h-2 bg-white/70 rounded 3xl overflow-hidden md:w-80">
        <motion.span animate={animate} transition={transition} className="absolute top-0 left-0 w-1/2 h-full bg-mainBlue rounded-3xl"></motion.span>
      </motion.div>
    </div>
  );
};

export default Loader;