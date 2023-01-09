import { EntityId } from '@reduxjs/toolkit';
import { useEffect, useRef } from 'react';
import { useAppSelector } from '../../app/hooks';
import SingleGroupItem from '../../components/SingleGroupItem';
import { userInterface } from '../../utilities/interfaces';
import { selectUserEntities } from '../auth/authSlice';
import { ImSpinner9 } from 'react-icons/im';

interface infoInterface {
  selected: EntityId[];
  name: string;
  description: string;
  isLoading: boolean;
  create: () => void;
  back: () => void;
  chooseUser: (id: EntityId) => void;
  setName: React.Dispatch<React.SetStateAction<string>>;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
}

const CreateGroupInfo = ({ selected, name, description, isLoading, back, chooseUser, setName, create, setDescription }: infoInterface) => {
  const users = Object.values(useAppSelector(selectUserEntities)).map(user => user as userInterface).filter(user => !user.isGroup);
  const inputRef = useRef<HTMLInputElement>(null);
  const handleCreate = () => { if (name.trim().length > 2) create(); };

  useEffect(() => { inputRef.current?.focus(); }, []);
  return (
    <>
      <div className="relative w-full flex items-center justify-between mb-8">
        <button className="text-accentPurple text-base tracking-wide" onClick={back}>Back</button>
        <h1 className="flex-1 text-white text-lg text-center capitalize font-medium">new group</h1>
        <button className={`${name.trim().length > 2 ? "text-accentPurple" : "text-accentGray"} grid place-items-center text-base tracking-wide`} onClick={handleCreate}>{isLoading ? <ImSpinner9 className='animate-spin' /> : "Create"}</button>
      </div>
      <div className='w-full flex flex-col gap-10'>
        <form onSubmit={e => { e.preventDefault(); handleCreate(); }} className='w-full flex flex-col gap-6 items-center'>
          <input
            type="text"
            placeholder="Group Name"
            ref={inputRef}
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full bg-black p-2 border-b border-accentGray text-white text-sm caret-accentPurple focus:outline-none placeholder:text-secondaryGray"
          />
          <input
            type="text"
            placeholder="Group Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full bg-black p-2 border-b border-accentGray text-white text-sm caret-accentPurple focus:outline-none placeholder:text-secondaryGray"
          />
        </form>
        <section className="w-full flex flex-col justify-center gap-2">
          <h2 className="text-white text-base font-medium uppercase">{`participants: ${selected.length} of ${users.length}`}</h2>
          <div className="self-start w-full flex items-center gap-4 mb-2 pb-3 overflow-x-auto">
            {selected.map(id => {
              const user = users.find(user => user._id === id);
              return (<SingleGroupItem key={id} user={user as userInterface} selectUser={chooseUser} />);
            })}
          </div>
        </section>
      </div>
    </>
  );
};

export default CreateGroupInfo;