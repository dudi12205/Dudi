// ============================================================
// Carômetro - Script Principal
// Renderização, filtros, busca e modal
// ============================================================

// Estado da aplicação
let filtroAtual = "todos";

// ---- Elementos do DOM ----
const cardsGrid = document.getElementById("cardsGrid");
const noResults = document.getElementById("noResults");
const searchInput = document.getElementById("searchInput");
const modalOverlay = document.getElementById("modalOverlay");

// ---- Inicialização ----
document.addEventListener("DOMContentLoaded", function () {
  renderizarCards(alunos);

  // Busca em tempo real
  searchInput.addEventListener("input", aplicarFiltros);

  // Fechar modal com ESC
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      fecharModal();
    }
  });
});


// ---- Criar HTML de um card ----
function criarCard(aluno) {
  var turmaCor = aluno.turma === "A" ? "turma-a" : "turma-b";
  var numFormatado = aluno.numero < 10 ? "0" + aluno.numero : aluno.numero;

  var card = document.createElement("div");
  card.className = "card";
  card.onclick = function () { abrirModal(aluno); };

  card.innerHTML =
    '<div class="card-photo">' +
      '<img src="' + aluno.foto + '" alt="Foto de ' + aluno.nome + '" loading="lazy" />' +
      '<span class="card-numero-badge">' + numFormatado + '</span>' +
      '<span class="card-turma-badge ' + turmaCor + '">Turma ' + aluno.turma + '</span>' +
    '</div>' +
    '<div class="card-body">' +
      '<h3 class="card-nome">' + aluno.nome + '</h3>' +
      '<p class="card-posto">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
          '<path d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"/>' +
          '<path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>' +
        '</svg>' +
        aluno.posto +
      '</p>' +
    '</div>';

  return card;
}

// ---- Renderizar cards na grid ----
function renderizarCards(lista) {
  cardsGrid.innerHTML = "";

  if (lista.length === 0) {
    noResults.style.display = "block";
    return;
  }

  noResults.style.display = "none";

  lista.forEach(function (aluno) {
    var card = criarCard(aluno);
    cardsGrid.appendChild(card);
  });
}

// ---- Filtrar por turma ----
function filtrar(turma) {
  filtroAtual = turma;

  // Atualizar pills ativos
  var pills = document.querySelectorAll(".pill");
  pills.forEach(function (btn) {
    btn.classList.remove("active");
    if (btn.getAttribute("data-filter") === turma) {
      btn.classList.add("active");
    }
  });

  // Atualizar sidebar nav
  var navItems = document.querySelectorAll(".nav-item");
  navItems.forEach(function (item, index) {
    item.classList.remove("active");
    if ((turma === "todos" && index === 0) ||
        (turma === "A" && index === 1) ||
        (turma === "B" && index === 2)) {
      item.classList.add("active");
    }
  });

  aplicarFiltros();
}

// ---- Aplicar filtros (turma + busca) ----
function aplicarFiltros() {
  var termo = searchInput.value.toLowerCase().trim();

  var resultado = alunos.filter(function (aluno) {
    // Filtro por turma
    var passaTurma = filtroAtual === "todos" || aluno.turma === filtroAtual;

    // Filtro por busca
    var passaBusca = true;
    if (termo !== "") {
      var numStr = aluno.numero < 10 ? "0" + aluno.numero : String(aluno.numero);
      passaBusca =
        aluno.nome.toLowerCase().indexOf(termo) !== -1 ||
        numStr.indexOf(termo) !== -1 ||
        String(aluno.numero).indexOf(termo) !== -1 ||
        aluno.posto.toLowerCase().indexOf(termo) !== -1;
    }

    return passaTurma && passaBusca;
  });

  renderizarCards(resultado);
}

// ---- Modal: abrir ----
function abrirModal(aluno) {
  document.getElementById("modalFoto").src = aluno.foto;
  document.getElementById("modalFoto").alt = "Foto de " + aluno.nome;
  document.getElementById("modalNome").textContent = aluno.nome;

  var numFormatado = aluno.numero < 10 ? "0" + aluno.numero : aluno.numero;
  document.getElementById("modalNumero").textContent = "Nº " + numFormatado;
  document.getElementById("modalTurmaText").textContent = "Turma " + aluno.turma;
  document.getElementById("modalPosto").textContent = aluno.posto;

  var turmaBadge = document.getElementById("modalTurma");
  turmaBadge.textContent = "Turma " + aluno.turma;
  turmaBadge.style.background = aluno.turma === "A" ? "var(--turma-a)" : "var(--turma-b)";

  modalOverlay.classList.add("active");
  document.body.style.overflow = "hidden";
}

// ---- Modal: fechar ----
function fecharModal() {
  modalOverlay.classList.remove("active");
  document.body.style.overflow = "";
}
