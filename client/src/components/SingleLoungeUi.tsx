import { EntityId } from '@reduxjs/toolkit';
import { useAppSelector } from '../app/hooks';
import { selectUserById } from '../features/auth/authSlice';
import placeholderImg from '../images/unknownUser.png';

interface uiInterface {
  userId: EntityId;
}

const SingleLoungeUi = ({ userId }: uiInterface) => {
  const userInfo = useAppSelector(state => selectUserById(state, userId));

  return (
    <article className="flex items-center gap-3 pl-2 cursor-pointer">
      <figure className="w-14 h-14 rounded-full">
        <img src={userInfo?.profilePicture ? userInfo.profilePicture : placeholderImg} alt="" className="w-full h-full object-cover rounded-full" />
      </figure>
      <div className="flex-1 flex flex-col pb-2 border-b border-accentGray">
        <h2 className="text-white text-xl capitalize">{userInfo?.userName}</h2>
        <p className="text-secondaryGray text-sm">Tobi: How far guy? how you dey?</p>
      </div>
    </article>
  );
};

export default SingleLoungeUi;