interface popUpMenuInterface {
  title: string;
  options: { name: string, altName?: string, setAlt?: boolean, onClick: () => void; }[];
  close: () => void;
}

const PopUpMenu = ({ title, options, close }: popUpMenuInterface) => {
  return (
    <div className="w-80 flex flex-col justify-center gap-1">
      <div className="flex flex-col items-center bg-mainGray rounded-xl">
        <h2 className="w-full py-2 border-b border-accentGray text-secondaryGray text-xs font-medium text-center">{title}</h2>
        {options.map((option, i) => (
          <button key={i} className="w-full py-3 text-accentPurple text-base font-medium text-center" onClick={option.onClick}>{option.setAlt ? option.altName : option.name}</button>
        ))}
      </div>
      <button className="w-full bg-mainGray rounded-xl py-2 text-accentPurple text-base font-medium text-center" onClick={close}>Cancel</button>
    </div>
  );
};

export default PopUpMenu;