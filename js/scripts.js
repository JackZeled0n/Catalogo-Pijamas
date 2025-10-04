function openModal(src) {
  document.getElementById("modalImage").src = src;
  document.getElementById("imageModal").classList.remove("hidden");
}
function closeModal() {
  document.getElementById("modalImage").src = "";
  document.getElementById("imageModal").classList.add("hidden");
}
function closeIfBackdrop(e) {
  if (e.target.id === "imageModal") closeModal();
}
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

const tbody = document.querySelector("#catalogoTable tbody");
const allRows = Array.from(tbody.rows);
const marcaFilter = document.getElementById("marcaFilter");
const precioSort = document.getElementById("precioSort");
const resultCount = document.getElementById("resultCount");

const marcas = [
  ...new Set(allRows.map((r) => r.cells[1].textContent.trim())),
].sort();
for (const m of marcas) {
  const opt = document.createElement("option");
  opt.value = m;
  opt.textContent = m;
  marcaFilter.appendChild(opt);
}

const priceNum = (cell) =>
  parseFloat(cell.textContent.replace(/[^0-9.-]/g, "")) || 0;

function aplicarFiltros() {
  allRows.forEach((r) => tbody.appendChild(r));

  const marcaSel = marcaFilter.value;
  let visibles = [];
  for (const row of allRows) {
    const marca = row.cells[1].textContent.trim();
    const show = !marcaSel || marca === marcaSel;
    row.style.display = show ? "" : "none";
    if (show) visibles.push(row);
  }

  if (precioSort.value) {
    visibles.sort((a, b) => {
      const pa = priceNum(a.cells[3]);
      const pb = priceNum(b.cells[3]);
      return precioSort.value === "asc" ? pa - pb : pb - pa;
    });
    visibles.forEach((r) => tbody.appendChild(r));
  }

  resultCount.textContent = visibles.length;
}

marcaFilter.addEventListener("change", aplicarFiltros);
precioSort.addEventListener("change", aplicarFiltros);

aplicarFiltros();

function initCustomSelect(displayBtn) {
  const selectId = displayBtn.getAttribute("data-select");
  const selectEl = document.getElementById(selectId);
  const menu = displayBtn.parentElement.querySelector("[data-menu]");
  const label = displayBtn.querySelector("[data-label]");

  function buildMenu() {
    menu.innerHTML = "";
    Array.from(selectEl.options).forEach((opt) => {
      const selected = opt.value === (selectEl.value ?? "");
      const item = document.createElement("div");
      item.className = [
        "flex items-center justify-between gap-2 cursor-pointer select-none rounded-md px-3 py-2 text-sm",
        selected
          ? "bg-indigo-600 text-white"
          : "hover:bg-indigo-50 hover:text-indigo-700",
      ].join(" ");
      item.dataset.value = opt.value;

      const txt = document.createElement("span");
      txt.className = "truncate";
      txt.textContent = opt.textContent;

      const check = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg"
      );
      check.setAttribute("viewBox", "0 0 20 20");
      check.classList.add("h-4", "w-4", selected ? "opacity-100" : "opacity-0");
      check.innerHTML =
        '<path fill="currentColor" d="M16.7 5.3a1 1 0 010 1.4l-7 7a1 1 0 01-1.4 0l-3-3a1 1 0 011.4-1.4l2.3 2.3 6.3-6.3a1 1 0 011.4 0z"/>';
      item.append(txt, check);

      item.addEventListener("click", () => {
        selectEl.value = item.dataset.value;
        label.textContent = opt.textContent;
        menu.classList.add("hidden");
        displayBtn.setAttribute("aria-expanded", "false");
        selectEl.dispatchEvent(new Event("change", { bubbles: true }));
      });

      menu.appendChild(item);
    });
  }

  displayBtn.addEventListener("click", () => {
    buildMenu();
    const isHidden = menu.classList.contains("hidden");
    document
      .querySelectorAll("[data-menu]")
      .forEach((m) => m.classList.add("hidden"));
    document
      .querySelectorAll('[aria-expanded="true"]')
      .forEach((b) => b.setAttribute("aria-expanded", "false"));
    if (isHidden) {
      menu.classList.remove("hidden");
      displayBtn.setAttribute("aria-expanded", "true");
    }
  });

  document.addEventListener("click", (e) => {
    if (!displayBtn.parentElement.contains(e.target)) {
      menu.classList.add("hidden");
      displayBtn.setAttribute("aria-expanded", "false");
    }
  });

  selectEl.addEventListener("change", () => {
    const opt = selectEl.options[selectEl.selectedIndex];
    if (opt) label.textContent = opt.textContent;
  });
}

initCustomSelect(document.getElementById("marcaFilterDisplay"));
initCustomSelect(document.getElementById("precioSortDisplay"));
