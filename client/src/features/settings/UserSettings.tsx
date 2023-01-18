import { EntityId } from '@reduxjs/toolkit';
import { useEffect, useRef, useState } from 'react';
import { FaAngleDown, FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import { ImSpinner9 } from 'react-icons/im';
import { MdOutlineBlock, MdOutlineLogout, MdOutlineManageAccounts } from 'react-icons/md';
import { RiFileEditFill } from 'react-icons/ri';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import ProfileUserItem from '../../components/ProfileUserItem';
import placeholderImg from '../../images/unknownUser.png';
import { mainUserInterface } from '../../utilities/interfaces';
import { selectUser, toggleChatBox } from '../api/globalSlice';
import LogoutButton from '../auth/LogoutButton';
import { useDeleteAccountMutation, useGetUsersQuery, useUpdateUserNameMutation } from '../auth/authSlice';
import SetGroupProfilePicture from '../chats/SetGroupProfilePicture';

const offscreen = 'absolute -left-[9999px]';
const onscreen = 'w-full bg-red-200 text-red-500 text-center rounded-md font-bold px-4 py-1 mb-2';

const UserSettings = () => {
  useGetUsersQuery();
  const dispatch = useAppDispatch();
  const [deleteAccount, { isLoading: deleteLoading }] = useDeleteAccountMutation();
  const [updateUserName, { isLoading }] = useUpdateUserNameMutation();
  const myInfo = useAppSelector(selectUser) as mainUserInterface;
  const errRef = useRef<HTMLParagraphElement>(null);
  const userRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState<string>(myInfo.userName);
  const [errMsg, setErrMsg] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [changePP, setChangePP] = useState<boolean>(false);
  const [dropIndex, setDropIndex] = useState<string>("");
  const [showDeletePopUp, setShowDeletePopUp] = useState<boolean>(false);

  const handleDrop = (val: string) => { setDropIndex(prev => prev === val ? "" : val); };
  const deleteMyAccount = async () => { await deleteAccount(); };
  const changeUserName = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (name.trim().length > 2 && name !== myInfo.userName) {
      try {
        await updateUserName(name).unwrap();
        setIsEditing(false); setName(myInfo.userName);
      } catch (err: any) {
        if (!err?.status) {
          setErrMsg('No Server Response');
        } else if (err.status === 400) {
          setErrMsg('Incomplete Credentials');
        } else if (err.status === 409) {
          setErrMsg('User Already Exists');
          userRef.current?.focus();
        } else {
          setErrMsg('Signup Failed');
          setIsEditing(false); setName(myInfo.userName);
        }
        errRef.current?.focus();
      }
    }
  };

  useEffect(() => { setErrMsg(""); }, [name, isEditing]);
  return (
    <section className="relative w-full h-screen px-2 py-6 flex flex-col items-center space-y-4 transition-all duration-300">
      <article className="w-full flex items-center justify-between px-2 gap-4 mb-4">
        <Link to="/chat"><button className="flex items-center text-secondaryGray text-sm tracking-wide font-medium"><FaAngleLeft className='text-2xl' /> Back</button></Link>
        <h1 className="flex-1 text-white text-lg text-center capitalize font-medium">profile</h1>
        <button className="text-secondaryGray text-sm tracking-wide font-medium" onClick={() => changePP ? setChangePP(false) : setIsEditing(!isEditing)}>{isEditing || changePP ? "Cancel" : "Edit Info"}</button>
      </article>
      <article className="w-full flex flex-col items-center gap-8 px-2 overflow-x-clip overflow-y-scroll">
        {/* USER INFO */}
        {changePP ? (
          <SetGroupProfilePicture userId={myInfo._id as EntityId} isGroup={false} setChangePP={setChangePP} currentImg={myInfo.profilePicture} />
        ) : (
          <div className="flex flex-col items-center gap-4">
            <p ref={errRef} className={errMsg ? onscreen : offscreen} aria-live='assertive'>{errMsg}</p>
            <figure className="relative w-56 h-56 rounded-full p-2 border-2 border-secondaryGray skeleton">
              <img src={myInfo?.profilePicture ? myInfo.profilePicture : placeholderImg} alt="" className="w-full h-full object-cover rounded-full" />
              <span className="absolute bg-black border-2 border-secondaryGray grid place-items-center bottom-2 right-2 w-10 h-10 rounded-full text-xl text-secondaryGray" onClick={() => setChangePP(true)}><RiFileEditFill /></span>
            </figure>
            <div className="flex flex-col items-center gap-1">
              {isEditing ? (
                <form className="flex flex-col items-center gap-2" onSubmit={changeUserName}>
                  <input
                    type="text"
                    placeholder="Username"
                    value={name}
                    ref={userRef}
                    onChange={e => setName(e.target.value)}
                    aria-label="New UserName"
                    className="w-full bg-black p-2 border-b border-accentGray text-white text-sm caret-accentPurple focus:outline-none placeholder:text-secondaryGray"
                  />
                  <button type="submit" className="py-1 px-8 grid place-items-center rounded-2xl border border-accentGray text-accentGray text-sm font-medium">{isLoading ? <ImSpinner9 className='animate-spin' /> : "Create"}</button>
                </form>
              ) : (
                <>
                  <h2 className="text-white text-xl text-center tracking-tight">{myInfo.userName}</h2>
                  <p className="text-secondaryGray text-sm text-center">{myInfo.email}</p>
                </>
              )}
            </div>
          </div>
        )}
        <section className="w-full max-w-[40rem] flex flex-col items-center justify-center gap-2">
          {/* BLOCKED ACCOUNTS */}
          <article className="w-full flex flex-col items-center bg-mainGray px-4 py-1 rounded-lg">
            <div className="w-full flex items-center gap-3 cursor-pointer">
              <span className="text-white/60 text-2xl"><MdOutlineBlock /></span>
              <div className="flex-1 flex items-center justify-between py-3">
                <h2 className="flex-1 text-white/60 text-sm capitalize">blocked accounts</h2>
                {myInfo.blockedUsers.length > 0 && <button className="text-white/60 text-xl" onClick={() => handleDrop("block")}>{dropIndex === "block" ? <FaAngleDown /> : <FaAngleRight />}</button>}
              </div>
            </div>
            <div style={{ "height": dropIndex === "block" ? `${3.2 * myInfo.blockedUsers.length}rem` : "0px" }} className={`w-full flex flex-col items-center justify-center transition-all duration-300  overflow-hidden`}>
              {myInfo.blockedUsers.map(id => (
                <ProfileUserItem key={id} id={id} isClicked={() => dispatch(toggleChatBox({ show: true, chat: { id, isGroup: false } }))} />
              ))}
            </div>
          </article>
          {/* ACCOUNT SETTINGS */}
          <article className="w-full flex flex-col items-center bg-mainGray px-4 py-1 rounded-lg">
            <div className="w-full flex items-center gap-3 cursor-pointer">
              <span className="text-white/60 text-2xl"><MdOutlineManageAccounts /></span>
              <div className="flex-1 flex items-center justify-between py-3">
                <h2 className="flex-1 text-white/60 text-sm capitalize">account settings</h2>
                <button className="text-white/60 text-xl" onClick={() => handleDrop("account")}>{dropIndex === "account" ? <FaAngleDown /> : <FaAngleRight />}</button>
              </div>
            </div>
            <div className={`w-full h-${dropIndex === "account" ? "20" : "0"} flex flex-col items-center justify-center transition-all duration-300 overflow-hidden`}>
              <div className="w-full flex items-center cursor-pointer py-2 border-b border-accentGray last:border-none">
                <p className="text-accentPurple text-sm font-medium capitalize"><Link to="/forgotpassword">change password</Link></p>
              </div>
              <div className="w-full flex items-center cursor-pointer py-2 border-b border-accentGray last:border-none">
                <p className="text-red-500 text-sm font-medium capitalize" onClick={() => setShowDeletePopUp(true)}>delete account</p>
              </div>
            </div>
          </article>
          {/* LOGOUT */}
          <article className="w-full flex flex-col items-center bg-mainGray px-4 py-1 rounded-lg">
            <div className="w-full flex items-center gap-3 cursor-pointer">
              <span className="text-red-500 text-2xl"><MdOutlineLogout /></span>
              <LogoutButton buttonStyle='flex-1 py-3 justify-start text-left text-red-500 text-sm capitalize' />
            </div>
          </article>
          {showDeletePopUp && (
            <>
              <div className="absolute top-0 left-0 right-0 bottom-0 w-80 h-max m-auto p-4 rounded-lg bg-mainGray z-20 grid place-items-center gap-2">
                <h3 className="text-white/70 text-sm text-center font-medium tracking-widest">Are you sure you want to delete your account?</h3>
                <div className="w-full flex items-center gap-4">
                  <button className="w-full py-2 rounded-lg bg-accentGray text-center font-medium text-white/70 text-lg" onClick={() => setShowDeletePopUp(false)}>No</button>
                  <button className="w-full grid place-items-center py-2 rounded-lg bg-red-500 text-center font-medium text-white/70 text-lg" onClick={deleteMyAccount}>{deleteLoading ? <ImSpinner9 className='animate-spin' /> : "Yes"}</button>
                </div>
              </div>
              <div className="absolute top-0 left-0 w-full h-full z-10 bg-black/70"></div>
            </>
          )}
        </section>
      </article>
    </section>
  );
};

export default UserSettings;