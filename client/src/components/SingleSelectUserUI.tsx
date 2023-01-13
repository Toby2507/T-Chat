import { EntityId } from '@reduxjs/toolkit';
import { BsCheckLg } from 'react-icons/bs';
import placeholderImg from '../images/unknownUser.png';
import { userInterface } from '../utilities/interfaces';

interface singleSelectUserUIInterface {
  user: userInterface;
  selected: EntityId[];
  chooseUser: (id: EntityId) => void;
}

const SingleSelectUserUI = ({ user, selected, chooseUser }: singleSelectUserUIInterface) => {
  return (
    <article className="group relative flex items-center gap-3 pl-2 py-1 cursor-pointer">
      <figure className="w-12 h-12 rounded-full skeleton">
        <img src={user?.profilePicture ? user.profilePicture : placeholderImg} alt="" className="w-full h-full object-cover rounded-full" />
      </figure>
      <div className="flex-1 w-9/12 flex items-center justify-between pt-2 pb-3 border-b border-accentGray group-last:border-none">
        <h2 className="flex-1 text-white text-lg capitalize">{user?.userName}</h2>
        <label className="relative w-6 h-6 grid place-items-center rounded-full bg-black border border-accentGray">
          <div className={`${selected.includes(user._id) ? "" : "hidden"} absolute w-full h-full grid place-items-center bg-accentPurple text-black text-sm rounded-full`}>
            <BsCheckLg />
          </div>
          <input
            type="checkbox"
            checked={selected.includes(user._id)}
            onChange={() => chooseUser(user._id)}
            id="addUser"
            aria-label="Select User"
            className='hidden' />
        </label>
      </div>
    </article>
  );
};

export default SingleSelectUserUI;