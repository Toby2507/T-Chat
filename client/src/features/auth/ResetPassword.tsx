import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Loader from '../../components/Loader';
import SignupPwd from '../../components/SignupPwd';
import { useResetPasswordMutation } from './authSlice';

const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,24}$/;
const offscreen = 'absolute -left-[9999px]';
const onscreen = 'w-full bg-red-200 text-red-500 text-center rounded-md font-bold px-4 py-1 mb-2';

const ResetPassword = () => {
  const { id, passwordResetCode } = useParams();
  const navigate = useNavigate();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const userRef = useRef<HTMLInputElement>(null);
  const errRef = useRef<HTMLParagraphElement>(null);
  const [password, setPassword] = useState<string>('');
  const [passwordValid, setPasswordValid] = useState<boolean>(false);
  const [matchPwd, setMatchPwd] = useState<string>('');
  const [matchPwdValid, setMatchPwdValid] = useState<boolean>(false);
  const [errMsg, setErrMsg] = useState<string>('');

  const pwds = { password, matchPwd, setPassword, setMatchPwd, passwordValid, matchPwdValid, userRef };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await resetPassword({ id, passwordResetCode, password }).unwrap();
      navigate('/login');
    } catch (err: any) {
      console.log(err);
      if (!err.status) {
        setErrMsg('No Server Response');
      } else if (err.data) {
        setErrMsg(err.data.message);
      } else {
        setErrMsg('Verification Failed');
        setPassword(''); setMatchPwd('');
      }
      errRef.current?.focus();
    }
  };

  useEffect(() => {
    setPasswordValid(PWD_REGEX.test(password));
    setMatchPwdValid(password === matchPwd);
  }, [password, matchPwd]);
  useEffect(() => { setErrMsg(''); }, [password, matchPwd]);
  return (
    <>
      <div className="w-full flex flex-col items-center space-y-2 mb-4">
        <p ref={errRef} className={errMsg ? onscreen : offscreen} aria-live='assertive'>{errMsg}</p>
        <h1 className='text-white text-xl text-center font-semibold capitalize mb-4'>create new password</h1>
      </div>
      <div className='w-full flex flex-col items-center space-y-4'>
        <form onSubmit={handleSubmit} className='w-full flex flex-col space-y-4 items-center md:w-10/12 md:space-y-6'>
          <SignupPwd {...pwds} />
          <button
            type="submit"
            disabled={!passwordValid && !matchPwdValid}
            className='bg-mainBlue py-3 w-48 grid place-items-center rounded-3xl text-sm text-white capitalize md:text-lg'
            aria-label='sign up'
          >reset password</button>
        </form>
      </div>
      {isLoading && <Loader />}
    </>
  );
};

export default ResetPassword;