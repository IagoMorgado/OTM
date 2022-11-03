export function Info(){
    return(
        <p className='max-w-2xl text-xl text-[#f0eaea] bg-gradient-to-b from-blue-800 to-black font-medium mt-20 px-4 py-4 rounded-lg'>
        Esse sistema tem como principal funcionalidade ajudar no controle de estoque da franquia
        da Havaianas da região da Savassi
        <br/>
        <br/>
        Para utilizar o sistema basta selecionar o botão <strong> Otimizar!</strong>  que uma janela será aberta para que 
        o usuário fornece dados como o período que deseja projetar a otimização do estoque, se existe uma 
        expectativa de queda ou crescimento nas vendas em relção ao mesmo período anterior e qual a porcentagem
        desta expectativa. Por fim aoselecionar o botão <strong>Otimizar!</strong> uma janela do navegador abrirá e o resultado sera exibido em tela. 
      </p>    
    )
}