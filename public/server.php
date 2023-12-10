<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;  

class ContaController extends Controller
{

    public function cadastrar(Request $request)
    {
        $dados = $request->all();

        $inserido = DB::table('contas')->insert([
            'jogo' => $dados['jogo'],
            'usuario' => $dados['usuario'], 
            'senha' => $dados['senha']
        ]);

        if($inserido) {
            return response()->json([
                'sucesso' => true,
                'mensagem' => 'Conta inserida com sucesso'
            ], 201);
        } else {
            return response()->json([
                'sucesso' => false,
                'mensagem' => 'Falha ao inserir conta'
            ], 500);
        }
    }

    public function buscarJogos(Request $request)
    {
        $termo = $request->input('jogo');

        if($termo) {

            $jogos = DB::table('contas')
                        ->select('jogo')
                        ->where('jogo', 'LIKE', "%{$termo}%")
                        ->groupBy('jogo')
                        ->get()
                        ->pluck('jogo');

            return response()->json([
                'sucesso' => true,
                'jogos' => $jogos
            ], 200);

        } else {
            return response()->json([
                'sucesso' => false,
                'mensagem' => 'Nenhum termo informado'
            ], 400);  
        }
    }

    public function pesquisarContas(Request $request)
    {
        $jogo = $request->input('jogo');
        $todos = $request->input('todos');

        if($jogo) {

            $contas = DB::table('contas')
                        ->where('jogo', $jogo)
                        ->get();

            if(count($contas) > 0) {
                return response()->json([
                    'sucesso' => true,
                    'mensagem' => 'Contas encontradas',
                    'contas' => $contas
                ], 200);
            } else {
                return response()->json([
                    'sucesso' => false, 
                    'mensagem' => 'Nenhuma conta encontrada'
                ], 404);
            }

        } else if($todos) {

            $jogos = DB::table('contas')
                        ->select('jogo')
                        ->groupBy('jogo')
                        ->get()
                        ->pluck('jogo');

            return response()->json([
                'sucesso' => true,
                'mensagem' => 'Jogos encontrados',
                'jogos' => $jogos
            ], 200);

        } else {
            return response()->json([
                'sucesso' => false,
                'mensagem' => 'Nenhum parâmetro informado'
            ], 400);
        }

    }

}


require __DIR__.'/../vendor/autoload.php';

$app = require_once __DIR__.'/../bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

$response = $kernel->handle(
    $request = Illuminate\Http\Request::capture()
);

$response->send();

$kernel->terminate($request, $response);