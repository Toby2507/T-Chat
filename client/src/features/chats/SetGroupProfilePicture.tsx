import { EntityId } from '@reduxjs/toolkit';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { ImSpinner9 } from 'react-icons/im';
import { RiFileEditFill } from 'react-icons/ri';
import User from '../../images/unknownGroup.png';
import { useRemovePPMutation, useSetPPMutation } from '../auth/authSlice';
import { useRemoveProfilePictureMutation, useSetProfilePictureMutation } from './groupChatSlice';
import { IoClose } from 'react-icons/io5';

const offscreen = 'absolute -left-[9999px]';
const onscreen = 'w-full bg-red-200 text-red-500 text-center rounded-md font-bold px-4 py-1';
interface setGPPInterface {
  userId: EntityId,
  currentImg: string | null,
  isGroup: boolean,
  setChangePP: React.Dispatch<React.SetStateAction<boolean>>;
}

const SetGroupProfilePicture = ({ userId, isGroup, currentImg, setChangePP }: setGPPInterface) => {
  const [setPP, { isLoading }] = useSetProfilePictureMutation();
  const [removePP, { isLoading: isLoading3 }] = useRemoveProfilePictureMutation();
  const [setPP2, { isLoading: isLoading2 }] = useSetPPMutation();
  const [removePP2, { isLoading: isLoading4 }] = useRemovePPMutation();
  const imgRef = useRef<HTMLImageElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const errRef = useRef<HTMLParagraphElement>(null);
  const [selectedImg, setSelectedImg] = useState<File | null>(null);
  const [errMsg, setErrMsg] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedImg) {
      try {
        const file = selectedImg as File;
        const formData = new FormData();
        formData.append('image', file);
        if (isGroup) {
          await setPP({ groupId: userId, formData }).unwrap();
        } else {
          await setPP2(formData).unwrap();
        }
        setSelectedImg(null); setErrMsg(""); setChangePP(false);
      } catch (err: any) {
        if (!err.status) {
          setErrMsg('No Server Response');
        } else if (err.data) {
          setErrMsg(err.data.message);
        } else {
          setErrMsg('Upload Failed');
          setSelectedImg(null);
        }
        errRef.current?.focus();
      }
    }
  };
  const handleRemove = async () => {
    if (currentImg) {
      if (isGroup) {
        await removePP(userId).unwrap();
      } else {
        await removePP2().unwrap();
      }
    }
  };
  const previewImg = (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    const file: File = (files as FileList)[0];
    setSelectedImg(file);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = function (e) {
      if (imgRef.current) { imgRef.current.src = reader.result as string; }
    };
  };

  useEffect(() => { setErrMsg(''); }, [selectedImg]);
  return (
    <div className="flex flex-col items-center gap-4">
      <p ref={errRef} className={errMsg ? onscreen : offscreen} aria-live='assertive'>{errMsg}</p>
      <div className='flex flex-col gap-6'>
        <form onSubmit={handleSubmit} className='w-full flex flex-col gap-6 items-center md:w-10/12 md:gap-6' encType='multipart/form-data'>
          <label htmlFor="profilePicture" className='relative w-56 h-56 rounded-full p-2 border-2 border-white'>
            <img ref={imgRef} className='w-full h-full rounded-full object-cover' src={currentImg || User} alt="profile" />
            <span className="absolute bg-white grid place-items-center bottom-2 right-2 w-8 h-8 rounded-full"><RiFileEditFill className='text-xl' /></span>
            <input ref={inputRef} className='hidden' type="file" name="profilePicture" id="profilePicture" onChange={previewImg} />
          </label>
          <p className="text-secondaryGray text-xs text-center font-medium tracking-wider">Please select a profile picture for your account.</p>
          <div className="flex flex-col gap-4 items-center justify-between w-full">
            <button type="button" className="flex items-center gap-2 text-accentGray font-medium text-sm tracking-wide" aria-label='remove profile picture' onClick={handleRemove}>
              {isLoading3 || isLoading4 ? <ImSpinner9 className='animate-spin' /> : <IoClose className='text-2xl text-accentGray' />}Remove Profile Picture
            </button>
            <button
              type="submit"
              className='bg-mainBlue py-2 px-20 grid place-items-center rounded-3xl text-sm text-white capitalize md:text-lg'
              aria-label='change profile picture'
            >{isLoading || isLoading2 ? <ImSpinner9 className='animate-spin' /> : "Change"}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SetGroupProfilePicture;