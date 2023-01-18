import { useEffect, useState } from 'react';
import { AiOutlineMail, AiOutlineUser } from 'react-icons/ai';
import { FaCheck, FaInfoCircle, FaTimes } from 'react-icons/fa';

const offscreen = 'absolute -left-[9999px]';
const instructions = 'relative flex items-start gap-2 bg-mainGray rounded-xl p-2 pl-7';
const instructionsText = 'tracking-tight leading-tight text-base text-white';

interface SignupInfoInterface {
  email: string,
  userName: string,
  setEmail: React.Dispatch<React.SetStateAction<string>>,
  setUserName: React.Dispatch<React.SetStateAction<string>>,
  emailValid: boolean,
  userNameValid: boolean,
  userRef: React.RefObject<HTMLInputElement>;
}
const SignupInfo = ({ email, userName, setEmail, setUserName, emailValid, userNameValid, userRef }: SignupInfoInterface) => {
  const [userNameFocused, setUserNameFocused] = useState<boolean>(false);
  const [emailFocused, setEmailFocused] = useState<boolean>(false);

  useEffect(() => { userRef.current?.focus(); }, [userRef]);
  return (
    <div className='w-full flex flex-col space-y-4'>
      <div className="w-full flex flex-col space-y-2 items-start">
        <label htmlFor="userName" className='flex items-center gap-2 text-sm text-white font-medium capitalize'>
          userName:
          <span className={`${userNameValid ? '' : 'hidden'} text-green-500`}><FaCheck /></span>
          <span className={`${userNameValid || !userName ? 'hidden' : ''} text-red-500`}><FaTimes /></span>
        </label>
        <div className="relative w-full h-10">
          <input
            type="text"
            id="userName"
            autoComplete='off'
            ref={userRef}
            value={userName}
            onChange={e => setUserName(e.target.value)}
            className='absolute w-full h-full rounded-3xl bg-white pl-10 focus:outline-none'
            required
            aria-invalid={userNameValid ? 'false' : 'true'}
            aria-describedby='userNote'
            onFocus={() => setUserNameFocused(true)}
            onBlur={() => setUserNameFocused(false)}
          />
          <span className='absolute top-[0.6rem] left-4 text-xl'><AiOutlineUser /></span>
        </div>
        <div id='userNote' className={userNameFocused && userName && !userNameValid ? instructions : offscreen}>
          <FaInfoCircle className='absolute top-[0.6rem] left-2 text-white' />
          <p className={instructionsText}>4 to 24 characters. Must begin with a letter. Letters, numbers, underscores and hyphens allowed.</p>
        </div>
      </div>
      <div className="w-full flex flex-col space-y-2 items-start">
        <label htmlFor="email" className='flex items-center gap-2 text-sm text-white font-medium capitalize'>
          email:
          <span className={`${emailValid ? '' : 'hidden'} text-green-500`}><FaCheck /></span>
          <span className={`${emailValid || !email ? 'hidden' : ''} text-red-500`}><FaTimes /></span>
        </label>
        <div className="relative w-full h-10">
          <input
            type="email"
            id="email"
            autoComplete='off'
            value={email}
            onChange={e => setEmail(e.target.value)}
            className='absolute w-full h-full rounded-3xl bg-white pl-10 focus:outline-none'
            required
            aria-invalid={emailValid ? 'false' : 'true'}
            aria-describedby='emailNote'
            onFocus={() => setEmailFocused(true)}
            onBlur={() => setEmailFocused(false)}
          />
          <span className='absolute top-[0.6rem] left-4 text-xl'><AiOutlineMail /></span>
        </div>
        <div id='emailNote' className={emailFocused && email && !emailValid ? instructions : offscreen}>
          <FaInfoCircle className='absolute top-[0.6rem] left-2 text-white' />
          <p className={instructionsText}>4 to 24 characters.
            <br />Must begin with a letter.
            <br /> Letters, numbers, underscores, hyphens allowed.</p>
        </div>
      </div>
    </div>
  );
};

export default SignupInfo;