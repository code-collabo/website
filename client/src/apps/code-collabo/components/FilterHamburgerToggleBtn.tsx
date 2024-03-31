import React from 'react';
import useScreenDimensions from '../hooks/useScreenDimensions';
import Image from 'next/image';

export default function FilterHamburgerToggleBtnComponent({ toggleFilter, isCloseBtn }: { toggleFilter?: () => void; isCloseBtn?: boolean; }) {
  const  { isDesktop }  = useScreenDimensions();
  
  // Remove from DOM if on desktop
  if (isDesktop) return null;

  // We want to keep the "open" harmburger button in the DOM always, to keep the shape of the page whether sidebar is open or not
  // The "isCloseBtn" prop/style for singling out close button helps achieve this
  if (isCloseBtn) {
    return (
      <button className='app__menubar__toggle__close lib__position-toggle-left' onClick={toggleFilter}>
        {'<'}
      </button>
    );
  }

  return (
    <button className='app__mobile-menu-btns' onClick={toggleFilter}>
      <Image src='/code-collabo/menu.png' alt='hamburger-icon' width={25} height={25}/>
    </button>
  );
}