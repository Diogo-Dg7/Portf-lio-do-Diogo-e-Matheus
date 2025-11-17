const calendarGrid = document.querySelector(".calendar-grid");
const monthTitle = document.querySelector(".month-title");
const agendaList = document.querySelector(".agenda-list");
const main = document.querySelector("main");

const btnAdd = document.querySelector(".add-btn");
const btnRemove = document.querySelector(".remove-btn");
const btnPrev = document.querySelector(".prev-month");
const btnNext = document.querySelector(".next-month");

let diaSelecionado = null;

// Estrutura de armazenamento dos agendamentos
let agendamentos = {};

let dataAtual = new Date();

// ------------------ GERAR CALENDÁRIO --------------------
function gerarCalendario() {
  calendarGrid.innerHTML = "";

  let ano = dataAtual.getFullYear();
  let mes = dataAtual.getMonth();

  const nomeMeses = [
    "Janeiro","Fevereiro","Março","Abril","Maio","Junho",
    "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"
  ];

  monthTitle.textContent = `${nomeMeses[mes]} ${ano}`;

  let primeiroDia = new Date(ano, mes, 1).getDay();
  let ultimoDia = new Date(ano, mes + 1, 0).getDate();

  // Criar espaços antes do dia 1
  for (let i = 0; i < primeiroDia; i++) {
    calendarGrid.appendChild(document.createElement("div"));
  }

  // Criar os dias reais
  for (let dia = 1; dia <= ultimoDia; dia++) {
    const div = document.createElement("div");
    div.classList.add("day");
    div.textContent = dia;

    div.addEventListener("click", () => {
      document.querySelectorAll(".day").forEach(d => d.classList.remove("selected"));
      div.classList.add("selected");

      diaSelecionado = { dia, mes, ano };

      // Ao selecionar um dia → mostra aside
      main.classList.remove("no-selection");

      mostrarAgendamentos();
    });

    calendarGrid.appendChild(div);
  }
}

// ------------------ EXIBIR AGENDAMENTOS --------------------
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

// ------------------ ADICIONAR --------------------
btnAdd.addEventListener("click", () => {
  if (!diaSelecionado) {
    alert("Selecione um dia!");
    return;
  }

  let texto = prompt("Novo agendamento:");
  if (!texto) return;

  let { ano, mes, dia } = diaSelecionado;

  agendamentos[ano] ??= {};
  agendamentos[ano][mes] ??= {};
  agendamentos[ano][mes][dia] ??= [];

  agendamentos[ano][mes][dia].push(texto);

  mostrarAgendamentos();
});

// ------------------ REMOVER --------------------
btnRemove.addEventListener("click", () => {
  if (!diaSelecionado) {
    alert("Selecione um dia!");
    return;
  }

  let { ano, mes, dia } = diaSelecionado;

  let lista = agendamentos[ano]?.[mes]?.[dia];

  if (!lista || lista.length === 0) {
    alert("Não há agendamentos!");
    return;
  }

  lista.pop();
  mostrarAgendamentos();
});

// ------------------ NAVEGAÇÃO --------------------
btnPrev.addEventListener("click", () => {
  dataAtual.setMonth(dataAtual.getMonth() - 1);
  gerarCalendario();
});

btnNext.addEventListener("click", () => {
  dataAtual.setMonth(dataAtual.getMonth() + 1);
  gerarCalendario();
});

// ------------------ INICIAR --------------------
gerarCalendario();

// Fechar barra lateral quando clicar fora
document.addEventListener("click", (e) => {
  
  // se NÃO houver dia selecionado, nem precisa testar
  if (!diaSelecionado) return;

  const clicouEmDia = e.target.classList.contains("day");
  const clicouAdd = e.target.classList.contains("add-btn");
  const clicouRemove = e.target.classList.contains("remove-btn");
  const clicouAside = e.target.closest(".agenda-aside");

  // Se o clique NÃO foi em nenhum desses → esconder aside
  if (!clicouEmDia && !clicouAdd && !clicouRemove && !clicouAside) {
    diaSelecionado = null;            // limpa seleção
    main.classList.add("no-selection"); // esconde aside

    // remove marcação dos dias
    document.querySelectorAll(".day").forEach(d => d.classList.remove("selected"));
  }
});
