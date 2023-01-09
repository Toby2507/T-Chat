import { useState, useEffect } from 'react';
import { EntityId } from '@reduxjs/toolkit';
import placeholderImg from '../images/unknownUser.png';
import placeholderImg2 from '../images/unknownGroup.png';
import { FaAngleRight } from 'react-icons/fa';
import { useAppSelector } from '../app/hooks';
import { selectUserById } from '../features/auth/authSlice';
import { selectUser } from '../features/api/globalSlice';
import { mainUserInterface, userInterface, groupInterface } from '../utilities/interfaces';

interface profileUserItemInterface {
  id: EntityId;
  admins?: EntityId[];
}

const ProfileUserItem = ({ id, admins }: profileUserItemInterface) => {
  const myInfo = useAppSelector(selectUser);
  const user = useAppSelector(state => selectUserById(state, id));
  const [userInfo, setUserInfo] = useState<userInterface | groupInterface | mainUserInterface>({} as userInterface | groupInterface | mainUserInterface);

  useEffect(() => {
    const final = (myInfo?._id === id ? myInfo : user) as userInterface | groupInterface | mainUserInterface;
    setUserInfo(final);
  }, [myInfo, user, id]);
  return (
    <article className="group w-full flex items-center gap-3 cursor-pointer">
      <figure className="w-10 h-10 rounded-full skeleton">
        <img src={userInfo?.profilePicture ? userInfo.profilePicture : userInfo?.isGroup ? placeholderImg2 : placeholderImg} alt="Group display" className="w-full h-full object-cover rounded-full" />
      </figure>
      <div className="flex-1 flex items-center justify-between py-3 border-b border-accentGray group-last:border-none">
        <h2 className="flex-1 text-white text-base capitalize">{userInfo?.userName}</h2>
        {!userInfo?.isGroup && admins?.includes(id) && <span className="text-secondaryGray text-xs font-medium">Admin</span>}
        <span className="text-accentGray text-xl"><FaAngleRight /></span>
      </div>
    </article>
  );
};

export default ProfileUserItem;