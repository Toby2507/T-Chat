import { EntityId } from '@reduxjs/toolkit';
import { useEffect, useState } from 'react';
import { FaAngleRight } from 'react-icons/fa';
import { useAppSelector } from '../app/hooks';
import { selectUser } from '../features/api/globalSlice';
import { selectUserById } from '../features/auth/authSlice';
import placeholderImg2 from '../images/unknownGroup.png';
import placeholderImg from '../images/unknownUser.png';
import { groupInterface, mainUserInterface, userInterface } from '../utilities/interfaces';

interface profileUserItemInterface {
  id: EntityId;
  admins?: EntityId[];
  isClicked?: () => void;
}

const ProfileUserItem = ({ id, admins, isClicked }: profileUserItemInterface) => {
  const myInfo = useAppSelector(selectUser);
  const user = useAppSelector(state => selectUserById(state, id));
  const [userInfo, setUserInfo] = useState<userInterface | groupInterface | mainUserInterface>({} as userInterface | groupInterface | mainUserInterface);

  const isClickedHandler = () => {
    if (isClicked && myInfo?._id !== id) isClicked();
  };

  useEffect(() => {
    const final = (myInfo?._id === id ? myInfo : user) as userInterface | groupInterface | mainUserInterface;
    setUserInfo(final);
  }, [myInfo, user, id]);
  return (
    <article className="group w-full flex items-center gap-3 cursor-pointer">
      <figure className="w-10 h-10 rounded-full skeleton">
        <img src={userInfo?.profilePicture ? userInfo.profilePicture : userInfo?.isGroup ? placeholderImg2 : placeholderImg} alt="Group display" className="w-full h-full object-cover rounded-full" />
      </figure>
      <div className="flex-1 flex items-center justify-between py-3 border-b border-accentGray group-last:border-none" onClick={isClickedHandler}>
        <h2 className="flex-1 text-white text-base capitalize">{myInfo?._id === id ? "You" : userInfo?.userName}</h2>
        {!userInfo?.isGroup && admins?.includes(id) && <span className="text-secondaryGray text-xs font-medium">Admin</span>}
        <span className="text-accentGray text-xl"><FaAngleRight /></span>
      </div>
    </article>
  );
};

export default ProfileUserItem;