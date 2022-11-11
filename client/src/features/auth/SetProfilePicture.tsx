import React, { ChangeEvent, useRef, useState } from 'react';
import User from '../../images/unknownUser.png';
import { RiFileEditFill } from 'react-icons/ri';
import { ImSpinner9 } from "react-icons/im";
import { MdOutlineNavigateNext } from 'react-icons/md';
import { useSetPPMutation } from './authSlice';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../app/hooks';
import { setCredentials } from './userSlice';

const SetProfilePicture = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const imgRef = useRef<HTMLImageElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedImg, setSelectedImg] = useState<File | null>(null);
  const [setPP, { isLoading }] = useSetPPMutation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const file = selectedImg as File;
      const formData = new FormData();
      formData.append('image', file);
      const res = await setPP(formData).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate('/verify');
    } catch (err) {
      console.log(err);
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
  return (
    <div className='flex flex-col space-y-6'>
      <h1 className='text-white text-xl text-center font-semibold capitalize mb-4'>set profile picture</h1>
      <form onSubmit={handleSubmit} className='w-full flex flex-col space-y-6 items-center md:w-10/12 md:space-y-6' encType='multipart/form-data'>
        <label htmlFor="profilePicture" className='relative w-40 h-40 rounded-full p-2 border-2 border-white'>
          <img ref={imgRef} className='w-full h-full rounded-full object-cover' src={User} alt="profile" />
          <span className="absolute bg-white grid place-items-center bottom-2 right-2 w-8 h-8 rounded-full"><RiFileEditFill className='text-xl' /></span>
          <input ref={inputRef} className='hidden' type="file" name="profilePicture" id="profilePicture" onChange={previewImg} />
        </label>
        <p className="text-secondaryGray text-xs text-center font-medium tracking-wider">Please select a profile picture for your account.</p>
        <div className="flex flex-col space-y-6 items-center justify-between w-full">
          <button
            type="submit"
            className='bg-mainBlue py-3 w-48 grid place-items-center rounded-3xl text-sm text-white capitalize md:text-lg'
            aria-label='sign up'
          >{isLoading ? <ImSpinner9 className='animate-spin' /> : 'next'}</button>
          <button className="flex items-center space-x-4 text-secondaryGray" onClick={() => navigate('/verify')}>
            Skip
            <MdOutlineNavigateNext className='text-xl' />
          </button>
        </div>
      </form>
    </div>
  );
};

export default SetProfilePicture;