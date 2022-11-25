const Builder = () => {
  return (
    <article className="flex items-center gap-3 pl-2 cursor-pointer">
      <div className="w-14 h-14 rounded-full skeleton"></div>
      <div className="flex-1 flex flex-col space-y-1 pb-2 border-b border-accentGray">
        <span>
          <p className="skeleton w-[60%] h-2 mb-[2px] rounded-md"></p>
          <p className="skeleton w-[60%] h-2 mb-[2px] rounded-md"></p>
        </span>
        <span>
          <p className="skeleton w-full h-2 mb-[2px] rounded-md"></p>
          <p className="skeleton w-full h-2 mb-[2px] rounded-md"></p>
        </span>
      </div>
    </article>
  );
};

const LoungeLoader = () => {
  const multiply = [...'multiplication'.split('')];
  return (
    <div className="w-full flex flex-col gap-2 py-2 border-t-2 border-accentGray overflow-hidden">
      {multiply.map((_, index) => (
        <Builder key={index} />
      ))}
    </div>
  );
};

export default LoungeLoader;