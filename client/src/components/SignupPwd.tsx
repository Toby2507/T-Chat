import { useEffect, useState } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { FaCheck, FaInfoCircle, FaTimes } from 'react-icons/fa';
import { RiLockPasswordLine } from 'react-icons/ri';

const offscreen = 'absolute -left-[9999px]';
const instructions = 'relative flex items-start gap-2 bg-mainGray rounded-xl p-2 pl-7';
const instructionsText = 'tracking-tight leading-tight text-base text-white';

interface SignupInfoInterface {
  password: string,
  matchPwd: string,
  setPassword: React.Dispatch<React.SetStateAction<string>>,
  setMatchPwd: React.Dispatch<React.SetStateAction<string>>,
  passwordValid: boolean,
  matchPwdValid: boolean,
  userRef: React.RefObject<HTMLInputElement>;
}

const SignupPwd = ({ password, matchPwd, setPassword, setMatchPwd, passwordValid, matchPwdValid, userRef }: SignupInfoInterface) => {
  const [passwordFocused, setPasswordFocused] = useState<boolean>(false);
  const [matchPwdFocused, setMatchPwdFocused] = useState<boolean>(false);
  const [ispwdVisible, setIspwdVisible] = useState<boolean>(false);
  const [isMatchpwdVisible, setIsMatchpwdVisible] = useState<boolean>(false);

  useEffect(() => { userRef.current?.focus(); }, [userRef]);
  return (
    <div className='w-full flex flex-col space-y-4'>
      <div className="w-full flex flex-col space-y-2 items-start">
        <label htmlFor="password" className='flex items-center gap-2 text-sm text-white font-medium capitalize'>
          password:
          <span className={`${passwordValid ? '' : 'hidden'} text-green-500`}><FaCheck /></span>
          <span className={`${passwordValid || !password ? 'hidden' : ''} text-red-500`}><FaTimes /></span>
        </label>
        <div className="relative w-full h-10">
          <input
            type={ispwdVisible ? 'text' : 'password'}
            id="password"
            ref={userRef}
            value={password}
            onChange={e => setPassword(e.target.value)}
            className='absolute w-full h-full rounded-3xl bg-white pl-10 focus:outline-none'
            required
            aria-invalid={passwordValid ? 'false' : 'true'}
            aria-describedby='pwdNote'
            onFocus={() => setPasswordFocused(true)}
            onBlur={() => setPasswordFocused(false)}
          />
          <span className='absolute top-[0.6rem] left-4 text-xl'><RiLockPasswordLine /></span>
          <button type='button' className="absolute top-[0.6rem] right-4 text-xl text-accentGray" onClick={() => setIspwdVisible(!ispwdVisible)}>{ispwdVisible ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}</button>
        </div>
        <div id='pwdNote' className={passwordFocused && password && !passwordValid ? instructions : offscreen}>
          <FaInfoCircle className='absolute top-[0.6rem] left-2 text-white' />
          <p className={instructionsText}>8 to 24 characters. Must include uppercase and lowercase letters, a number and a special character. Allowed special characters:
            <span className='pl-1' aria-label='exclamation mark'>!</span>
            <span className='pl-1' aria-label='at sign'>@</span>
            <span className='pl-1' aria-label='number sign'>#</span>
            <span className='pl-1' aria-label='dollar sign'>$</span>
            <span className='pl-1' aria-label='percent sign'>%</span>
            <span className='pl-1' aria-label='caret'>^</span>
            <span className='pl-1' aria-label='ampersand'>&</span>
            <span className='pl-1' aria-label='asterisk'>*</span>
          </p>
        </div>
      </div>
      <div className="w-full flex flex-col space-y-2 items-start pb-2">
        <label htmlFor="confirmPassword" className='flex items-center gap-2 text-sm text-white font-medium capitalize'>
          confirm password:
          <span className={`${matchPwdValid && matchPwd ? '' : 'hidden'} text-green-500`}><FaCheck /></span>
          <span className={`${matchPwdValid || !matchPwd ? 'hidden' : ''} text-red-500`}><FaTimes /></span>
        </label>
        <div className="relative w-full h-10">
          <input
            type={isMatchpwdVisible ? 'text' : 'password'}
            id="confirmPassword"
            value={matchPwd}
            onChange={e => setMatchPwd(e.target.value)}
            className='absolute w-full h-full rounded-3xl bg-white pl-10 focus:outline-none'
            required
            aria-invalid={matchPwdValid ? 'false' : 'true'}
            aria-describedby='userNote'
            onFocus={() => setMatchPwdFocused(true)}
            onBlur={() => setMatchPwdFocused(false)}
          />
          <span className='absolute top-[0.6rem] left-4 text-xl'><RiLockPasswordLine /></span>
          <button type='button' className="absolute top-[0.6rem] right-4 text-xl text-accentGray" onClick={() => setIsMatchpwdVisible(!isMatchpwdVisible)}>{isMatchpwdVisible ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}</button>
        </div>
        <div id='userNote' className={matchPwdFocused && !matchPwd ? instructions : offscreen}>
          <FaInfoCircle className='absolute top-[0.6rem] left-2 text-white' />
          <p className={instructionsText}>Must match the first password input field</p>
        </div>
      </div>
    </div>
  );
};

export default SignupPwd;