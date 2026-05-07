import { dictionary } from "./data/dictionary.js";
import { db } from "./firebase-config.js";

import {
  collection,
  addDoc,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const result = document.getElementById("result");
const categoriesContainer = document.getElementById("categoriesContainer");

let words = [...dictionary];

function normalize(text) {
  return text
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

window.translateText = function () {
  const input = normalize(document.getElementById("inputText").value);

  if (!input) {
    result.innerText = "Escribe una palabra";
    return;
  }

  const from = document.getElementById("fromLang").value;

  const found = words.find(item => {
    const source = from === "es" ? item.es : item.zap;
    return normalize(source) === input;
  });

  result.innerText = found
    ? (from === "es" ? found.zap : found.es)
    : "No encontrado";
};

window.searchWord = function () {
  const query = normalize(document.getElementById("searchWord").value);

  const filtered = words.filter(item =>
    normalize(item.es).includes(query) ||
    normalize(item.zap).includes(query)
  );

  renderCategories(filtered);
};

function renderCategories(data) {
  categoriesContainer.innerHTML = "";

  const grouped = {};

  data.forEach(item => {
    if (!grouped[item.category]) {
      grouped[item.category] = [];
    }
    grouped[item.category].push(item);
  });

  for (const category in grouped) {
    const div = document.createElement("div");
    div.className = "category";

    div.innerHTML = `
      <h3>${category}</h3>
      ${
        grouped[category]
          .map(word => `
            <p class="word">
              <strong>${word.es}</strong> ⇄ ${word.zap}
            </p>
          `)
          .join("")
      }
    `;

    categoriesContainer.appendChild(div);
  }
}

async function loadFirebaseWords() {
  try {
    const snapshot = await getDocs(collection(db, "words"));

    snapshot.forEach(doc => {
      const data = doc.data();

      const exists = words.some(item =>
        normalize(item.es) === normalize(data.es)
      );

      if (!exists) {
        words.push(data);
      }
    });

    renderCategories(words);

  } catch (error) {
    console.error(error);
    renderCategories(words);
  }
}

window.addWord = async function () {
  const es = document.getElementById("newSpanish").value.trim();
  const zap = document.getElementById("newZapotec").value.trim();
  const category = document.getElementById("newCategory").value.trim();

  if (!es || !zap || !category) {
    alert("Completa todos los campos");
    return;
  }

  const exists = words.some(item =>
    normalize(item.es) === normalize(es)
  );

  if (exists) {
    alert("Esa palabra ya existe");
    return;
  }

  const newWord = { es, zap, category };

  try {
    await addDoc(collection(db, "words"), newWord);

    words.push(newWord);

    renderCategories(words);

    document.getElementById("newSpanish").value = "";
    document.getElementById("newZapotec").value = "";
    document.getElementById("newCategory").value = "";

    alert("Palabra guardada");

  } catch (error) {
    console.error(error);
    alert("Error al guardar");
  }
};

document
  .getElementById("swapBtn")
  .addEventListener("click", () => {
    const from = document.getElementById("fromLang");
    const to = document.getElementById("toLang");

    [from.value, to.value] = [to.value, from.value];
  });

renderCategories(words);
loadFirebaseWords();