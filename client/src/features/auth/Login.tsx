import React, { useEffect, useRef, useState } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineUser } from 'react-icons/ai';
import { RiLockPasswordLine } from 'react-icons/ri';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import Loader from '../../components/Loader';
import { selectUser } from '../api/globalSlice';
import { useLoginMutation } from './authSlice';

const offscreen = 'absolute -left-[9999px]';
const onscreen = 'w-full bg-red-200 text-red-500 text-center rounded-md font-bold px-4 py-1 mb-2';

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const currentUser = useAppSelector(selectUser);
    const from = location.state?.from?.pathname || '/chat';
    const userRef = useRef<HTMLInputElement>(null);
    const errRef = useRef<HTMLParagraphElement>(null);
    const pwdRef = useRef<HTMLInputElement>(null);

    const [login, { isLoading }] = useLoginMutation();
    const [userName, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [persist, setPersist] = useState<string>(JSON.parse(localStorage.getItem('persist') as string) || 'false');
    const [errMsg, setErrMsg] = useState<string>('');
    const [isPwdVisible, setIsPwdVisible] = useState<boolean>(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await login({ userName, password }).unwrap();
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
    useEffect(() => { localStorage.setItem('persist', JSON.stringify(persist)); }, [persist]);
    useEffect(() => { currentUser && navigate(from, { replace: true }); }, [currentUser, navigate, from]);
    return (
        <>
            <div className="w-full flex flex-col items-center space-y-2">
                <p ref={errRef} className={errMsg ? onscreen : offscreen} aria-live='assertive'>{errMsg}</p>
                <h1 className='text-white text-xl text-center font-semibold capitalize mb-4'>log in</h1>
            </div>
            <div className="w-full flex flex-col items-center space-y-4">
                <form onSubmit={handleSubmit} className='w-full flex flex-col space-y-4 items-center md:w-10/12 md:space-y-6'>
                    <div className="w-full flex flex-col space-y-2 items-start">
                        <label htmlFor="username" className='text-sm text-white font-medium capitalize'>username: </label>
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
                        <label htmlFor="password" className='text-sm text-white font-medium capitalize'>password: </label>
                        <div className="relative w-full h-10">
                            <input
                                id="password"
                                type={isPwdVisible ? "text" : "password"}
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
                            <input type="checkbox" id="persist" checked={persist === 'true'} onChange={(e) => setPersist(persist === 'true' ? 'false' : 'true')} />
                            <label htmlFor="persist" className='text-secondaryGray text-xs capitalize'>remember me</label>
                        </div>
                        <Link to='/forgotpassword' className='text-secondaryGray text-xs capitalize'>forgot password?</Link>
                    </div>
                    <button type="submit" className='bg-mainBlue py-3 w-48 grid place-items-center rounded-3xl text-sm text-white capitalize md:text-lg'>log in</button>
                </form>
                <p className="text-xs text-white pt-6">Need an account? <span className="text-accentPurple uppercase pl-1"><Link to='/signup'>sign up</Link></span></p>
                {isLoading && <Loader />}
            </div>
        </>
    );
};

export default Login;