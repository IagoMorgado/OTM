import './styles/main.css';
import LogoHavaianas from './assets/LogoHavaianas.svg'
import { useState } from 'react';
import { Info } from './components/Info';
import { Modal } from './components/Modal';
import * as Dialog from '@radix-ui/react-dialog'

function App() {
  const [TextHidden, setTextHidden] = useState(true)

  const showText=()=> setTextHidden(!TextHidden);

  return (
    <div className="max-w-[#1344px] items-center mx-auto flex flex-col ">
      <img src='/LogoHavaianas.png' className='h-[220px]'/>
      <h1 className='text-6xl text-[#f30000] font-black mt-2'>Sistema de otimização de estoque</h1>
      <div className='grid grid-cols-2 gap-3 mt-10'>
        <button 
          className='bg-blue-500 hover:bg-blue-800 rounded text-white text-center font-bold px-5 py-2' 
          onClick={showText}
        >
          {TextHidden ? '-Info':'+Info'}
        </button>
        
        <Dialog.Root>
          <Dialog.Trigger className='bg-blue-500 hover:bg-blue-800 rounded text-white text-center font-bold px-5 py-2'>
            Otimizar!
          </Dialog.Trigger>
          <Modal/>
        </Dialog.Root>

      </div>

      {TextHidden ? <Info/> : null}

    </div>
  )
}

export default App
