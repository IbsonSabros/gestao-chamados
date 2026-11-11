// ===== 1. DADOS =====
// Os chamados ficam guardados no navegador (localStorage) com esta "etiqueta":
const CHAVE = "chamados_prototipo_v1";

// 8 chamados de exemplo, todos com dados fictícios.
const EXEMPLOS = [
  { id: "CH-0001", titulo: "Não consigo acessar o sistema financeiro", setor: "Financeiro", solicitante: "Ana Souza", categoria: "Acesso e senhas", prioridade: "Alta", status: "Em análise", descricao: "A senha foi bloqueada após três tentativas.", impacto: "Fechamento do mês atrasado.", abertura: "2026-11-03T09:15:00" },
  { id: "CH-0002", titulo: "Impressora do RH sem imprimir", setor: "Recursos Humanos", solicitante: "Carlos Lima", categoria: "Hardware", prioridade: "Média", status: "Aberto", descricao: "A impressora mostra erro de papel, mas está cheia.", impacto: "Contratos precisam ser impressos hoje.", abertura: "2026-11-04T14:40:00" },
  { id: "CH-0003", titulo: "Internet lenta no setor comercial", setor: "Comercial", solicitante: "Beatriz Alves", categoria: "Rede e internet", prioridade: "Urgente", status: "Encaminhado à TI", descricao: "Videochamadas travam desde a manhã.", impacto: "Reuniões com clientes prejudicadas.", abertura: "2026-11-05T08:05:00" },
  { id: "CH-0004", titulo: "Instalar editor de imagens", setor: "Marketing", solicitante: "Diego Ramos", categoria: "Software", prioridade: "Baixa", status: "Aguardando informações", descricao: "Preciso de um editor para a campanha.", impacto: "Sem impacto imediato.", abertura: "2026-11-05T16:20:00" },
  { id: "CH-0005", titulo: "Erro ao emitir relatório de entregas", setor: "Logística", solicitante: "Fernanda Costa", categoria: "Sistema interno", prioridade: "Alta", status: "Revisado", descricao: "O relatório fecha sozinho ao clicar em exportar.", impacto: "Conferência das entregas manual.", abertura: "2026-11-06T10:30:00" },
  { id: "CH-0006", titulo: "Criar e-mail para novo estagiário", setor: "Jurídico", solicitante: "Gustavo Pinto", categoria: "Acesso e senhas", prioridade: "Baixa", status: "Concluído", descricao: "Estagiário começa na próxima segunda.", impacto: "Sem e-mail ele não acessa os documentos.", abertura: "2026-11-02T11:00:00" },
  { id: "CH-0007", titulo: "Monitor com tela piscando", setor: "Atendimento", solicitante: "Helena Dias", categoria: "Hardware", prioridade: "Média", status: "Em análise", descricao: "A tela pisca a cada poucos minutos.", impacto: "Dor de cabeça e atendimentos mais lentos.", abertura: "2026-11-07T13:10:00" },
  { id: "CH-0008", titulo: "Sistema não salva o cadastro de clientes", setor: "Comercial", solicitante: "Igor Martins", categoria: "Sistema interno", prioridade: "Urgente", status: "Aberto", descricao: "Aparece 'erro ao salvar' em todo cadastro novo.", impacto: "Novas vendas não conseguem ser registradas.", abertura: "2026-11-09T09:45:00" }
];

// Lê os chamados salvos. Se não houver nenhum, usa os exemplos.
function carregar() {
  try {
    const salvo = localStorage.getItem(CHAVE);
    if (salvo) return JSON.parse(salvo);
  } catch (erro) {
    console.warn("Não foi possível ler os chamados salvos.", erro);
  }
  return EXEMPLOS.slice();
}

// Guarda a lista no navegador.
function salvar() {
  try {
    localStorage.setItem(CHAVE, JSON.stringify(chamados));
  } catch (erro) {
    console.warn("Não foi possível salvar os chamados.", erro);
  }
}

let chamados = carregar();

// ===== 2. FUNÇÕES AUXILIARES =====
// Transforma "Aguardando informações" em "aguardando-informacoes" (usado nas cores).
function criarSlug(texto) {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function formatarData(iso) {
  return new Date(iso).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}

// Gera o próximo número: CH-0009, CH-0010...
function proximoId() {
  const maior = chamados.reduce((m, c) => Math.max(m, parseInt(c.id.slice(3), 10) || 0), 0);
  return "CH-" + String(maior + 1).padStart(4, "0");
}

// Cria uma célula de tabela com texto (textContent evita que o texto vire código HTML).
function criarCelula(texto, classe) {
  const td = document.createElement("td");
  td.textContent = texto;
  if (classe) td.className = classe;
  return td;
}

function criarSelo(texto, classe) {
  const td = document.createElement("td");
  const span = document.createElement("span");
  span.className = "selo " + classe;
  span.textContent = texto;
  td.appendChild(span);
  return td;
}

// ===== 3. DESENHAR A TABELA =====
function desenharTabela() {
  const corpo = document.getElementById("corpo-tabela");
  corpo.innerHTML = "";

  document.getElementById("contagem").textContent =
    chamados.length + (chamados.length === 1 ? " chamado registrado" : " chamados registrados");

  if (chamados.length === 0) {
    const tr = document.createElement("tr");
    const td = criarCelula("Nenhum chamado ainda. Abra o primeiro em “Novo chamado”.", "vazio");
    td.colSpan = 6;
    tr.appendChild(td);
    corpo.appendChild(tr);
    return;
  }

  // Mais recentes primeiro
  const ordenados = chamados.slice().sort((a, b) => new Date(b.abertura) - new Date(a.abertura));

  ordenados.forEach(function (c) {
    const tr = document.createElement("tr");
    tr.appendChild(criarCelula(c.id, "col-id"));
    tr.appendChild(criarCelula(c.titulo, "col-titulo"));
    tr.appendChild(criarCelula(c.setor));
    tr.appendChild(criarSelo(c.prioridade, "prio-" + criarSlug(c.prioridade)));
    tr.appendChild(criarSelo(c.status, "status-" + criarSlug(c.status)));
    tr.appendChild(criarCelula(formatarData(c.abertura), "col-data"));
    corpo.appendChild(tr);
  });
}

// ===== 4. TROCAR DE TELA =====
function mostrarTela(nome) {
  document.querySelectorAll(".tela").forEach(function (t) { t.classList.remove("ativa"); });
  document.getElementById("tela-" + nome).classList.add("ativa");

  document.querySelectorAll(".menu-item[data-tela]").forEach(function (b) {
    b.classList.toggle("ativo", b.dataset.tela === nome);
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Todo botão com data-tela="..." leva para a tela indicada.
document.querySelectorAll("[data-tela]").forEach(function (botao) {
  botao.addEventListener("click", function () { mostrarTela(botao.dataset.tela); });
});

// ===== 5. AVISO RÁPIDO =====
let temporizador;
function mostrarAviso(mensagem) {
  const aviso = document.getElementById("aviso");
  aviso.textContent = mensagem;
  aviso.classList.add("visivel");
  clearTimeout(temporizador);
  temporizador = setTimeout(function () { aviso.classList.remove("visivel"); }, 3000);
}

// ===== 6. SALVAR UM NOVO CHAMADO =====
document.getElementById("formulario").addEventListener("submit", function (evento) {
  evento.preventDefault(); // impede a página de recarregar
  const dados = new FormData(evento.target);

  chamados.push({
    id: proximoId(),
    titulo: dados.get("titulo").trim(),
    setor: dados.get("setor"),
    solicitante: dados.get("solicitante").trim(),
    categoria: dados.get("categoria"),
    prioridade: dados.get("prioridade"),
    descricao: dados.get("descricao").trim(),
    impacto: dados.get("impacto").trim(),
    status: "Aberto",                          // todo chamado novo começa como "Aberto"
    abertura: new Date().toISOString()         // data e hora automáticas
  });

  salvar();
  desenharTabela();
  evento.target.reset();
  mostrarTela("lista");
  mostrarAviso("Chamado aberto com sucesso!");
});

// ===== 7. RESTAURAR OS EXEMPLOS =====
document.getElementById("btn-restaurar").addEventListener("click", function () {
  if (confirm("Isso apaga os chamados atuais e volta aos 8 exemplos. Continuar?")) {
    chamados = EXEMPLOS.slice();
    salvar();
    desenharTabela();
    mostrarAviso("Exemplos restaurados.");
  }
});

// ===== 8. INÍCIO =====
desenharTabela();