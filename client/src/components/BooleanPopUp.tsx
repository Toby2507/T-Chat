import React from 'react';
import { ImSpinner9 } from 'react-icons/im';

interface BooleanPopUpInterface {
  loading: boolean;
  deleteAction: () => void;
  setShowPopUp: React.Dispatch<React.SetStateAction<boolean>>;
}

const BooleanPopUp = ({ loading, setShowPopUp, deleteAction }: BooleanPopUpInterface) => {
  return (
    <>
      <div className="absolute top-0 left-0 right-0 bottom-0 w-80 h-max m-auto p-4 rounded-lg bg-mainGray z-20 grid place-items-center gap-2">
        <h3 className="text-white/70 text-sm text-center font-medium tracking-widest">Are you sure you want to delete your account?</h3>
        <div className="w-full flex items-center gap-4">
          <button className="w-full py-2 rounded-lg bg-accentGray text-center font-medium text-white/70 text-lg" onClick={() => setShowPopUp(false)}>No</button>
          <button className="w-full grid place-items-center py-2 rounded-lg bg-red-500 text-center font-medium text-white/70 text-lg" onClick={deleteAction}>{loading ? <ImSpinner9 className='animate-spin' /> : "Yes"}</button>
        </div>
      </div>
      <div className="absolute top-0 left-0 w-full h-full z-10 bg-black/70"></div>
    </>
  );
};

export default BooleanPopUp;