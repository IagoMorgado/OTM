from asyncio.windows_events import INFINITE
from ortools.linear_solver import pywraplp
from flask import Flask
from flask_restful import Resource, Api, request
import pandas as pd

app = Flask(__name__)
api = Api(app)

class Havaianas(Resource):
    def get(self):
        # jeito de ler a tabela de vendas
        data = pd.read_csv('vendasAnuais.csv')
        data = data.to_dict()
        
        # get query Params
        args = request.args
        
        modelResult = havainasModel(int(args['dias']), float(args['espectativa']))
        # rodar o modelo
        return {'data': modelResult}, 200
    pass

api.add_resource(Havaianas, '/havaiana-otimizacao')

def create_data_model():
    data = {}
    #set
    data['N'] = ["produtoA", "produtoB", "produtoC", "produtoD", "produtoE"]
    #param
    data['V'] = [20, 15, 10, 1, 18]
    data['Pr'] = [19.90, 29.90, 24.90, 89.90, 20.90]
    data['C'] = [4.90, 7.90, 6.50, 49.90, 5.50]
    data['Ex'] = [15, 8, 10, 5, 6]
    data['E'] = [15, 10, 5, 0, 15]
    
    return data
    
def havainasModel(dias, alfa):
    # Create a solver usando SCIP
    solver = pywraplp.Solver('Maximize lucro da loja de havainas', pywraplp.Solver.SCIP_MIXED_INTEGER_PROGRAMMING)
    data = create_data_model()
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
    solver.Maximize(sum(data['Pr'][i] * P[i] * dias - data['C'][i] * x[i] for i in range(len(data['N']))))
    
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
        result['variaveis'] = {}
        for j in range(len(data['N'])):
            result['variaveis']['x[%i]' % j] = x[j].solution_value()
            print(f' - X = {x[j].solution_value()}')
    else:
        print('The solver could not find an optimal solution.')
    
    return result

if __name__ == '__main__': 
    app.run() # run our api