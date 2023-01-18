import { EntityId } from '@reduxjs/toolkit';
import { useEffect, useRef, useState } from 'react';
import { HiPlus } from 'react-icons/hi';
import { ImSpinner9 } from 'react-icons/im';
import { IoClose } from 'react-icons/io5';
import { RiFileEditFill } from 'react-icons/ri';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import PopUpMenu from '../../components/PopUpMenu';
import ProfileUserItem from '../../components/ProfileUserItem';
import placeholderImg from '../../images/unknownGroup.png';
import { groupInterface } from '../../utilities/interfaces';
import { selectChat, selectUser, toggleChatBox, toggleProfile } from '../api/globalSlice';
import { selectUserById } from '../auth/authSlice';
import { useSetChatInfoMutation } from '../settings/chatSettingSlice';
import AddNewGroupMember from './AddNewGroupMember';
import SetGroupProfilePicture from './SetGroupProfilePicture';
import { useDeleteGroupChatMutation, useEditGroupInfoMutation, useGroupAdminHandlerMutation, useLeaveGroupChatMutation, useRemoveGroupMemberMutation } from './groupChatSlice';

const offscreen = 'absolute -left-[9999px]';
const onscreen = 'w-full bg-red-200 text-red-500 text-center rounded-md font-bold px-4 py-1 mb-2';

const GroupProfile = () => {
  const dispatch = useAppDispatch();
  const [setChatInfo] = useSetChatInfoMutation();
  const [removeGroupMember] = useRemoveGroupMemberMutation();
  const [leaveGroup] = useLeaveGroupChatMutation();
  const [deleteGroupChat] = useDeleteGroupChatMutation();
  const [editGroup, { isLoading }] = useEditGroupInfoMutation();
  const [adminHandler] = useGroupAdminHandlerMutation();
  const user = useAppSelector(selectChat);
  const myInfo = useAppSelector(selectUser);
  const userInfo = useAppSelector(state => selectUserById(state, user.id as EntityId)) as groupInterface;
  const [showPopUp, setShowPopUp] = useState<boolean>(false);
  const [popUpId, setPopUpId] = useState<EntityId>("");
  // EDIT VARIABLES
  const errRef = useRef<HTMLParagraphElement>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [name, setName] = useState<string>(userInfo?.userName);
  const [description, setDescription] = useState<string>(userInfo?.description);
  const [errMsg, setErrMsg] = useState<string>("");
  // TOGGLE SETTINGS FEATURES VARIABLES
  const [changePP, setChangePP] = useState<boolean>(false);
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false);
  const isAdmin = userInfo?.admins.includes(myInfo?._id as EntityId);
  // GROUP SETTINGS FUNCTIONS
  const editGroupInfo = async () => {
    if (name === userInfo?.userName && description === userInfo?.description) return;
    if (name.trim().length > 2) {
      try {
        await editGroup({ groupId: userInfo?._id as EntityId, name, description }).unwrap();
        setIsEditing(false); setName(userInfo?.userName); setDescription(userInfo?.description);
      } catch (err: any) {
        if (!err?.status) {
          setErrMsg('No Server Response');
        } else if (err.status === 409) {
          setErrMsg('Group Already Exists');
        } else {
          setErrMsg('Group Creation Failed');
          setIsEditing(false); setName(userInfo?.userName); setDescription(userInfo?.description);
        }
        errRef.current?.focus();
      }
    }
  };
  const muteChat = async () => { await setChatInfo({ control: "mutedUsers", set: !userInfo?.isMuted as boolean, userId: user.id as string }); };
  const archiveChat = async () => { await setChatInfo({ control: "archivedChats", set: !userInfo?.isArchived as boolean, userId: user.id as string }); };
  const removeMember = async (id: EntityId) => { await removeGroupMember({ groupId: userInfo?._id as EntityId, userId: id }); };
  const exitGroup = async () => { await leaveGroup(userInfo?._id as EntityId); };
  const deleteGroup = async () => { await deleteGroupChat({ groupId: userInfo?._id as string, members: userInfo?.members as string[] }); };
  const makeAdmin = async (id: EntityId) => { await adminHandler({ groupId: userInfo?._id, userId: id, prev: userInfo?.admins.includes(id) }); };
  const popUpMenuProps = {
    title: useAppSelector(state => selectUserById(state, popUpId))?.userName as string,
    options: [
      {
        name: "Goto", onClick: () => {
          dispatch(toggleChatBox({ show: true, chat: { id: popUpId, isGroup: false } }));
        }
      },
      { name: "Make Admin", altName: "Remove Admin", setAlt: userInfo?.admins.includes(popUpId), onClick: async () => { await makeAdmin(popUpId); setShowPopUp(false); } },
      { name: "Remove Member", onClick: async () => { await removeMember(popUpId); setShowPopUp(false); } },
    ],
    close: () => setShowPopUp(false),
  };

  useEffect(() => { setErrMsg(""); }, [name, description, isEditing]);
  return (
    <section className="relative w-full h-screen grid grid-rows-[auto_1fr] border-l border-mainGray">
      <article className="relative w-full p-5 flex gap-6 items-center bg-mainGray">
        <button onClick={() => dispatch(toggleProfile(false))}><IoClose className='text-3xl text-secondaryGray' /></button>
        <h1 className="flex-1 text-white text-lg font-medium tracking-widest">Group Info</h1>
        {isAdmin && (
          <button className="text-secondaryGray text-base tracking-wide font-medium" onClick={() => { changePP ? setChangePP(false) : setIsEditing(!isEditing); }}>{isEditing || changePP ? "Cancel" : "Edit"}</button>
        )}
      </article>
      <article className="flex flex-col items-center gap-8 px-4 py-16 overflow-x-clip overflow-y-scroll">
        {/* USER INFO */}
        {changePP ? (
          <SetGroupProfilePicture userId={userInfo?._id as EntityId} isGroup={true} setChangePP={setChangePP} currentImg={userInfo?.profilePicture} />
        ) : (
          <div className="flex flex-col items-center gap-4">
            <p ref={errRef} className={errMsg ? onscreen : offscreen} aria-live='assertive'>{errMsg}</p>
            <figure className="relative w-56 h-56 rounded-full p-2 border-2 border-secondaryGray skeleton">
              <img src={userInfo?.profilePicture ? userInfo.profilePicture : placeholderImg} alt="" className="w-full h-full object-cover rounded-full" />
              {isAdmin && (
                <span className="absolute bg-black border-2 border-secondaryGray grid place-items-center bottom-2 right-2 w-10 h-10 rounded-full text-xl text-secondaryGray" onClick={() => setChangePP(true)}><RiFileEditFill /></span>
              )}
            </figure>
            <div className="flex flex-col items-center gap-1">
              {isEditing ? (
                <input
                  type="text"
                  placeholder="Group Description"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-black p-2 border-b border-accentGray text-white text-sm caret-accentPurple focus:outline-none placeholder:text-secondaryGray"
                />
              ) : (
                <h2 className="text-white text-2xl text-center tracking-tight">{userInfo?.userName}</h2>
              )}
              <p className="text-secondaryGray text-base text-center">Group</p>
            </div>
          </div>
        )}
        {/* GROUP DESCRIPTION */}
        {(isAdmin || userInfo?.description) && (
          <section className="w-full max-w-[40rem] flex flex-col items-center justify-center bg-mainGray px-4 py-3 rounded-lg mx-6">
            {isEditing ? (
              <div className="w-full flex flex-col items-center gap-2">
                <input
                  type="text"
                  placeholder="Group Description"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full bg-transparent p-2 border-b border-secondaryGray text-white text-sm caret-accentPurple focus:outline-none placeholder:text-secondaryGray"
                />
                <button className='bg-transparent py-2 px-10 border border-secondaryGray grid place-items-center rounded-3xl text-sm text-secondaryGray capitalize' onClick={editGroupInfo}>{isLoading ? <ImSpinner9 className='animate-spin' /> : "Submit"}</button>
              </div>
            ) : (
              <p className={`${userInfo?.description ? "text-white text-sm" : "text-accentPurple text-base"} capitalize`}>{userInfo?.description || "add group description"}</p>
            )}
          </section>
        )}
        {/* GROUP PARTICIPANTS */}
        <section className="w-full max-w-[40rem] flex flex-col justify-center gap-4 mx-6">
          {isAddingNew ? (
            <AddNewGroupMember groupId={userInfo?._id as EntityId} members={userInfo?.members} close={() => setIsAddingNew(false)} />
          ) : (
            <>
              <h2 className="text-white text-lg font-medium">{`${userInfo?.members.length} Participants`}</h2>
              <div className="flex flex-col items-center justify-center bg-mainGray px-4 py-1 rounded-lg">
                {/* CREATE NEW GROUP UI */}
                {isAdmin && (
                  <article className="group w-full flex items-center gap-3 cursor-pointer" onClick={() => setIsAddingNew(true)}>
                    <div className="w-8 h-8 grid place-items-center bg-accentGray rounded-full text-accentPurple text-xl"><HiPlus /></div>
                    <div className="flex-1 flex items-center justify-between py-3 border-b border-accentGray group-last:border-none">
                      <h2 className="flex-1 text-accentPurple text-sm capitalize">Add Participants</h2>
                    </div>
                  </article>
                )}
                {/* SINGLE USER UI */}
                {userInfo?.members.map(id => (
                  <ProfileUserItem
                    key={id}
                    id={id}
                    admins={userInfo?.admins}
                    isClicked={() => { if (isAdmin) { setShowPopUp(true); setPopUpId(id); } else { dispatch(toggleChatBox({ show: true, chat: { id, isGroup: false } })); } }}
                  />
                ))}
              </div>
            </>
          )}
        </section>
        {/* POPMENU FOR PARTICIPANTS */}
        {showPopUp && (
          <>
            <div className="absolute bottom-2 left-0 right-0 z-20 mx-auto w-max">
              <PopUpMenu {...popUpMenuProps} />
            </div>
            <div className="absolute top-0 left-0 w-full h-full bg-black/70 z-10"></div>
          </>
        )}
        {/* CHAT OPTIONS */}
        <section className="w-full max-w-[40rem] flex flex-col items-center justify-center bg-mainGray px-4 py-1 rounded-lg mx-6">
          <article className="w-full flex items-center cursor-pointer py-3 border-b border-accentGray last:border-none" onClick={muteChat}>
            <p className=" text-accentPurple text-base capitalize">{userInfo?.isMuted ? "unmute Group" : "mute group"}</p>
          </article>
          <article className="w-full flex items-center cursor-pointer py-3 border-b border-accentGray last:border-none" onClick={archiveChat}>
            <p className=" text-accentPurple text-base capitalize">{userInfo?.isArchived ? "unarchive group" : "archive group"}</p>
          </article>
          <article className="w-full flex items-center cursor-pointer py-3 border-b border-accentGray last:border-none" onClick={exitGroup}>
            <p className=" text-red-500 text-base capitalize">exit group</p>
          </article>
          {isAdmin && (
            <article className="w-full flex items-center cursor-pointer py-3 border-b border-accentGray last:border-none" onClick={deleteGroup}>
              <p className=" text-red-500 text-base capitalize">delete group</p>
            </article>
          )}
        </section>
      </article>
    </section>
  );
};

export default GroupProfile;