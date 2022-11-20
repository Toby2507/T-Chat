import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import Loader from '../../components/Loader';
import { useSignupMutation } from './authSlice';
// Components
import SignupInfo from '../../components/SignupInfo';
import SignupPwd from '../../components/SignupPwd';
import { selectUser, setCredentials } from '../api/globalSlice';

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const EMAIL_REGEX = /^[\w.+-]{3,}@[\w-]+\.[\w-]+$/;
// const test_regex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,24}$/;
// OPTIONAL CLASSES
const offscreen = 'absolute -left-[9999px]';
const onscreen = 'w-full bg-red-200 text-red-500 text-center rounded-md font-bold px-4 py-1 mb-2';

const Signup = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const currentUser = useAppSelector(selectUser);
    const userRef = useRef<HTMLInputElement>(null);
    const errRef = useRef<HTMLParagraphElement>(null);

    const [signup, { isLoading }] = useSignupMutation();
    const [userName, setUserName] = useState<string>('');
    const [userNameValid, setUserNameValid] = useState<boolean>(false);
    const [email, setEmail] = useState<string>('');
    const [emailValid, setEmailValid] = useState<boolean>(false);
    const [password, setPassword] = useState<string>('');
    const [passwordValid, setPasswordValid] = useState<boolean>(false);
    const [matchPwd, setMatchPwd] = useState<string>('');
    const [matchPwdValid, setMatchPwdValid] = useState<boolean>(false);
    const [errMsg, setErrMsg] = useState<string>('');
    const [infoTaken, setInfoTaken] = useState<boolean>(false);

    const infos = { email, userName, setEmail, setUserName, emailValid, userNameValid, userRef };
    const pwds = { password, matchPwd, setPassword, setMatchPwd, passwordValid, matchPwdValid, userRef };

    const reset = (type: string) => {
        if (type === 'all' || type === 'info') {
            setUserName(''); setUserNameValid(false);
            setPassword(''); setPasswordValid(false);
            setEmail(''); setEmailValid(false);
        }
        if (type === 'all' || type === 'ui') { setInfoTaken(false); }
    };
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const res = await signup({ userName, email, password }).unwrap();
            dispatch(setCredentials(res));
            reset('info');
            navigate('/verify', { replace: true });
        } catch (err: any) {
            if (!err?.status) {
                setErrMsg('No Server Response');
            } else if (err.status === 400) {
                setErrMsg('Incomplete Credentials');
                reset('ui');
            } else if (err.status === 409) {
                setErrMsg('User Already Exists');
                reset('ui');
            } else {
                setErrMsg('Signup Failed');
                reset('all');
            }
            errRef.current?.focus();
        }
    };

    useEffect(() => { userRef.current?.focus(); }, []);
    useEffect(() => { setUserNameValid(USER_REGEX.test(userName)); }, [userName]);
    useEffect(() => { setEmailValid(EMAIL_REGEX.test(email)); }, [email]);
    useEffect(() => {
        setPasswordValid(PWD_REGEX.test(password));
        setMatchPwdValid(password === matchPwd);
    }, [password, matchPwd]);
    useEffect(() => { setErrMsg(''); }, [userName, password, matchPwd]);
    useEffect(() => { currentUser && navigate('/lounge', { replace: true }); }, [currentUser, navigate]);
    return (
        <>
            <div className="w-full flex flex-col items-center space-y-2">
                <p ref={errRef} className={errMsg ? onscreen : offscreen} aria-live='assertive'>{errMsg}</p>
                <h1 className='text-white text-xl text-center font-semibold capitalize mb-4'>sign up</h1>
            </div>
            <div className="w-full flex flex-col items-center space-y-4">
                <form className='w-full flex flex-col space-y-8 items-center  md:w-10/12' onSubmit={handleSubmit}>
                    {infoTaken ? <SignupPwd {...pwds} /> : <SignupInfo {...infos} />}
                    {infoTaken ? (
                        <button
                            type="submit"
                            disabled={!passwordValid && !matchPwdValid}
                            className='bg-mainBlue py-3 w-48 grid place-items-center rounded-3xl text-sm text-white capitalize md:text-lg'
                            aria-label='sign up'
                        >sign up</button>
                    ) : (
                        <button
                            type="button"
                            disabled={!userNameValid && !emailValid}
                            className='bg-mainBlue py-3 w-48 rounded-3xl text-sm text-white capitalize md:text-lg'
                            onClick={() => setInfoTaken(true)}
                        >next</button>
                    )}
                </form>
                <p className="text-xs text-white pt-6">Already have an account? <span className="text-accentPurple uppercase"><Link to='/login'>log in</Link></span></p>
                {isLoading && <Loader />}
            </div>
        </>
    );
};

export default Signup;