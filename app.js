const dictionary = [
  { category:"Pronombres", es:"Yo", zap:"Naa" },
  { category:"Pronombres", es:"Tú", zap:"Luu" },
  { category:"Pronombres", es:"Él/Ella", zap:"Laa" },
  { category:"Pronombres", es:"Nosotros", zap:"Ne" },

  { category:"Saludos", es:"Hola", zap:"Guié" },
  { category:"Saludos", es:"Gracias", zap:"Diuxi" },
  { category:"Saludos", es:"Adiós", zap:"Bidxa" },
  { category:"Saludos", es:"Sí", zap:"Ña" },
  { category:"Saludos", es:"No", zap:"Co" },

  { category:"Casa", es:"Casa", zap:"Yoo" },
  { category:"Casa", es:"Agua", zap:"Nisa" },
  { category:"Casa", es:"Pueblo", zap:"Guidxi" },
  { category:"Casa", es:"Árbol", zap:"Yaga" },

  { category:"Comida", es:"Tortilla", zap:"Gueta" },
  { category:"Comida", es:"Maíz", zap:"Bizaa" },
  { category:"Comida", es:"Carne", zap:"Benda" },
  { category:"Comida", es:"Frijol", zap:"Pigu" },

  { category:"Familia", es:"Mamá", zap:"Nana" },
  { category:"Familia", es:"Papá", zap:"Tata" },
  { category:"Familia", es:"Hermano", zap:"Bixhoze" },
  { category:"Familia", es:"Hermana", zap:"Bixhana" },

  { category:"Naturaleza", es:"Sol", zap:"Gubidxa" },
  { category:"Naturaleza", es:"Luna", zap:"Guela" },

  { category:"Verbos", es:"Hacer", zap:"Runi" },
  { category:"Verbos", es:"Decir", zap:"Raca" },
  { category:"Verbos", es:"Ver", zap:"Riguí" },
  { category:"Verbos", es:"Ir", zap:"Ria" }
];

let words = [...dictionary];

const result = document.getElementById("result");
const categoriesContainer = document.getElementById("categoriesContainer");
const menuBtn = document.getElementById("menuBtn");
const categoriesPanel = document.getElementById("categoriesPanel");

function normalize(text){
  return text
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function translateText(){
  const input = normalize(document.getElementById("inputText").value);
  const from = document.getElementById("fromLang").value;

  if(!input){
    result.textContent = "Escribe una palabra";
    return;
  }

  let found = null;

  for(const item of words){
    if(from === "es"){
      if(normalize(item.es) === input){
        found = item;
        break;
      }
    }else{
      if(normalize(item.zap) === input){
        found = item;
        break;
      }
    }
  }

  if(found){
    result.textContent = from === "es" ? found.zap : found.es;
  }else{
    result.textContent = "No encontrado";
  }
}

function renderCategories(data){
  categoriesContainer.innerHTML = "";

  const icons = {
    "Pronombres":"🧍",
    "Saludos":"👋",
    "Casa":"🏠",
    "Comida":"🍎",
    "Familia":"👨‍👩‍👧",
    "Naturaleza":"🌎",
    "Verbos":"🧠"
  };

  const grouped = {};

  data.forEach(item => {
    if(!grouped[item.category]){
      grouped[item.category] = [];
    }
    grouped[item.category].push(item);
  });

  for(const category in grouped){
    const div = document.createElement("div");
    div.className = "category";

    let html = `<h3>${icons[category] || "📍"} ${category}</h3>`;

    grouped[category].forEach(word => {
      html += `<p class="word">${word.es} ⇄ ${word.zap}</p>`;
    });

    div.innerHTML = html;
    categoriesContainer.appendChild(div);
  }
}

function searchWord(){
  const query = normalize(document.getElementById("searchWord").value);

  const filtered = words.filter(item =>
    normalize(item.es).includes(query) ||
    normalize(item.zap).includes(query)
  );

  renderCategories(filtered);
}

function addWord(es, zap, category){
  if(!es || !zap || !category) return;

  words.push({
    es,
    zap,
    category
  });

  renderCategories(words);
}

function createAddWordPanel(){
  const panel = document.createElement("div");
  panel.className = "add-word-box";

  panel.innerHTML = `
    <h3>Agregar palabra</h3>
    <input id="newEs" placeholder="Español">
    <input id="newZap" placeholder="Zapoteco">
    <input id="newCategory" placeholder="Categoría">
    <button id="saveWordBtn">Guardar</button>
  `;

  document.querySelector(".container").appendChild(panel);

  document.getElementById("saveWordBtn").addEventListener("click", function(){
    const es = document.getElementById("newEs").value.trim();
    const zap = document.getElementById("newZap").value.trim();
    const category = document.getElementById("newCategory").value.trim();

    if(!es || !zap || !category){
      alert("Completa todos los campos");
      return;
    }

    addWord(es, zap, category);

    document.getElementById("newEs").value = "";
    document.getElementById("newZap").value = "";
    document.getElementById("newCategory").value = "";
  });
}

document.getElementById("translateBtn").addEventListener("click", translateText);

document.getElementById("searchBtn").addEventListener("click", searchWord);

document.getElementById("searchWord").addEventListener("input", searchWord);

document.getElementById("swapBtn").addEventListener("click", function(){
  const from = document.getElementById("fromLang");
  const to = document.getElementById("toLang");

  const temp = from.value;
  from.value = to.value;
  to.value = temp;
});

menuBtn.addEventListener("click", function(){
  categoriesPanel.classList.toggle("open");
});

renderCategories(words);
createAddWordPanel();
