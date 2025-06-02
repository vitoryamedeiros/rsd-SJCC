// Importa o Firebase (supondo que você use módulo ES6, ou adapte pra script normal se quiser)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore, collection, addDoc, query, where, getDocs, orderBy } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// Config do Firebase - substitua pelos seus dados reais
const firebaseConfig = {
    apiKey: "AIzaSyD2FJbBDerh3ubEFBve_gsUZ8ovxJAsPXk",
    authDomain: "bd-sjcc.firebaseapp.com",
    projectId: "bd-sjcc",
    storageBucket: "bd-sjcc.firebasestorage.app",
    messagingSenderId: "319159491486",
    appId: "1:319159491486:web:3a380bcd6d5a8489aa148f",
    measurementId: "G-JD51K2E37H"
  };

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const GEMINI_API_KEY = 'AIzaSyBSsOtZWMiyR8vGdm5u4r6rDg69tYMboKQ';

async function verificaComentario(texto) {
  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

  const body = {
    contents: [{
      parts: [{
        text: `Analise o seguinte comentário e responda apenas com 'sim' ou 'não': "${texto}".
        Este comentário contém algo ofensivo, discurso de ódio, preconceito, machismo ou violência?`
      }]
    }]
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      console.error('Erro na API Gemini:', response.status, await response.text());
      return false;
    }

    const data = await response.json();
    console.log('Resposta Gemini:', data);

    const resposta = data.candidates[0].content.parts[0].text.trim().toLowerCase();
    console.log('Resposta interpretada:', resposta);
    return resposta.includes('não');
  } catch (error) {
    console.error('Erro ao chamar API Gemini:', error);
    return false;
  }
}


// Salva o comentário no Firestore com status aprovado ou reprovado
async function salvarComentario(nome, texto, status) {
  try {
    await addDoc(collection(db, "comentarios"), {
      nome: nome || "Anônimo",
      texto,
      status, // "aprovado" ou "reprovado"
      data: new Date()
    });
  } catch(e) {
    console.error("Erro ao salvar comentário: ", e);
  }
}

async function gerarConteudo() {
    const response = await fetch('https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=AIzaSyBSsOtZWMiyR8vGdm5u4r6rDg69tYMboKQ', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: 'Explain how AI works in a few words' }
            ]
          }
        ]
      })
    });
  
    const data = await response.json();
    console.log(data);
  }
  

// Cria o DOM do comentário para mostrar na tela
function criarComentarioDOM(nome, texto, data) {
  const article = document.createElement('article');
  article.className = 'bg-white rounded-[20px] p-4 shadow-sm mb-3';

  const formattedDate = new Date(data.seconds * 1000).toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'long', year: 'numeric'
  }) + ', ' + new Date(data.seconds * 1000).toLocaleTimeString('pt-BR', {
    hour: '2-digit', minute: '2-digit'
  });

  article.innerHTML = `
    <header class="flex items-center gap-3 mb-2">
      <img src="https://placehold.co/40x40/999999/ffffff?text=?" alt="Avatar genérico para usuário anônimo" class="w-10 h-10 rounded-full object-cover" />
      <div>
        <p class="text-[#0F0F0F] font-semibold text-sm leading-tight">${nome}</p>
        <time class="text-[#999999] text-xs">${formattedDate}</time>
      </div>
    </header>
    <p class="text-[#0F0F0F] text-base leading-relaxed">${texto.replace(/\n/g, '<br>')}</p>
  `;
  return article;
}

// Mostra os comentários aprovados do banco no site ao carregar
async function carregarComentarios() {
  const commentList = document.querySelector('section.flex-1.overflow-y-auto');
  commentList.innerHTML = ''; // Limpa antes

  const q = query(collection(db, "comentarios"), where("status", "==", "aprovado"), orderBy("data", "desc"));
  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const commentDOM = criarComentarioDOM(data.nome, data.texto, data.data);
    commentList.appendChild(commentDOM);
  });
}

// Manipula o envio do formulário de comentário
const form = document.getElementById('commentForm');
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const submitButton = form.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  submitButton.textContent = 'Enviando...';

  const commentText = document.getElementById('commentText').value.trim();
  const commentName = document.getElementById('commentName').value.trim() || 'Anônimo';

  if (!commentText) {
    showAlert('Por favor, escreva um comentário.', 'warning');
    submitButton.disabled = false;
    submitButton.textContent = 'Enviar Comentário';
    return;
  }

  try {
    // Só faz UMA VEZ
    const aprovado = await verificaComentario(commentText);
    await salvarComentario(commentName, commentText, aprovado ? "aprovado" : "reprovado");

  if (aprovado) {
    const commentList = document.querySelector('section.flex-1.overflow-y-auto');
    const article = criarComentarioDOM(commentName, commentText, { seconds: Date.now() / 1000 });
    commentList.prepend(article);
    article.scrollIntoView({ behavior: 'smooth' });
  } else {
    showAlert('Seu comentário foi recebido, mas contém conteúdo inadequado e ficará oculto.', 'error');
  }

  form.reset();
} catch (error) {
  showAlert('Ocorreu um erro ao enviar o comentário. Tente novamente.', 'error');
  console.error(error);
} finally {
  submitButton.disabled = false; // REATIVA O BOTÃO
  submitButton.textContent = 'Enviar Comentário';
}
});

function showAlert(message, type = 'info') {
  const container = document.getElementById('alertContainer');
  const alert = document.createElement('div');

  const colors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    warning: 'bg-yellow-500 text-black'
  };

  alert.className = `text-white px-4 py-2 rounded-lg shadow-md animate-fade-in-out ${colors[type] || colors.info}`;
  alert.textContent = message;

  container.appendChild(alert);

  setTimeout(() => {
    alert.classList.add('opacity-0', 'translate-x-4');
    setTimeout(() => container.removeChild(alert), 500);
  }, 4000); // Exibe por 4 segundos
}


// Carrega comentários aprovados ao iniciar
window.addEventListener('load', carregarComentarios);
