const Article = () => {
  const percentage = () => Math.floor(Math.random() * 2);
  return (
    <>
      {(percentage() === 0) ? (
        <article className="w-[60%] h-10 skeleton px-4 py-2 rounded-3xl last-of-type:rounded-br-none"></article>
      ) : (
        <article className="w-[50%] h-10 skeleton px-4 py-2 rounded-3xl last-of-type:rounded-br-none"></article>
      )}
    </>
  );
};

const Builder = () => {
  return (
    <>
      <div className="self-end w-full flex flex-col items-end space-y-2">
        {[...Array(Math.ceil(Math.random() * 2))].map((_, i) => (<Article key={i} />))}
        <p className="w-[20%] h-3 skeleton rounded-md"></p>
      </div>
      <div className="w-full self-start flex flex-col space-y-2">
        {[...Array(Math.ceil(Math.random() * 2))].map((_, i) => (<Article key={i} />))}
        <p className="w-[20%] h-3 skeleton rounded-md"></p>
      </div>
    </>
  );
};

const MessageLoader = () => {
  const multiply = [...'multiplication'.split('')];
  return (
    <div className="w-full flex flex-col space-y-2 overflow-hidden">
      {multiply.map((_, index) => (
        <Builder key={index} />
      ))}
    </div>
  );
};

export default MessageLoader;