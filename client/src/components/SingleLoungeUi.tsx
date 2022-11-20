import React from 'react';

interface uiInterface {
  imageUrl: string;
  name: string;
  lastMessage: string;
}

const SingleLoungeUi = ({ name, lastMessage, imageUrl }: uiInterface) => {
  return (
    <article className="flex items-center gap-3 pl-2">
      <div className="w-14 h-14 rounded-full bg-mainBlue grid place-items-center uppercase text-white text-xl">R</div>
      <div className="flex-1 flex flex-col pb-2 border-b border-accentGray">
        <h2 className="text-white text-xl capitalize">oluwatobi salau</h2>
        <p className="text-secondaryGray text-sm">Tobi: How far guy? how you dey?</p>
      </div>
    </article>
  );
};

export default SingleLoungeUi;