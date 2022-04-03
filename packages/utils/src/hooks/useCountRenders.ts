/**
 * useCountRenders
 * Counts the amount of times the component renders.
 * Logs are displayed in the console.
 */

import { useRef } from 'react';

const useCountRenders = (name: string): void => {
  const renders = useRef(0);
  let _current = renders.current;
  _current += 1;
  renders.current = _current;
  // eslint-disable-next-line no-undef
  if (__DEV__) {
    let style;
    switch (true) {
      case _current >= 10:
        style = 'background: black ; color: #FFFF00; font-size:13px';
        break;
      case _current >= 20:
        style = 'background: black ; color: red; font-size:13px';
        break;
      default:
        style = 'background: black ; color: green; font-size:13px';
        break;
    }
    console.log(`%c${name} renders: %c${_current}`, style, style);
  }
};

export default useCountRenders;
