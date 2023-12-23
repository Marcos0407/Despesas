
class Registro {

    constructor(ano, mes, dia, tipo, descricao, valor) {
        this.ano = ano,
        this.mes = mes, 
        this.dia = dia, 
        this.tipo = tipo, 
        this.descricao = descricao,
        this.valor = valor
    }

    validarDados() {

        for(let i in this) {

            if( this[i] == '' || this[i] == undefined || this[i] == null) {
                return false;
            }

        }

        return true;

    }

}



// class Bd, que vai encapsula todos os arquivos relacionandos ao local storage;
class Bd {

    constructor () {

        // verificar no local storage se tem id
        // nao, criar ele;

        let id = localStorage.getItem('id'); // null

        if(id === null) {
            localStorage.setItem('id', 0); // cetando id no local storage;
        }

    }


    // Proximo id;
    getProximoid() {

        let proximoid = localStorage.getItem('id');
        return parseInt(proximoid) + 1;
    }


   
    // inserindo os arquivos recuperado do input no local storage;
    gravar(r) {

        let id = this.getProximoid();

        localStorage.setItem(id, JSON.stringify(r));
        
        localStorage.setItem('id', id);

    }

    recuperarRegistro() {
        
       let despesas = Array();

        let id = localStorage.getItem('id');
        
        for(let i = 1; i <= id; i++) {

            let registro = JSON.parse(localStorage.getItem(i));
            

            // verificar se tem registro que foram apagados!
            if(registro === null) {
                continue;
            }

            registro.id = i;
            despesas.push(registro);

        }

        return despesas;

    }


    pesquisar(despesas) {
        
        let recuperarRegistroLocal = Array();


        recuperarRegistroLocal = this.recuperarRegistro();

        // ano
        if(despesas.ano != '') {
           recuperarRegistroLocal = recuperarRegistroLocal.filter(r => r.ano == despesas.ano)
        }

        // mes
        if(despesas.mes != '') {
            recuperarRegistroLocal = recuperarRegistroLocal.filter( r => r.mes == despesas.mes);
        }

        // dia
        if(despesas.dia != '') {
            recuperarRegistroLocal = recuperarRegistroLocal.filter( r => r.dia == despesas.dia);
        }

        // tipo
        if(despesas.tipo != '') {
            recuperarRegistroLocal = recuperarRegistroLocal.filter( r => r.tipo == despesas.tipo);
        }

        // descricao
        if(despesas.descricao != '') {
            recuperarRegistroLocal = recuperarRegistroLocal.filter( r => r.descricao == despesas.descricao);
        }

        // valor
        if(despesas.valor != '') {
            recuperarRegistroLocal = recuperarRegistroLocal.filter( r => r.valor == despesas.valor);
        }

        return recuperarRegistroLocal;

    }


    remover(id) {
        localStorage.removeItem(id);

    }

    

}

let bd = new Bd();


// funcao para enviar os dados dos registros;
chamarClick();
function chamarClick() {

    // evento para clicar e recupar dados dos registros;
    document.querySelector('.corpoPai .enviar').addEventListener('click', ()=> {
    
        // recuperar os input, dados de entrada;
        let ano, mes, dia, tipo, descricao, valor;
    
        ano = document.getElementById('ano');
        mes = document.getElementById('mes');
        dia = document.getElementById('dia');
        tipo = document.getElementById('tipo');
        descricao = document.getElementById('descricao');
        valor = document.getElementById('valor');
        let registro;
        registro = new Registro(
    
            ano.value,
            mes.value,
            dia.value,
            tipo.value,
            descricao.value,
            valor.value
    
        );
        

        if(registro.validarDados()) {

            // validar acerto, inputs completos;
            validarAcerto();
            
            bd.gravar(registro)

            document.getElementById('ano').value = '';
            document.getElementById('mes').value = '';
            document.getElementById('dia').value = '';
            document.getElementById('tipo').value = '';
            document.getElementById('descricao').value = '';
            document.getElementById('valor').value = '';

        }else {

            // validar erro, inputs incompletos
            validarError();

        }
        
    
    });

}



// recuperar dodos do local strorage;
function carregaListaDespesas() {

    let despesas = bd.recuperarRegistro();
    // recuperar listaDespesas;
    /*
        <tr>
        <td> 20/10/2023 </td>
        <td> Faculdade </td>
        <td> Parcela Faculdade 05 </td>
        <td> R$ 988,99 </td>
        </tr>
    */

    let listaDespesa = document.getElementById('listaDespesa');
    
    despesas.forEach( (d) => {

        // criar a linha (tr);
        let linha = listaDespesa.insertRow();

        document.querySelector('.consulta tbody tr').classList.add('linhaBody');


        // criar a coluna (td);
        linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`;
        linha.insertCell(1).innerHTML = `${d.tipo}`;
        linha.insertCell(2).innerHTML = `${d.descricao}`;
        linha.insertCell(3).innerHTML = `R$ ${d.valor}`;

        // criar um botao para excluir
        let btn = document.createElement("button");
        btn.className = 'btn';
        btn.innerHTML = 'X';
        btn.id += `id_despesa_${d.id}`;
        btn.onclick = function() {
            
            let id = this.id.replace('id_despesa_', '');
            console.log(id);
            bd.remover(id);

            window.location.reload();

            console.log(id);
        }

        linha.insertCell(4).append(btn);

        

    });

}



// buscar registro;
function buscaRegistro() {
    
    // recuperar os input, dados de entrada;
    let ano, mes, dia, tipo, descricao, valor;

    ano = document.getElementById('ano');
    mes = document.getElementById('mes');
    dia = document.getElementById('dia');
    tipo = document.getElementById('tipo');
    descricao = document.getElementById('descricao');
    valor = document.getElementById('valor');

       
    let registro = new Registro(

        ano.value,
        mes.value,
        dia.value,
        tipo.value,
        descricao.value,
        valor.value
    );


    let pesquisar = Array();
    pesquisar =  bd.pesquisar(registro);

    let listaDespesa = document.getElementById('listaDespesa');
    listaDespesa.innerHTML = '';
    
    pesquisar.forEach( (d) => {

        // criar a linha (tr);
        let linha = listaDespesa.insertRow();

        document.querySelector('.consulta tbody tr').classList.add('linhaBody');


        // criar a coluna (td);
        linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`;
        linha.insertCell(1).innerHTML = `${d.tipo}`;
        linha.insertCell(2).innerHTML = `${d.descricao}`;
        linha.insertCell(3).innerHTML = `R$ ${d.valor}`;


        //criar um botao para excluir
        let btn = document.createElement("button");
        btn.className = 'btn';
        btn.innerHTML = 'X';
        btn.id += `id_despesa_${d.id}`;
        btn.onclick = function() {
            
            let id = this.id.replace('id_despesa_', '');
            console.log(id);
            bd.remover(id);

            window.location.reload();

            console.log(id);
        }

        linha.insertCell(4).append(btn);
       

    });

}






// validar erro
function validarError() {

    document.getElementById('validar').style.display = 'block';


    // style .validar
    document.getElementById('validar').style.backgroundColor = 'red';


    // style nos Primeira mensagem
    document.querySelector(".validarItem:nth-child(1) h3").innerHTML = "Erro na gravação";
    document.querySelector(".validarItem:nth-child(1) h3").style.color = "#ffffff";
    // style Segunda mensagem;
    document.querySelector(".validarItem:nth-child(2) h3").innerHTML = "Existem campos obrigatorios que não foram preenchidos";
    document.querySelector(".validarItem:nth-child(2) h3").style.color = "#ffffff";



    // style campo fechar;
    document.getElementById('fechar').style.backgroundColor = "#ffffff";
    document.getElementById('fechar').style.color = "red";
    // style campo fechar;
    document.getElementById('fecharSecond').style.backgroundColor = "#ffffff";
    document.getElementById('fecharSecond').style.color = "red";




    // evento para fechar o validar;
    document.getElementById('fechar').addEventListener('click', ()=> {
        document.getElementById('validar').style.display = 'none';
    });
    document.getElementById('fecharSecond').addEventListener('click', ()=> {
        document.getElementById('validar').style.display = 'none';
    });


}





// validar acerto
function validarAcerto() {

    document.getElementById('validar').style.display = 'block';

    // style .validar
    document.getElementById('validar').style.backgroundColor = 'green';



    // style nos Primeira mensagem
    document.querySelector(".validarItem:nth-child(1) h3").innerHTML = "Registro inserido com sucesso";
    document.querySelector(".validarItem:nth-child(1) h3").style.color = "#ffffff";
    // style Segunda mensagem;
    document.querySelector(".validarItem:nth-child(2) h3").innerHTML = "Despesa foi cadastrada com sucesso";
    document.querySelector(".validarItem:nth-child(2) h3").style.color = "#ffffff";



    // style campo fechar;
    document.getElementById('fechar').style.backgroundColor = "#ffffff";
    document.getElementById('fechar').style.color = "green";
    // style campo fechar;
    document.getElementById('fecharSecond').style.backgroundColor = "#ffffff";
    document.getElementById('fecharSecond').style.color = "green";




    // evento para fechar o validar;
    document.getElementById('fechar').addEventListener('click', ()=> {
        document.getElementById('validar').style.display = 'none';
    });
    document.getElementById('fecharSecond').addEventListener('click', ()=> {
        document.getElementById('validar').style.display = 'none';
    });


}


