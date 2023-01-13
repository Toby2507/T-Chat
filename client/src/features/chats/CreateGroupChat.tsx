import { EntityId } from '@reduxjs/toolkit';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import { selectUser } from '../api/globalSlice';
import { useGetUsersQuery } from '../auth/authSlice';
import CreateGroupInfo from './CreateGroupInfo';
import SelectParticipants from './SelectParticipants';
import { useCreateGroupChatMutation } from './groupChatSlice';

type GroupInterface = "initial" | "final";

const CreateGroupChat = () => {
  useGetUsersQuery();
  const { userId } = useParams();
  const navigate = useNavigate();
  const myId = useAppSelector(selectUser)?._id;
  const [createGroupChat, { isLoading }] = useCreateGroupChatMutation();
  const errRef = useRef<HTMLParagraphElement>(null);
  const [stage, setStage] = useState<GroupInterface>("initial");
  const [selected, setSelected] = useState<EntityId[]>(userId ? [userId as EntityId] : []);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [errMsg, setErrMsg] = useState<string>("");

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
      await createGroupChat({ name, description, members: [...selected, myId] as string[] }).unwrap();
      setName(""); setDescription(""); setSelected([]); setStage("initial");
      navigate('/chat', { replace: true });
    } catch (err: any) {
      if (!err?.status) {
        setErrMsg('No Server Response');
      } else if (err.status === 409) {
        setErrMsg('Group Already Exists');
      } else {
        setErrMsg('Group Creation Failed');
        setName(""); setDescription(""); setSelected([]); setStage("initial");
      }
      errRef.current?.focus();
    }
  };
  const participantProps = { selected, chooseUser, next };
  const infoProps = { name, description, isLoading, errMsg, errRef, back, chooseUser, setName, setDescription, create, selected };

  useEffect(() => { selected.length < 1 && setStage("initial"); }, [selected]);
  useEffect(() => { setErrMsg(""); }, [name, description, selected]);
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