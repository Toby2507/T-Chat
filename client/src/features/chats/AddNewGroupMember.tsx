import { EntityId } from '@reduxjs/toolkit';
import { useState } from 'react';
import { ImSpinner9 } from 'react-icons/im';
import { IoClose } from 'react-icons/io5';
import { useAppSelector } from '../../app/hooks';
import SingleGroupItem from '../../components/SingleGroupItem';
import SingleSelectUserUI from '../../components/SingleSelectUserUI';
import { userInterface } from '../../utilities/interfaces';
import { selectUserEntities } from '../auth/authSlice';
import { useAddGroupMemberMutation } from './groupChatSlice';

interface participantInterface {
  groupId: EntityId;
  members: EntityId[];
  close: () => void;
}

const AddNewGroupMember = ({ groupId, members, close }: participantInterface) => {
  const [addMember, { isLoading }] = useAddGroupMemberMutation();
  const users = Object.values(useAppSelector(selectUserEntities)).map(user => user as userInterface).filter(user => !user.isGroup).filter(user => !members.includes(user._id));
  const [selected, setSelected] = useState<EntityId[]>([]);
  const chooseUser = (id: EntityId) => {
    if (selected.includes(id)) {
      setSelected(selected.filter(userId => userId !== id));
    } else {
      setSelected([...selected, id]);
    }
  };
  const handleAdd = async () => {
    if (selected.length > 0) {
      await addMember({ groupId, members: selected }).unwrap();
      close();
    }
  };

  return (
    <>
      <div className="relative w-full flex items-center justify-between gap-4">
        <button className="text-secondaryGray text-2xl" onClick={close}><IoClose /></button>
        <h3 className="flex-1 text-white text-base capitalize font-medium">{`${selected.length} participants added`}</h3>
        <button className={`${selected.length > 0 ? "text-accentPurple" : "text-secondaryGray"} grid place-items-center text-base tracking-wide`} onClick={handleAdd}>{isLoading ? <ImSpinner9 className='animate-spin' /> : "Add"}</button>
      </div>
      {/* SELECTED USERS LIST */}
      <div className="self-start w-full flex items-center gap-4 overflow-x-auto">
        {selected.map(id => {
          const user = users.find(user => user._id === id);
          return (<SingleGroupItem key={id} user={user as userInterface} selectUser={chooseUser} />);
        })}
      </div>
      {/* SELECT USERS UI */}
      <div className="w-full max-h-80 flex flex-col pr-2 py-1 border border-accentGray rounded-lg overflow-y-auto">
        {users.map(user => (<SingleSelectUserUI key={user._id} user={user} selected={selected} chooseUser={chooseUser} />))}
      </div>
    </>
  );
};

export default AddNewGroupMember;