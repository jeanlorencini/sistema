// Selecionar os elementos do HTML
const formCadastro = document.getElementById("form-cadastro");
const btnCadastrar = document.getElementById("btn-cadastrar");
const msgCadastro = document.getElementById("msg-cadastro");
const formPesquisa = document.getElementById("form-pesquisa");
const btnPesquisar = document.getElementById("btn-pesquisar");
const msgPesquisa = document.getElementById("msg-pesquisa");
const resultado = document.getElementById("resultado");

// Função para preencher o elemento select de jogo com as opções dos jogos já cadastrados
function preencherJogoSelect() {

  let jogoSelect = document.getElementById("jogo-select");

  fetch("/pesquisar-contas?todos=true")
    .then(res => res.json()) 
    .then(data => {
    
      if (data.nomes_jogos) {

        jogoSelect.innerHTML = "";  

        let optionVazio = document.createElement("option");
        optionVazio.value = "";
        optionVazio.textContent = "Selecione um jogo";
        jogoSelect.appendChild(optionVazio);

        let optionNovo = document.createElement("option");
        optionNovo.value = "novo";
        optionNovo.textContent = "Novo jogo";
        jogoSelect.appendChild(optionNovo);

        for (let jogo of data.nomes_jogos) {
          
          let option = document.createElement("option");
          option.value = jogo;
          option.textContent = jogo;
          jogoSelect.appendChild(option);

        }

      }

    });

}

// Declaração da variável suggestionsContainer
const suggestionsContainer = document.getElementById('suggestions');

document.getElementById('jogoInput').addEventListener('input', function(e) {
  let inputValue = e.target.value;

  if (inputValue.length >= 3) { 
    fetch('http://localhost:8000/buscar-jogos?jogo=' + encodeURIComponent(inputValue))
      .then(res => res.json())
      .then(data => {
        
        suggestionsContainer.innerHTML = '';

        data.jogos.forEach(jogo => {
        
          let div = document.createElement('div');
          div.textContent = jogo;
          div.className = 'suggestion-item'; 
          div.addEventListener('click', function(e) {
            document.getElementById('jogoInput').value = jogo;
            suggestionsContainer.innerHTML = '';
          
            pesquisarContas(e);
          });
          
          suggestionsContainer.appendChild(div);

        });

      })
      .catch(err => {
        console.error(err); 
      });

  } else {
    suggestionsContainer.innerHTML = ''; 
  }

});


btnCadastrar.addEventListener("click", cadastrarConta);  
btnPesquisar.addEventListener("click", pesquisarContas);

function cadastrarConta(event) {

  event.preventDefault();

  const jogo = formCadastro.jogo.value;
  const usuario = formCadastro.usuario.value;
  const senha = formCadastro.senha.value;

  const conta = {
    jogo: jogo,
    usuario: usuario,
    senha: senha
  };

  if (jogo && usuario && senha) {

    fetch("/cadastrar-conta", {
      method: "POST", 
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').getAttribute('content')
      },
      body: JSON.stringify(conta)
    })
    .then(res => res.json()) 
    .then(data => {
    
      if (data.sucesso) {
        
        msgCadastro.style.backgroundColor = "green";
        msgCadastro.textContent = data.mensagem;

      } else {

        msgCadastro.style.backgroundColor = "red";
        msgCadastro.textContent = data.mensagem;

      }

      formCadastro.reset();
      preencherJogoSelect();

    })
    .catch(err => {

      msgCadastro.style.backgroundColor = "red";       
      msgCadastro.textContent = 'Erro ao cadastrar a conta de jogo: ' + err.message;
    
    });

  }

}


function pesquisarContas(event) {

  event.preventDefault();

  let jogo = document.getElementById("jogoInput").value;

  if (jogo) {

    fetch("/pesquisar-contas", {
      method: "POST",
      body: {jogo: jogo}
    })
    .then(res => res.json())
    .then(data => {
  
      if (data.sucesso) {
        
        msgPesquisa.style.backgroundColor = "green";
        msgPesquisa.textContent = data.mensagem;
            
        resultado.innerHTML = "";
            
        let table = document.createElement("table");
        let thead = document.createElement("thead");
        let tbody = document.createElement("tbody");
            
        // cabeçalho da tabela
        let tr = document.createElement("tr");
        let th1 = document.createElement("th");  
        let th2 = document.createElement("th");
        let th3 = document.createElement("th");
        let th4 = document.createElement("th"); 
            
        th1.textContent = "Jogo";
        th2.textContent = "Usuario";
        th3.textContent = "Senha";
            
        tr.appendChild(th1);
        tr.appendChild(th2);
        tr.appendChild(th3);
        tr.appendChild(th4);
            
        thead.appendChild(tr);
  
        table.appendChild(thead);
                        
        // dados da tabela
data.contas.forEach(conta => {

    let tr = document.createElement("tr");
                
    let td1 = document.createElement("td");
    td1.textContent = conta.jogo;
  
    let td2 = document.createElement("td");
    td2.textContent = conta.usuario;
  
    let td3 = document.createElement("td");
    td3.textContent = conta.senha;
            
    let btnCopiar = document.createElement("button");
    btnCopiar.textContent = "Copiar";
    btnCopiar.className = "btn-copiar";
            
    let td4 = document.createElement("td");
    td4.appendChild(btnCopiar);
  
    tr.appendChild(td1);
    tr.appendChild(td2);  
    tr.appendChild(td3);
    tr.appendChild(td4);
  
    tbody.appendChild(tr);
  
    btnCopiar.addEventListener("click", () => {
     
      let dados = "*"+conta.jogo+"*\n" + 
                   "usuario: "+conta.usuario+"\n" +  
                   "senha: "+conta.senha;
  
      navigator.clipboard.writeText(dados)
        .then(() => {        
          alert("Dados copiados!");
        })
        .catch(() => {
          alert("Erro ao copiar dados");  
        });
    
    });
  
  });
        
        table.appendChild(tbody);
        resultado.appendChild(table);

      } else {

        msgPesquisa.style.backgroundColor = "red";
        msgPesquisa.textContent = data.mensagem;
        resultado.innerHTML = "";   

      }

    })
    .catch(err => {
    
      msgPesquisa.style.backgroundColor = "red";       
      msgPesquisa.textContent = 'Erro ao pesquisar contas: ' + err.message;
      resultado.innerHTML = "";
    
    });

  } else {

    msgPesquisa.style.backgroundColor = "red";        
    msgPesquisa.textContent = "Digite o nome do jogo";
    resultado.innerHTML = "";

  }

}