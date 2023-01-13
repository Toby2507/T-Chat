import { EntityId } from '@reduxjs/toolkit';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import SingleGroupItem from '../../components/SingleGroupItem';
import SingleSelectUserUI from '../../components/SingleSelectUserUI';
import { userInterface } from '../../utilities/interfaces';
import { selectUserEntities } from '../auth/authSlice';

interface participantInterface {
  selected: EntityId[];
  chooseUser: (id: EntityId) => void;
  next: () => void;
}

const SelectParticipants = ({ selected, chooseUser, next }: participantInterface) => {
  const users = Object.values(useAppSelector(selectUserEntities)).map(user => user as userInterface).filter(user => !user.isGroup);
  const goNext = () => { if (selected.length > 0) next(); };

  return (
    <>
      <div className="relative w-full flex items-center justify-between mb-4">
        <button className="text-accentPurple text-base tracking-wide"><Link to="/chat">Cancel</Link></button>
        <div className="flex-1 flex flex-col items-center gap-1">
          <h1 className="text-white text-lg capitalize font-medium">add participants</h1>
          <p className="text-white text-xs">{`${selected.length} / ${users.length}`}</p>
        </div>
        <button className={`${selected.length > 0 ? "text-accentPurple" : "text-secondaryGray"} text-base tracking-wide`} onClick={goNext}>Next</button>
      </div>
      {/* SELECTED USERS LIST */}
      <div className="self-start w-full flex items-center gap-4 mb-2 pb-3 overflow-x-auto">
        {selected.map(id => {
          const user = users.find(user => user._id === id);
          return (<SingleGroupItem key={id} user={user as userInterface} selectUser={chooseUser} />);
        })}
      </div>
      {/* SELECT USERS UI */}
      <div className="w-full flex flex-col items-center gap-2 overflow-y-auto">
        <div className="w-full flex flex-col py-2 border-t-2 border-accentGray">
          {users.map(user => (<SingleSelectUserUI key={user._id} user={user} selected={selected} chooseUser={chooseUser} />))}
        </div>
      </div>
    </>
  );
};

export default SelectParticipants;