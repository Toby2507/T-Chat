import { useEffect, useRef, useState } from 'react'
import { FaCheck, FaInfoCircle, FaTimes } from 'react-icons/fa'
import { AiOutlineUser, AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import { RiLockPasswordLine } from 'react-icons/ri'
import { Link } from 'react-router-dom'

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,24}$/
// OPTIONAL CLASSES
const offscreen = 'absolute -left-[9999px]'
const onscreen = 'bg-errorRed text-errorRedText text-center rounded-md font-bold p-2 mb-2'
const instructions = 'relative flex items-start gap-2 bg-mainGray rounded-xl p-2 pl-7'
const instructionsText = 'tracking-tight leading-tight text-base text-white'

const Signup = () => {
    const userRef = useRef<HTMLInputElement>(null)
    const errRef = useRef<HTMLParagraphElement>(null)
    const pwdRef = useRef<HTMLInputElement>(null)
    const matchpwdRef = useRef<HTMLInputElement>(null)

    const [username, setUsername] = useState<string>('');
    const [usernameValid, setUsernameValid] = useState<boolean>(false);
    const [usernameFocused, setUsernameFocused] = useState<boolean>(false);
    const [password, setPassword] = useState<string>('');
    const [passwordValid, setPasswordValid] = useState<boolean>(false);
    const [passwordFocused, setPasswordFocused] = useState<boolean>(false);
    const [matchPwd, setMatchPwd] = useState<string>('');
    const [matchPwdValid, setMatchPwdValid] = useState<boolean>(false);
    const [matchPwdFocused, setMatchPwdFocused] = useState<boolean>(false);
    const [errMsg, setErrMsg] = useState<string>('');

    useEffect(() => { userRef.current?.focus() }, [])
    useEffect(() => { setUsernameValid(USER_REGEX.test(username)) }, [username])
    useEffect(() => {
        setPasswordValid(PWD_REGEX.test(password))
        setMatchPwdValid(password === matchPwd)
    }, [password, matchPwd])
    useEffect(() => { setErrMsg('') }, [username, password, matchPwd])
    return (
        <>
            <p ref={errRef} className={errMsg ? onscreen : offscreen} aria-live='assertive'>{errMsg}</p>
            <h1 className='text-white text-xl text-center font-semibold capitalize mb-4'>sign up</h1>
            <form className='w-full flex flex-col space-y-4 items-center  md:w-10/12 md:space-y-4'>
                <div className="w-full flex flex-col space-y-2 items-start">
                    <label htmlFor="username" className='flex items-center gap-2 text-sm text-white font-medium capitalize'>
                        username:
                        <span className={`${usernameValid ? '' : 'hidden'} text-green-500`}><FaCheck /></span>
                        <span className={`${usernameValid || !username ? 'hidden' : ''} text-red-500`}><FaTimes /></span>
                    </label>
                    <div className="relative w-full h-10">
                        <input
                            type="text"
                            id="username"
                            ref={userRef}
                            autoComplete='off'
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            className='absolute w-full h-full rounded-3xl bg-white pl-10 focus:outline-none'
                            required
                            aria-invalid={usernameValid ? 'false' : 'true'}
                            aria-describedby='userNote'
                            onFocus={() => setUsernameFocused(true)}
                            onBlur={() => setUsernameFocused(false)}
                        />
                        <span className='absolute top-[0.6rem] left-4 text-xl'><AiOutlineUser /></span>
                    </div>
                    <div id='userNote' className={usernameFocused && username && !usernameValid ? instructions : offscreen}>
                        <FaInfoCircle className='absolute top-[0.6rem] left-2 text-white' />
                        <p className={instructionsText}>4 to 24 characters. Must begin with a letter. Letters, numbers, underscores and hyphens allowed.</p>
                    </div>
                </div>
                <div className="w-full flex flex-col space-y-2 items-start">
                    <label htmlFor="password" className='flex items-center gap-2 text-sm text-white font-medium capitalize'>
                        password:
                        <span className={`${passwordValid ? '' : 'hidden'} text-green-500`}><FaCheck /></span>
                        <span className={`${passwordValid || !password ? 'hidden' : ''} text-red-500`}><FaTimes /></span>
                    </label>
                    <div className="relative w-full h-10">
                        <input
                            type="password"
                            id="password"
                            ref={pwdRef}
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
                        <button type='button' className="absolute top-[0.6rem] right-4 text-xl text-accentGray" onClick={() => { if (pwdRef.current) pwdRef.current.type = pwdRef.current.type === 'password' ? 'text' : 'password' }}>{pwdRef.current?.type === 'password' ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}</button>
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
                            type="password"
                            id="confirmPassword"
                            ref={matchpwdRef}
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
                        <button type='button' className="absolute top-[0.6rem] right-4 text-xl text-accentGray" onClick={() => { if (matchpwdRef.current) matchpwdRef.current.type = matchpwdRef.current.type === 'password' ? 'text' : 'password' }}>{matchpwdRef.current?.type === 'password' ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}</button>
                    </div>
                    <div id='userNote' className={matchPwdFocused && !matchPwd ? instructions : offscreen}>
                        <FaInfoCircle className='absolute top-[0.6rem] left-2 text-white' />
                        <p className={instructionsText}>Must match the first password input field</p>
                    </div>
                </div>
                <button
                    type="submit"
                    disabled={!usernameValid && !passwordValid && !matchPwdValid}
                    className='bg-mainBlue py-3 w-48 rounded-3xl text-sm text-white capitalize md:text-lg'
                >sign up</button>
            </form>
            <p className="text-xs text-white pt-6">Already have an account? <span className="text-accentPurple uppercase"><Link to='/auth/login'>log in</Link></span></p>
        </>
    )
}

export default Signup