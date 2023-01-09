import { IoIosClose } from "react-icons/io";
import { userInterface } from "../utilities/interfaces";
import { EntityId } from "@reduxjs/toolkit";
import placeholderImg from "../images/unknownUser.png";

interface itemInterface {
  user: userInterface;
  selectUser: (id: EntityId) => void;
}

const SingleGroupItem = ({ user, selectUser }: itemInterface) => {
  return (
    <div className="max-w-20 pt-2 flex flex-col items-center gap-1">
      <figure className="relative w-16 h-16 shrink-0 rounded-full skeleton">
        <button
          className="absolute -top-1 -right-1 w-5 h-5 grid place-items-center rounded-full bg-secondaryGray text-lg text-black"
          onClick={() => selectUser(user?._id as EntityId)}
          aria-label="Unselect User"
        ><IoIosClose /></button>
        <img src={user?.profilePicture ? user.profilePicture : placeholderImg} alt="" className="w-full h-full object-cover rounded-full" />
      </figure>
      <p className="text-white text-xs capitalize truncate">{user?.userName}</p>
    </div>
  );
};

export default SingleGroupItem;