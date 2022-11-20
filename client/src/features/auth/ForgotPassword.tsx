import React, { useEffect, useRef, useState } from 'react';
import { AiOutlineMail } from 'react-icons/ai';
import Loader from '../../components/Loader';
import { useForgotPasswordMutation, useResendFPEmailMutation } from './authSlice';

const offscreen = 'absolute -left-[9999px]';
const onscreen = 'w-full bg-red-200 text-red-500 text-center rounded-md font-bold px-4 py-1';

const ForgotPassword = () => {
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const [resendEmail, { isLoading: resending }] = useResendFPEmailMutation();
  const userRef = useRef<HTMLInputElement>(null);
  const errRef = useRef<HTMLParagraphElement>(null);
  const [email, setEmail] = useState<string>('');
  const [emailSent, setEmailSent] = useState<boolean>(false);
  const [errMsg, setErrMsg] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await forgotPassword(email).unwrap();
      setEmailSent(true);
    } catch (err: any) {
      if (!err.status) {
        setErrMsg('No Server Response');
      } else if (err.data) {
        setErrMsg(err.data.message);
      } else {
        setErrMsg('Verification Failed');
      }
      errRef.current?.focus();
    }
  };
  const handleResend = async () => {
    try {
      await resendEmail(email).unwrap();
    } catch (err: any) {
      if (!err.status) {
        setErrMsg('No Server Response');
      } else if (err.data) {
        setErrMsg(err.data.message);
      } else {
        setErrMsg('Verification Failed');
      }
      errRef.current?.focus();
    }
  };

  useEffect(() => { userRef.current?.focus(); }, []);
  return (
    <>
      <p ref={errRef} className={errMsg ? onscreen : offscreen} aria-live='assertive'>{errMsg}</p>
      <div className="w-full flex flex-col space-y-4">
        <h1 className='w-full text-white text-xl text-center font-semibold capitalize pb-4 border-b border-accentGray'>recover password</h1>
        <p className="text-secondaryGray text-sm text-center">Don't worry, happens to the best of us.</p>
      </div>
      {!emailSent ? (
        <form onSubmit={handleSubmit} className="w-full flex flex-col items-center space-y-6">
          <div className="w-full flex flex-col space-y-2">
            <label htmlFor="email" className="text-white text-sm">Enter your email:</label>
            <div className="relative w-full h-10">
              <input
                type="email"
                id="email"
                ref={userRef}
                value={email}
                onChange={e => setEmail(e.target.value)}
                className='absolute w-full h-full rounded-3xl bg-white pl-10 focus:outline-none'
                required
              />
              <span className='absolute top-[0.6rem] left-4 text-xl'><AiOutlineMail /></span>
            </div>
          </div>
          <button type="submit" className='w-full bg-mainBlue py-3 grid place-items-center rounded-3xl text-sm text-white capitalize md:text-lg'>email me a recovery link</button>
        </form>
      ) : (
        <div className="w-full flex flex-col items-center space-y-8">
          <p className="text-white text-lg text-center font-medium">If account exists, an email will be sent with further instructions.</p>
          <p className="text-xs text-white text-center">Didn't receive the email? Check your spam folder <button onClick={handleResend} className="text-accentPurple pl-1">or click to resend</button></p>
        </div>
      )}
      {(isLoading || resending) && <Loader />}
    </>
  );
};

export default ForgotPassword;