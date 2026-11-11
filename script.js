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

// ===== 3B. DASHBOARD =====
const LISTA_STATUS = ["Aberto", "Em análise", "Aguardando informações", "Revisado", "Encaminhado à TI", "Concluído"];
const LISTA_PRIORIDADES = ["Baixa", "Média", "Alta", "Urgente"];

// Mesmas cores dos selos da tabela.
const COR_STATUS = {
  "Aberto": "#4f8cff", "Em análise": "#8b5cf6", "Aguardando informações": "#ffc107",
  "Revisado": "#22d3ee", "Encaminhado à TI": "#c060ff", "Concluído": "#2ecc8e"
};
const COR_PRIORIDADE = { "Baixa": "#2ecc8e", "Média": "#4f8cff", "Alta": "#ff9f43", "Urgente": "#ff476b" };

// Cria um elemento HTML com classe e texto (atalho para não repetir código).
function criarElemento(tag, classe, texto) {
  const e = document.createElement(tag);
  if (classe) e.className = classe;
  if (texto !== undefined) e.textContent = texto;
  return e;
}

// Conta quantos chamados existem em cada valor de um campo. Ex.: contar("status")
function contar(campo) {
  const contagem = {};
  chamados.forEach(function (c) { contagem[c[campo]] = (contagem[c[campo]] || 0) + 1; });
  return contagem;
}

// --- Cards de indicadores ---
function desenharCards() {
  const area = document.getElementById("dash-cards");
  area.innerHTML = "";
  const porStatus = contar("status");

  const total = criarElemento("div", "cartao indicador indicador-total");
  total.appendChild(criarElemento("div", "indicador-valor", String(chamados.length)));
  total.appendChild(criarElemento("div", "indicador-rotulo", "Total de chamados"));
  area.appendChild(total);

  LISTA_STATUS.forEach(function (status) {
    const card = criarElemento("div", "cartao indicador");
    card.style.setProperty("--cor", COR_STATUS[status]);
    card.appendChild(criarElemento("div", "indicador-valor", String(porStatus[status] || 0)));
    card.appendChild(criarElemento("div", "indicador-rotulo", status));
    area.appendChild(card);
  });
}

// --- Gráfico de barras (itens = [{ rotulo, valor, cor }]) ---
function desenharBarras(idArea, itens) {
  const area = document.getElementById(idArea);
  area.innerHTML = "";
  const maior = Math.max.apply(null, itens.map(function (i) { return i.valor; }).concat(1));

  itens.forEach(function (item) {
    const linha = criarElemento("div", "barra-linha");
    const trilho = criarElemento("div", "barra-trilho");
    const barra = criarElemento("div", "barra-preenchimento");
    barra.style.setProperty("--cor", item.cor);
    trilho.appendChild(barra);

    linha.appendChild(criarElemento("span", "barra-rotulo", item.rotulo));
    linha.appendChild(trilho);
    linha.appendChild(criarElemento("span", "barra-valor", String(item.valor)));
    area.appendChild(linha);

    // A largura é definida no próximo "quadro" para a barra crescer com animação.
    requestAnimationFrame(function () {
      barra.style.width = (item.valor / maior * 100) + "%";
    });
  });
}

// Transforma uma data em texto "2026-11-03" (usada para agrupar por dia).
function chaveDoDia(data) {
  return data.getFullYear() + "-" + String(data.getMonth() + 1).padStart(2, "0") + "-" + String(data.getDate()).padStart(2, "0");
}

// --- Gráfico de evolução: chamados abertos por dia (SVG) ---
function desenharEvolucao() {
  const area = document.getElementById("grafico-evolucao");

  // 1. Conta os chamados de cada dia
  const porDia = {};
  let primeiro = null, ultimo = null;
  chamados.forEach(function (c) {
    const d = new Date(c.abertura);
    d.setHours(0, 0, 0, 0);
    porDia[chaveDoDia(d)] = (porDia[chaveDoDia(d)] || 0) + 1;
    if (!primeiro || d < primeiro) primeiro = d;
    if (!ultimo || d > ultimo) ultimo = d;
  });

  // 2. Monta a lista de dias, inclusive os dias sem chamados (valor 0)
  let dias = [];
  for (let d = new Date(primeiro); d <= ultimo; d.setDate(d.getDate() + 1)) {
    dias.push({
      valor: porDia[chaveDoDia(d)] || 0,
      rotulo: String(d.getDate()).padStart(2, "0") + "/" + String(d.getMonth() + 1).padStart(2, "0")
    });
  }
  if (dias.length > 30) dias = dias.slice(-30);   // mostra no máximo os últimos 30 dias

  // 3. Medidas do desenho
  const L = 600, A = 240, margem = { e: 34, d: 16, t: 16, b: 32 };
  const n = dias.length;
  const passo = Math.max(1, Math.ceil(Math.max.apply(null, dias.map(function (x) { return x.valor; })) / 4));
  const topo = passo * Math.ceil(Math.max.apply(null, dias.map(function (x) { return x.valor; })) / passo);
  const x = function (i) { return margem.e + (n === 1 ? (L - margem.e - margem.d) / 2 : i * (L - margem.e - margem.d) / (n - 1)); };
  const y = function (v) { return margem.t + (A - margem.t - margem.b) * (1 - v / topo); };

  // 4. Monta o SVG. Aqui só entram números e datas, nada digitado pelo usuário.
  let svg = '<svg class="svg-evolucao" viewBox="0 0 ' + L + ' ' + A + '" role="img" aria-label="Chamados abertos por dia">';
  svg += '<defs><linearGradient id="degrade-area" x1="0" y1="0" x2="0" y2="1">' +
         '<stop offset="0%" stop-color="#8b5cf6" stop-opacity="0.45"/>' +
         '<stop offset="100%" stop-color="#8b5cf6" stop-opacity="0"/></linearGradient></defs>';

  for (let v = 0; v <= topo; v += passo) {            // linhas horizontais e números do eixo
    svg += '<line class="svg-grade" x1="' + margem.e + '" x2="' + (L - margem.d) + '" y1="' + y(v) + '" y2="' + y(v) + '"/>';
    svg += '<text class="svg-texto" x="' + (margem.e - 8) + '" y="' + (y(v) + 4) + '" text-anchor="end">' + v + '</text>';
  }

  const pontos = dias.map(function (d, i) { return x(i) + "," + y(d.valor); }).join(" ");
  if (n > 1) {
    svg += '<polygon points="' + x(0) + "," + y(0) + " " + pontos + " " + x(n - 1) + "," + y(0) + '" fill="url(#degrade-area)"/>';
    svg += '<polyline class="svg-linha" points="' + pontos + '"/>';
  }

  const intervalo = Math.ceil(n / 8);                  // mostra uma data a cada poucos dias
  dias.forEach(function (d, i) {
    svg += '<circle class="svg-ponto" cx="' + x(i) + '" cy="' + y(d.valor) + '" r="4"><title>' + d.rotulo + ": " + d.valor + ' chamado(s)</title></circle>';
    if (i % intervalo === 0 || i === n - 1) {
      svg += '<text class="svg-texto" x="' + x(i) + '" y="' + (A - 10) + '" text-anchor="middle">' + d.rotulo + '</text>';
    }
  });
  svg += "</svg>";
  area.innerHTML = svg;
}

// --- Monta o dashboard inteiro ---
function desenharDashboard() {
  const vazio = chamados.length === 0;
  document.getElementById("dash-vazio").hidden = !vazio;       // mensagem amigável
  document.getElementById("dash-conteudo").hidden = vazio;     // cards e gráficos
  if (vazio) return;

  desenharCards();

  const porPrioridade = contar("prioridade");
  desenharBarras("grafico-prioridade", LISTA_PRIORIDADES.map(function (p) {
    return { rotulo: p, valor: porPrioridade[p] || 0, cor: COR_PRIORIDADE[p] };
  }));

  const porSetor = contar("setor");
  desenharBarras("grafico-setor", Object.keys(porSetor)
    .sort(function (a, b) { return porSetor[b] - porSetor[a]; })   // setor com mais chamados primeiro
    .map(function (s) { return { rotulo: s, valor: porSetor[s], cor: "#8b5cf6" }; }));

  desenharEvolucao();
}

// ===== 4. TROCAR DE TELA =====
function mostrarTela(nome) {
  document.querySelectorAll(".tela").forEach(function (t) { t.classList.remove("ativa"); });
  document.getElementById("tela-" + nome).classList.add("ativa");

  document.querySelectorAll(".menu-item[data-tela]").forEach(function (b) {
    b.classList.toggle("ativo", b.dataset.tela === nome);
  });
  if (nome === "dashboard") desenharDashboard();   // recalcula os números ao abrir
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
  desenharDashboard();                         // mantém o dashboard atualizado
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
    desenharDashboard();
    mostrarAviso("Exemplos restaurados.");
  }
});

// ===== 8. INÍCIO =====
desenharTabela();
desenharDashboard();