import Picker, { EmojiClickData } from 'emoji-picker-react';
import { useState } from 'react';
import { ImSpinner9 } from 'react-icons/im';
import { IoIosSend } from 'react-icons/io';
import { MdEmojiEmotions } from 'react-icons/md';
import { useSetChatInfoMutation } from '../features/settings/chatSettingSlice';
import PopUpMenu from './PopUpMenu';

interface addChatInterface {
  handleSendMessage: (msg: string) => Promise<void>;
  isLoading: boolean;
  isBlocked: boolean;
  userId: string;
}

const AddChat = ({ handleSendMessage, isLoading, isBlocked, userId }: addChatInterface) => {
  const [setChatInfo] = useSetChatInfoMutation();
  const [msg, setMsg] = useState<string>('');
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [showBlockNot, setShowBlockNot] = useState<boolean>(false);

  const selectEmoji = (emoji: EmojiClickData, e: MouseEvent) => {
    setMsg(msg => msg += emoji.emoji);
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isBlocked) {
      setShowBlockNot(true);
      return;
    } else if (msg.trim()) {
      handleSendMessage(msg);
      setMsg(''); setShowEmojiPicker(false);
    }
  };
  const emojiProps = {
    onEmojiClick: selectEmoji,
    previewConfig: { showPreview: false },
    lazyLoadEmojis: true
  };
  const unblockContact = () => {
    setChatInfo({ control: "blockedUsers", set: !isBlocked, userId });
    setShowBlockNot(false);
  };
  const popUpMenuProps = {
    title: "Unblock contact to send a message",
    options: [{ name: "Unblock", onClick: unblockContact }],
    close: () => setShowBlockNot(false)
  };
  return (
    <div className="relative px-4 py-3 flex gap-3 items-center bg-mainGray">
      <div className='relative emoji'>
        <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="w-10 h-10 rounded-full bg-accentGray grid place-items-center text-white text-2xl m-0"><MdEmojiEmotions /></button>
        {showEmojiPicker && <Picker {...emojiProps} />}
      </div>
      {showBlockNot && (
        <div className="absolute -top-36 mx-auto right-0 left-0 w-max">
          <PopUpMenu {...popUpMenuProps} />
        </div>
      )}
      <form onSubmit={handleSubmit} className="relative flex-1 w-full flex gap-3 items-center">
        <input
          type="text"
          placeholder='Add a message..'
          value={msg}
          onChange={e => setMsg(e.target.value)}
          onFocus={() => setShowEmojiPicker(false)}
          autoComplete='off'
          className='flex-1 h-10 rounded-3xl bg-accentGray px-4 py-1 text-white text-sm focus:outline-none placeholder:text-secondaryGray'
        />
        <button type='submit' aria-label='send message' className="w-10 h-10 rounded-full bg-accentGray grid place-items-center text-white text-2xl">{isLoading ? <ImSpinner9 className='animate-spin' /> : <IoIosSend />}</button>
      </form>
    </div>
  );
};

export default AddChat;