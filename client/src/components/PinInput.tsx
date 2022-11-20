import React, { useEffect, useRef, useState } from 'react';
import PinItem from './PinItem';

interface pinInputInterface {
  verifyCode: React.Dispatch<React.SetStateAction<string>>;
}
const initialPin = { 0: '', 1: '', 2: '', 3: '', 4: '', 5: '' };

const PinInput = ({ verifyCode }: pinInputInterface) => {
  const boxes = [0, 1, 2, 3, 4, 5];
  const [pin, setPin] = useState<object>(initialPin);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [activeBox, setActiveBox] = useState<number>(0);

  const changePin = (index: number, value: string) => { setPin({ ...pin, [index]: value }); };
  const changeBox = (dir: 'inc' | 'dec') => {
    if (activeBox < boxes.length && dir === 'inc') {
      setActiveBox(prev => prev + 1);
    } else if (activeBox > 0 && dir === 'dec') {
      setActiveBox(prev => prev - 1);
    } else {
      setActiveBox(prev => prev);
    }
  };
  const changeFocus = (key: number) => {
    switch (key) {
      case 8:
        changeBox('dec');
        break;
      case 37:
        changeBox('dec');
        break;
      case 39:
        changeBox('inc');
        break;
      default:
        changeBox('inc');
        break;
    }
  };
  const props = { inputRefs, changeFocus, setActiveBox, changePin };

  useEffect(() => {
    inputRefs.current[activeBox]?.focus();
    inputRefs.current[activeBox]?.select();
  }, [activeBox]);
  useEffect(() => {
    if (Object.values(pin).every(Boolean)) {
      verifyCode(Object.values(pin).join(''));
    }
  }, [pin, verifyCode]);

  return (
    <div className="flex items-center space-x-2">
      {boxes.map(box => (
        <PinItem key={box} index={box} {...props} />
      ))}
    </div>
  );
};

export default PinInput;