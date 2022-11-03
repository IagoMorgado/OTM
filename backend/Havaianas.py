from asyncio.windows_events import INFINITE
from ortools.linear_solver import pywraplp
from flask import Flask
from flask_cors import CORS
from flask_restful import Resource, Api, request
from locale import atof
import pandas as pd

app = Flask(__name__)
CORS(app)
api = Api(app)

class Havaianas(Resource):
    def get(self):
        # get query Params
        args = request.args
        
        modelResult = havainasModel(int(args['dias']), float(args['espectativa']))
        # rodar o modelo
        return {'data': modelResult}, 200
    pass

api.add_resource(Havaianas, '/havaiana-otimizacao')

def load_data(data, dias):
    # jeito de ler a tabela de vendas
    data_produto = pd.read_csv('produto_infos.csv')
    data_produto = data_produto.to_dict()
    data_historico = pd.read_csv('qtd.csv')
    
    n = len(data_produto['Produto'])
    data['N'] = {} # Setando vetor de produtos
    data['Pr'] = {} # Setando vetor de preços dos produtos
    data['C'] = {} # Setando vetor de custo de reposicao
    data['E'] = {} # Setar numero atual de unidades guardadas
    data['V'] = [0] * n # Inicializar Volume de vendas anterior de cada produto
    
    
    # for para pegar as informações do produto
    for i in range(n):
        data['N'][i] = data_produto['Produto'][i]
        data['Pr'][i] = float(data_produto['Preco_venda'][i])
        data['C'][i] = float(data_produto['Custo_reposicao'][i])
        data['E'][i] = data_produto['Qtd_estoque'][i]
        
    # for para pegar o historico de venda de cada produto em uma quantidade x dias
    for i in range(n):
        produto = data['N'][i]
        for j in range(dias):
            data['V'][i] += data_historico[produto][j]
    
def create_data_model(dias):
    data = {}
    load_data(data, dias)
    
    return data
    
def havainasModel(dias, alfa):
    # Create a solver usando SCIP
    solver = pywraplp.Solver('Maximize lucro da loja de havainas', pywraplp.Solver.SCIP_MIXED_INTEGER_PROGRAMMING)
    data = create_data_model(dias)
    
    #variables
    infinity = solver.infinity()
    x = {}
    P = {}
    n = len(data['N'])
    
    ## unidades do produto i compradas (x)
    for i in range(n):
        x[i] = solver.IntVar(0, infinity, 'x[%i]' % i)
    print('Number of variables =', solver.NumVariables())
    ## potencial de vendas do produto i (P)
    for i in range(n):
        P[i] = data['V'][i]/dias*alfa
    
    # constraints
    ## Vendas
    for i in range(len(data['N'])):
        solver.Add(x[i] + data['E'][i] >= P[i]*dias)
    
    # Objective
    solver.Maximize(sum(data['Pr'][i] * P[i] * dias - data['C'][i] * x[i] for i in range(n)))
    
    status = solver.Solve()
    
    result = {}
    if status == pywraplp.Solver.OPTIMAL:
        print('================= Solution =================')
        print(f'Solved in {solver.wall_time():.2f} milliseconds in {solver.iterations()} iterations')
        print()
        print(f'Optimal lucro = {solver.Objective().Value()}')
        print('Variables:')
        result['time'] = solver.wall_time()
        result['iteracoes'] = solver.iterations()
        result['lucro'] = solver.Objective().Value()
        result['variaveis'] = [0] * n
        result['produtos'] = [0] * n
        for j in range(n):
            result['variaveis'][j] = x[j].solution_value()
            result['produtos'][j] = data['N'][j]
            print(f' - X = {x[j].solution_value()}')
    else:
        print('The solver could not find an optimal solution.')
    
    return result

if __name__ == '__main__': 
    app.run() # run our api