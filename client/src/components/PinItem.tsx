import React from 'react';

interface pinItemInterface {
  index: number;
  inputRefs: React.MutableRefObject<(HTMLInputElement | null)[]>;
  changeFocus: (key: number) => void;
  setActiveBox: React.Dispatch<React.SetStateAction<number>>;
  changePin: (index: number, value: string) => void;
}

const PinItem = ({ index, inputRefs, changeFocus, setActiveBox, changePin }: pinItemInterface) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.match(/[^\d]/)) {
      e.target.value = '';
      return;
    }
    changePin(index, e.target.value);
    changeFocus(0);
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === 39 || e.keyCode === 37 || e.keyCode === 8) {
      e.preventDefault();
      e.stopPropagation();
      changeFocus(e.keyCode);
    }
  };
  return (
    <input
      type="text"
      maxLength={1}
      ref={ref => !inputRefs.current.includes(ref) && inputRefs.current.push(ref)}
      onChange={handleChange}
      onKeyUp={handleKeyDown}
      onFocus={() => setActiveBox(index)}
      autoComplete="off"
      className="w-12 h-12 rounded-xl bg-transparent border-2 border-accentPurple caret-accentBlue text-accentPurple text-2xl text-center focus:text-accentBlue focus:border-accentBlue focus:outline-none"
    />
  );
};

export default PinItem;