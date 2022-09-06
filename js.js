const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

let elementoFormulario = document.querySelector(".js-formulario");
let elementoResultado = document.querySelector(".js-resultado");
let elementoCarregamento = document.querySelector(".js-carregamento");
let elementoResultadoTitulo = document.querySelector(".js-resultado__titulo");
let elementoResultadoDescricao = document.querySelector(".js-resultado__descricao");
let icone = document.getElementById("elemento");



function erroPalavraNaoEncontrada() {
  elementoResultadoTitulo.textContent =
    "Palavra não encontrada, verifique a grafia e tente novamente!";
  elementoResultadoDescricao.textContent = "";
}

function escondeMostraResultado(mostrar = false) {
  if (mostrar) {
    elementoResultado.classList.remove("display-none");
    elementoCarregamento.classList.remove("display-none");
  } else {
    elementoCarregamento.classList.add("display-none");
  }
}

function parserXML(data) {
  let resposta = {
    titulo: "",
    descricao: "",
  };
  funcaoDeParseamento = new DOMParser();

  resposta.titulo = funcaoDeParseamento
    .parseFromString(data, "text/xml")
    .getElementsByTagName("form")[0]
    .getElementsByTagName("orth")[0].textContent;

  resposta.descricao = funcaoDeParseamento
    .parseFromString(data, "text/xml")
    .getElementsByTagName("sense")[0]
    .getElementsByTagName("def")[0].textContent;

  return resposta;
}

function inserirRespostas(objRespostas) {
  elementoResultadoTitulo.textContent = objRespostas.titulo;
  elementoResultadoDescricao.textContent = objRespostas.descricao;
}

function requisicaoFormulario(palavraParaBuscar) {
  let url = `https://api.dicionario-aberto.net/word/${palavraParaBuscar}`;

  fetch(url)
    .then((resposta) => resposta.json())
    .then((resposta) => {
      if (!resposta[0]) {
        erroPalavraNaoEncontrada();
        return;
      }

      let conteudoParseado = parserXML(resposta[0].xml);
      inserirRespostas(conteudoParseado);
    })
    .finally(() => {
      escondeMostraResultado();
    });
}

function gerenciarFormulario() {
  elementoFormulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    icone.classList.add("bi-clipboard");
    icone.classList.remove("bi-clipboard-check");
    escondeMostraResultado(true);
    let palavra = evento.target[0].value;
    requisicaoFormulario(palavra.toLowerCase());
  });
}

gerenciarFormulario();

function copy(){
  if(elementoResultadoTitulo.textContent != "Palavra não encontrada, verifique a grafia e tente novamente!" && elementoResultadoTitulo.textContent != ""){
    icone.classList.remove("bi-clipboard");
    icone.classList.add("bi-clipboard-check");
    copiar();
  }else{
    alert("Nada para ser copiado");
  }
}

function copiar(){
  navigator.clipboard.writeText(elementoResultadoDescricao.textContent)
      .then(() => {
      alert("Copiado!");
  })
      .catch(err => {
      alert('Erro ao copiar!', err);
  })
}