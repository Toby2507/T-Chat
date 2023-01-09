import { useEffect, useState } from 'react';
import { useGetUsersQuery } from '../auth/authSlice';
import SelectParticipants from './SelectParticipants';
import { EntityId } from '@reduxjs/toolkit';
import CreateGroupInfo from './CreateGroupInfo';
import { useCreateGroupChatMutation } from './groupChatSlice';
import { useAppSelector } from '../../app/hooks';
import { selectUser } from '../api/globalSlice';
import { useNavigate } from 'react-router-dom';

type GroupInterface = "initial" | "final";

const CreateGroupChat = () => {
  useGetUsersQuery();
  const navigate = useNavigate();
  const myId = useAppSelector(selectUser)?._id;
  const [createGroupChat, { isLoading }] = useCreateGroupChatMutation();
  const [stage, setStage] = useState<GroupInterface>("initial");
  const [selected, setSelected] = useState<EntityId[]>([]);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const next = () => setStage("final");
  const back = () => setStage("initial");
  const chooseUser = (id: EntityId) => {
    if (selected.includes(id)) {
      setSelected(selected.filter(userId => userId !== id));
    } else {
      setSelected([...selected, id]);
    }
  };
  const create = async () => {
    try {
      await createGroupChat({ name, description, members: [...selected, myId] as string[] });
      setName(""); setDescription(""); setSelected([]); setStage("initial");
      navigate('/chat', { replace: true });
    } catch (err: any) { console.log(err); }
  };
  const participantProps = { selected, chooseUser, next };
  const infoProps = { name, description, isLoading, back, chooseUser, setName, setDescription, create, selected };

  useEffect(() => { selected.length < 1 && setStage("initial"); }, [selected]);
  return (
    <section className="w-full h-screen px-4 py-6 flex flex-col items-center transition-all duration-300">
      {stage === "initial" ? (
        <SelectParticipants {...participantProps} />
      ) : (
        <CreateGroupInfo {...infoProps} />
      )}
    </section>
  );
};

export default CreateGroupChat;