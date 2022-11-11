import React, { useEffect, useRef, useState } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineUser } from 'react-icons/ai';
import { RiLockPasswordLine } from 'react-icons/ri';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { useLoginMutation } from './authSlice';
import { ImSpinner9 } from "react-icons/im";
import { selectUser, setCredentials } from './userSlice';

const offscreen = 'absolute -left-[9999px]';
const onscreen = 'bg-errorRed text-errorRedText text-center rounded-md font-bold p-2 mb-2';

const Login = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const currentUser = useAppSelector(selectUser);
    const from = location.state?.from?.pathname || '/lounge';
    const userRef = useRef<HTMLInputElement>(null);
    const errRef = useRef<HTMLParagraphElement>(null);
    const pwdRef = useRef<HTMLInputElement>(null);

    const [login, { isLoading }] = useLoginMutation();
    const [userName, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [rememberMe, setRememberMe] = useState<string>(JSON.parse(localStorage.getItem('rememberMe') || 'false'));
    const [isPwdVisible, setIsPwdVisible] = useState<boolean>(false);
    const [errMsg, setErrMsg] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const res = await login({ userName, password }).unwrap();
            console.log(res);
            dispatch(setCredentials({ ...res }));
            setUsername(''); setPassword('');
            navigate(from, { replace: true });
        } catch (err: any) {
            if (!err.status) {
                setErrMsg('No Server Response');
            } else if (err.status === 400) {
                setErrMsg('Incomplete credentials');
            } else if (err.status === 401) {
                setErrMsg('Username or Password Incorrect');
            } else {
                setErrMsg('Login Failed');
                setUsername(''); setPassword('');
            }
            errRef.current?.focus();
        }
    };

    useEffect(() => { userRef.current?.focus(); }, []);
    useEffect(() => { setErrMsg(''); }, [userName, password]);
    useEffect(() => { localStorage.setItem('rememberMe', JSON.stringify(rememberMe)); }, [rememberMe]);
    useEffect(() => { currentUser.user && currentUser.accessToken && navigate(from, { replace: true }); }, []);
    return (
        <>
            <p ref={errRef} className={errMsg ? onscreen : offscreen} aria-live='assertive'>{errMsg}</p>
            <h1 className='text-white text-xl text-center font-semibold capitalize mb-4'>log in</h1>
            <form onSubmit={handleSubmit} className='w-full flex flex-col space-y-4 items-center md:w-10/12 md:space-y-6'>
                <div className="w-full flex flex-col space-y-2 items-start">
                    <label htmlFor="username" className='flex items-center gap-2 text-sm text-white font-medium capitalize'>username: </label>
                    <div className="relative w-full h-10">
                        <input
                            type="text"
                            id="username"
                            ref={userRef}
                            autoComplete='off'
                            value={userName}
                            onChange={e => setUsername(e.target.value)}
                            className='absolute w-full h-full rounded-3xl bg-white pl-10 focus:outline-none'
                            required
                        />
                        <span className='absolute top-[0.6rem] left-4 text-xl'><AiOutlineUser /></span>
                    </div>
                </div>
                <div className="w-full flex flex-col space-y-2 items-start">
                    <label htmlFor="password" className='flex items-center gap-2 text-sm text-white font-medium capitalize'>password: </label>
                    <div className="relative w-full h-10">
                        <input
                            type="password"
                            id={isPwdVisible ? "text" : "password"}
                            ref={pwdRef}
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className='absolute w-full h-full rounded-3xl bg-white pl-10 focus:outline-none'
                            required
                        />
                        <span className='absolute top-[0.6rem] left-4 text-xl'><RiLockPasswordLine /></span>
                        <button type='button' className="absolute top-[0.6rem] right-4 text-xl text-accentGray" onClick={() => setIsPwdVisible(!isPwdVisible)}>{isPwdVisible ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}</button>
                    </div>
                </div>
                <div className="w-full flex justify-between items-center">
                    <div className="self-start flex items-center gap-2">
                        <input type="checkbox" id="rememberMe" checked={rememberMe === 'false' ? false : true} onChange={(e) => setRememberMe(e.target.checked ? 'true' : 'false')} />
                        <label htmlFor="rememberMe" className='text-secondaryGray text-xs capitalize'>remember me</label>
                    </div>
                    <Link to='/forgot-password' className='text-secondaryGray text-xs capitalize'>forgot password?</Link>
                </div>
                <button type="submit" className='bg-mainBlue py-3 w-48 grid place-items-center rounded-3xl text-sm text-white capitalize md:text-lg'>{isLoading ? <ImSpinner9 className='animate-spin' /> : 'log in'}</button>
            </form>
            <p className="text-xs text-white pt-6">Need an account? <span className="text-accentPurple uppercase pl-1"><Link to='/signup'>sign up</Link></span></p>
        </>
    );
};

export default Login;