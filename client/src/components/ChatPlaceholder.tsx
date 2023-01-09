import placeholderImage from '../images/welcomeplaceholder.png';

const ChatPlaceholder = () => {
  return (
    <section className="w-full h-full flex flex-col items-center justify-center gap-4 px-4 border-l border-mainGray">
      <figure className="w-full grid place-items-center">
        <img src={placeholderImage} className="w-1/2" alt="welcome to tchat...start a chat" />
      </figure>
      <p className="text-secondaryGray text-sm text-center">Send and recieve messages anywhere at anytime</p>
    </section>
  );
};

export default ChatPlaceholder;