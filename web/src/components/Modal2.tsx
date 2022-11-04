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

export function Modal2(){
    const[expectation,setExpectation]=useState<string>()
    const[result,setResult]=useState<Otm>()


    async function sendData(event: FormEvent){
        event.preventDefault();
        let alfa
        const formData = new FormData(event.target as HTMLFormElement)
        const form_data = Object.fromEntries(formData)
        console.log(form_data)
        if(expectation!=undefined){
            expectation=="1" ? alfa=1+(form_data.percentage/100) : alfa=1-(form_data.percentage/100)
        }
        await axios.get(`http://127.0.0.1:5000/havaiana-otimizacao?dias=${form_data.days}&espectativa=${alfa}`).then(function(response){
            setResult(response.data.data)
            
        })
    }
    function showresult(){
        const count=result?.variaveis.length
        let show=[]
        for(let i=0;i<count;i++){
            show.push(<li>{result?.produtos[i]} = {result?.variaveis[i]} unidades</li>)
        }
        return show
    }
    return(
                <div className='bg-[#0a1044] py-8 px-8 text-white items-center my-20 rounded-lg shadow-md  shadow-[#202024]'>
                    <h1 className='text-3xl font-black'>Precisamos de alguns dados:</h1>

                    <form onSubmit={sendData} className='mt-8 flex flex-col gap-4'>
                        <div className='flex flex-col gap-2'>
                            <label htmlFor="days">Quantos dias de planejamento?</label>
                            <input name="days"placeholder='15 dias' type='number' className='text-sm bg-black rounded-sm h-8 w-1/2 px-1'></input>
                        </div>

                        <div className='flex gap-6'>
                            <div className='flex flex-col gap-2'>
                                <label htmlFor='expectation'>Qual a espectativa para as vendas?</label>
                                <ToggleGroup.Root type='single' className='grid grid-cols-2' value={expectation}onValueChange={setExpectation}>
                                    <ToggleGroup.Item value='1' title='Crescimento' className={`h-8 rounded-full ${expectation!="1"? 'bg-black':'bg-blue-400'}`}>Crescimento</ToggleGroup.Item>
                                    <ToggleGroup.Item value='0' title='Queda' className={`h-8 rounded-full ${expectation!="0"? 'bg-black':'bg-blue-400'}`}>Queda</ToggleGroup.Item>
                                </ToggleGroup.Root>
                            </div>
                            <div className='flex flex-col gap-2'>
                                <label htmlFor="percentage">De quanto?</label>
                                <input name="percentage" placeholder='10%' type='number' className='text-sm bg-black rounded-sm h-8 px-1'></input>
                            </div>
                        </div>

                        <footer className='mt-4 flex justify-center gap-4'>
                            <button type='submit' className='bg-blue-500 hover:bg-blue-800 rounded font-bold flex items-center px-5 py-2'>Otimizar!</button>
                        </footer>
                    </form>

                    <div className='bg-blue-400 mt-10 font-bold px-5 py-5 rounded-lg shadow-md  shadow-[#c5c5db]'>
                        <ul>
                            <h1 className='text-2xl mb-2'>Resultado:</h1>
                            {showresult()}
                        </ul>
                    </div>
                </div>
       
    )
}