import { IoIosSend } from 'react-icons/io';
import { ImSpinner9 } from 'react-icons/im';
import { MdEmojiEmotions } from 'react-icons/md';
import { useState } from 'react';
import Picker, { EmojiClickData } from 'emoji-picker-react';

interface addChatInterface {
  handleSendMessage: (msg: string) => Promise<void>;
  isLoading: boolean;
}

const AddChat = ({ handleSendMessage, isLoading }: addChatInterface) => {
  const [msg, setMsg] = useState<string>('');
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);

  const selectEmoji = (emoji: EmojiClickData, e: MouseEvent) => {
    setMsg(msg => msg += emoji.emoji);
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (msg.trim()) {
      handleSendMessage(msg);
      setMsg(''); setShowEmojiPicker(false);
    }
  };
  const emojiProps = {
    onEmojiClick: selectEmoji,
    previewConfig: { showPreview: false },
    lazyLoadEmojis: true
  };

  return (
    <div className="px-4 py-3 flex gap-3 items-center bg-mainGray">
      <div className='relative emoji'>
        <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="w-10 h-10 rounded-full bg-accentGray grid place-items-center text-white text-2xl m-0"><MdEmojiEmotions /></button>
        {showEmojiPicker && <Picker {...emojiProps} />}
      </div>
      <form onSubmit={handleSubmit} className="flex-1 w-full flex gap-3 items-center">
        <input
          type="text"
          placeholder='Add a message..'
          value={msg}
          onChange={e => setMsg(e.target.value)}
          autoComplete='off'
          className='flex-1 h-10 rounded-3xl bg-accentGray px-4 py-1 text-white text-sm focus:outline-none placeholder:text-white'
        />
        <button type='submit' aria-label='send message' className="w-10 h-10 rounded-full bg-accentGray grid place-items-center text-white text-2xl">{isLoading ? <ImSpinner9 className='animate-spin' /> : <IoIosSend />}</button>
      </form>
    </div>
  );
};

export default AddChat;