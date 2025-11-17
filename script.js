const calendarGrid = document.querySelector(".calendar-grid");
const monthTitle = document.querySelector(".month-title");
const agendaList = document.querySelector(".agenda-list");

const btnAdd = document.querySelector(".add-btn");
const btnRemove = document.querySelector(".remove-btn");
const btnPrev = document.querySelector(".prev-month");
const btnNext = document.querySelector(".next-month");

let diaSelecionado = null;

// Armazena agendamentos por: ano → mês → dia
let agendamentos = {};

let dataAtual = new Date();

function gerarCalendario() {
  calendarGrid.innerHTML = "";

  let ano = dataAtual.getFullYear();
  let mes = dataAtual.getMonth();

  const nomeMeses = [
    "Janeiro","Fevereiro","Março","Abril","Maio","Junho",
    "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"
  ];

  monthTitle.textContent = `${nomeMeses[mes]} ${ano}`;

  let primeiroDiaSemana = new Date(ano, mes, 1).getDay();
  let ultimoDia = new Date(ano, mes + 1, 0).getDate();

  // Criar espaços antes do dia 1
  for (let i = 0; i < primeiroDiaSemana; i++) {
    const vazio = document.createElement("div");
    calendarGrid.appendChild(vazio);
  }

  // Criar dias reais
  for (let dia = 1; dia <= ultimoDia; dia++) {
    const div = document.createElement("div");
    div.classList.add("day");
    div.textContent = dia;

    div.addEventListener("click", () => {
      document.querySelectorAll(".day").forEach(d => d.classList.remove("selected"));
      div.classList.add("selected");

      diaSelecionado = { dia, mes, ano };
      mostrarAgendamentos();
    });

    calendarGrid.appendChild(div);
  }
}

function mostrarAgendamentos() {
  agendaList.innerHTML = "";

  if (!diaSelecionado) {
    agendaList.innerHTML = "<p>Selecione um dia.</p>";
    return;
  }

  let { ano, mes, dia } = diaSelecionado;

  let lista = agendamentos[ano]?.[mes]?.[dia] || [];

  if (lista.length === 0) {
    agendaList.innerHTML = `<p>Sem agendamentos no dia ${dia}.</p>`;
    return;
  }

  lista.forEach(item => {
    const div = document.createElement("div");
    div.classList.add("agenda-item");
    div.textContent = item;
    agendaList.appendChild(div);
  });
}

// Adicionar agendamento
btnAdd.addEventListener("click", () => {
  if (!diaSelecionado) {
    alert("Selecione um dia!");
    return;
  }

  let texto = prompt("Digite o agendamento:");

  if (!texto) return;

  let { ano, mes, dia } = diaSelecionado;

  agendamentos[ano] = agendamentos[ano] || {};
  agendamentos[ano][mes] = agendamentos[ano][mes] || {};
  agendamentos[ano][mes][dia] = agendamentos[ano][mes][dia] || [];

  agendamentos[ano][mes][dia].push(texto);

  mostrarAgendamentos();
});

// Remover último agendamento
btnRemove.addEventListener("click", () => {
  if (!diaSelecionado) {
    alert("Selecione um dia!");
    return;
  }

  let { ano, mes, dia } = diaSelecionado;

  let lista = agendamentos[ano]?.[mes]?.[dia];

  if (!lista || lista.length === 0) {
    alert("Não há agendamentos para remover!");
    return;
  }

  lista.pop();
  mostrarAgendamentos();
});

// Navegação entre meses
btnPrev.addEventListener("click", () => {
  dataAtual.setMonth(dataAtual.getMonth() - 1);
  gerarCalendario();
});

btnNext.addEventListener("click", () => {
  dataAtual.setMonth(dataAtual.getMonth() + 1);
  gerarCalendario();
});

// Inicializar
gerarCalendario();
