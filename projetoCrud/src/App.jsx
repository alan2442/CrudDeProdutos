import { useEffect, useState } from 'react'
import Formulario from './Pages/Formulario'
import Tabela from './Pages/Tabela'
import './App.css'

function App() {

  //Objeto produto
  const produto = {
    codigo: 0,
    nome: '',
    marca: ''
  }

  //useState
  const [btnCadastrar, setBtnCadastrar] = useState(true);
  const [produtos, setProdutos] = useState([]);
  const [objProduto, setObjProduto] = useState(produto);

  //UseEffect
  useEffect(() => {
    fetch("http://localhost:8080/listar")
      .then(retorno => retorno.json()) //converte o retorno para json
      .then(retorno_convertido => setProdutos(retorno_convertido));
  }, []);

  //Obtebdo os dados do Formulario
  const aoDigitar = (e) => {
    setObjProduto({ ...objProduto, [e.target.name]: e.target.value });
  }


  //Cadastrar produto
  const cadastrar = () => {
    fetch('http://localhost:8080/cadastrar', {
      method: 'post',
      body: JSON.stringify(objProduto),
      headers: {
        'Content-type': 'application/json',
        'Accept': 'application/json'
      }
    })
      .then(retorno => retorno.json())
      .then(retorno_convertido => {

        if (retorno_convertido.mensagem !== undefined) {
          alert(retorno_convertido.mensagem);
        } else {
          setProdutos([...produtos, retorno_convertido]);
          alert('Produto cadastrado com suceso!');
          limparFormulario();
        }

      })
  }


  //Alterar produto
  const alterar = () => {
    fetch('http://localhost:8080/alterar', {
      method: 'put',
      body: JSON.stringify(objProduto),
      headers: {
        'Content-type': 'application/json',
        'Accept': 'application/json'
      }
    })
      .then(retorno => retorno.json())
      .then(retorno_convertido => {

        if (retorno_convertido.mensagem !== undefined) {
          alert(retorno_convertido.mensagem);
        } else {

          alert('Produto alterado com suceso!');


          // Cópia do vetor de produtos
          let vetorTemp = [...produtos];

          //Indice
          let indice = vetorTemp.findIndex((p) => {
            return p.codigo === objProduto.codigo;
          });

          // Alterar produto do vetorTemp
          vetorTemp[indice] = objProduto;

          //Atualizar o vetor de produtos
          setProdutos(vetorTemp);

          //Limpar Formulario
          limparFormulario();
        }

      })
  }


  //Remover produto
  const remover = () => {
    fetch('http://localhost:8080/remover/' + objProduto.codigo, {
      method: 'delete',
      headers: {
        'Content-type': 'application/json',
        'Accept': 'application/json'
      }
    })
      .then(retorno => retorno.json())
      .then(retorno_convertido => {

        // Mensagem
        alert(retorno_convertido.mensagem);

        // Cópia do vetor de produtos
        let vetorTemp = [...produtos];

        //Indice
        let indice = vetorTemp.findIndex((p) => {
          return p.codigo === objProduto.codigo;
        });

        // Remover produto do vetorTemp
        vetorTemp.splice(indice, 1);

        //Atualizar o vetor de produtos
        setProdutos(vetorTemp);

        // Limpar formulário
        limparFormulario();

      })
  }

  // Limpar Formulário
  const limparFormulario = () => {
    setObjProduto(produto);
    setBtnCadastrar(true);
  }

  //Selecionar produto
  const selecionarProduto = (indice) => {
    setObjProduto(produtos[indice]);
    setBtnCadastrar(false);
  }



  //Retorno
  // <p>{JSON.stringify(produtos)}</p> 
  // <p>{JSON.stringify(objProduto)}</p>
  return (
    <div>

      <Formulario
        botao={btnCadastrar}
        eventoTeclado={aoDigitar}
        cadastrar={cadastrar} 
        obj={objProduto}
        cancelar={limparFormulario} 
        remover={remover}
        alterar={alterar}
      />
      <Tabela vetor={produtos} selecionar={selecionarProduto} />
    </div>
  )
}

export default App
