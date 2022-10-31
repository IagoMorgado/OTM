import * as Dialog from '@radix-ui/react-dialog'
import * as ToggleGroup from '@radix-ui/react-toggle-group'

export function Modal(){
    function sendData(){
        console.log("sent")
    }
    return(
        <Dialog.Portal>
            <Dialog.Overlay className='bg-black/60 inset-0 fixed'/>
            <Dialog.Content className='fixed bg-[#0a1044] py-8 px-8 text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-sm  shadow-[#c2bed8]'>
                <Dialog.Title className='text-3xl font-black'>Precisamos de alguns dados:</Dialog.Title>
                <form onSubmit={sendData} className='mt-8 flex flex-col gap-4'>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor="days">Quantos dias de planejamento?</label>
                        <input placeholder='15 dias' type='number' className='text-sm bg-black rounded-sm h-8 w-1/2 px-1'></input>
                    </div>
                    <div className='flex gap-6'>
                        <div className='flex flex-col gap-2'>
                            <label htmlFor='expectativa'>Qual a espectativa para as vendas?</label>
                            <ToggleGroup.Root type='single' className='grid grid-cols-2'>
                                <ToggleGroup.Item value='' title='Crescimento' className='w-16 h-8 rounded-full bg-black'>+</ToggleGroup.Item>
                                <ToggleGroup.Item value='' title='Queda' className='w-16 h-8 rounded-full bg-black'>-</ToggleGroup.Item>
                            </ToggleGroup.Root>
                        </div>
                        <div className='flex flex-col gap-2'>
                            <label htmlFor="days">De quanto?</label>
                            <input placeholder='10%' type='number' className='text-sm bg-black rounded-sm h-8 px-1'></input>
                        </div>
                    </div>

                    <footer className='mt-4 flex justify-center gap-4'>
                        <Dialog.Close className='bg-black px-5 h-12 rounded-md font-semibold hover:bg-blue-400'>Cancelar</Dialog.Close>
                        <button type='submit' className='bg-blue-500 hover:bg-blue-800 rounded font-bold flex items-center px-5 py-2'>Otimizar!</button>
                    </footer>
                </form>
            </Dialog.Content>
        </Dialog.Portal>
       
    )
}