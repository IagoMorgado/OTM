import * as Dialog from '@radix-ui/react-dialog'
import * as ToggleGroup from '@radix-ui/react-toggle-group'
import axios from 'axios'
import { useEffect, useState, FormEvent } from 'react'

interface Otm{
    time:number
    interacoes:number
    lucro:number
    produtos:string[]
    variaveis:number[]
}

export function Modal(){
    const[expectation,setExpectation]=useState<string>()
    const[result,setResult]=useState<Otm>()

    async function sendData(event: FormEvent){
        event.preventDefault();
        let alfa
        const formData = new FormData(event.target as HTMLFormElement)
        const data = Object.fromEntries(formData)
        if(expectation!=undefined){
            expectation==1 ? alfa=1+(data.percentage/100):alfa=1-(data.percentage/100)
        }
        await axios.get(`http://127.0.0.1:5000/havaiana-otimizacao?dias=${data.days}&espectativa=${alfa}`).then(function(response){
            setResult(response.data)
        })
        console.log(result)
    }
    return(
        <Dialog.Portal>
            <Dialog.Overlay className='bg-black/60 inset-0 fixed'/>
            <Dialog.Content className='fixed bg-[#0a1044] py-8 px-8 text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-sm  shadow-[#c2bed8]'>
                <Dialog.Title className='text-3xl font-black'>Precisamos de alguns dados:</Dialog.Title>

                <form onSubmit={sendData} className='mt-8 flex flex-col gap-4'>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor="days">Quantos dias de planejamento?</label>
                        <input name="days"placeholder='15 dias' type='number' className='text-sm bg-black rounded-sm h-8 w-1/2 px-1'></input>
                    </div>
                    <div className='flex gap-6'>
                        <div className='flex flex-col gap-2'>
                            <label htmlFor='expectation'>Qual a espectativa para as vendas?</label>
                            <ToggleGroup.Root type='single' className='grid grid-cols-2' value={expectation}onValueChange={setExpectation}>
                                <ToggleGroup.Item value='1' title='Crescimento' className='w-16 h-8 rounded-full bg-black'>+</ToggleGroup.Item>
                                <ToggleGroup.Item value='0' title='Queda' className='w-16 h-8 rounded-full bg-black'>-</ToggleGroup.Item>
                            </ToggleGroup.Root>
                        </div>
                        <div className='flex flex-col gap-2'>
                            <label htmlFor="percentage">De quanto?</label>
                            <input name="percentage"placeholder='10%' type='number' className='text-sm bg-black rounded-sm h-8 px-1'></input>
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