const dictionary = [
  { category:"Pronombres", es:"Yo", zap:"Naa" },
  { category:"Pronombres", es:"Tú", zap:"Luu" },
  { category:"Pronombres", es:"Él", zap:"Laa" },

  { category:"Saludos", es:"Hola", zap:"Guié" },
  { category:"Saludos", es:"Gracias", zap:"Diuxi" },
  { category:"Saludos", es:"Adiós", zap:"Bidxa" },

  { category:"Casa", es:"Casa", zap:"Yoo" },
  { category:"Casa", es:"Agua", zap:"Nisa" },
  { category:"Casa", es:"Pueblo", zap:"Guidxi" },

  { category:"Comida", es:"Tortilla", zap:"Gueta" },
  { category:"Comida", es:"Maíz", zap:"Bizaa" },

  { category:"Familia", es:"Mamá", zap:"Nana" },
  { category:"Familia", es:"Papá", zap:"Tata" },

  { category:"Naturaleza", es:"Sol", zap:"Gubidxa" },
  { category:"Naturaleza", es:"Luna", zap:"Guela" }
];

const result = document.getElementById("result");
const categoriesContainer = document.getElementById("categoriesContainer");

function normalize(text){
  return text.toLowerCase().trim();
}

function translateText(){
  const input = normalize(document.getElementById("inputText").value);
  const from = document.getElementById("fromLang").value;

  if(!input){
    result.textContent = "Escribe una palabra";
    return;
  }

  let found = null;

  for(let i = 0; i < dictionary.length; i++){
    const item = dictionary[i];

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

    let html = `<h3>${category}</h3>`;

    grouped[category].forEach(word => {
      html += `<p class="word">${word.es} ⇄ ${word.zap}</p>`;
    });

    div.innerHTML = html;
    categoriesContainer.appendChild(div);
  }
}

function searchWord(){
  const query = normalize(document.getElementById("searchWord").value);

  const filtered = dictionary.filter(item =>
    normalize(item.es).includes(query) ||
    normalize(item.zap).includes(query)
  );

  renderCategories(filtered);
}

document.getElementById("translateBtn").addEventListener("click", translateText);
document.getElementById("searchBtn").addEventListener("click", searchWord);

document.getElementById("swapBtn").addEventListener("click", function(){
  const from = document.getElementById("fromLang");
  const to = document.getElementById("toLang");

  const temp = from.value;
  from.value = to.value;
  to.value = temp;
});

renderCategories(dictionary);

const menuBtn = document.getElementById("menuBtn");
const categoriesPanel = document.getElementById("categoriesPanel");

menuBtn.addEventListener("click", function () {
  categoriesPanel.classList.toggle("hidden");
});
