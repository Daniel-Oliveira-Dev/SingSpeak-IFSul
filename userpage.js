// Funções JavaScript

// Lê as informações do JSON - Usuário
function assignUserInfo(arrayUser) {
  document.getElementById("infoUsername").textContent += " " + arrayUser['username'];
  document.getElementById("infoEmail").textContent += " " + arrayUser[''];
  document.getElementById("infoDataCriacao").textContent += " " + arrayUser[''];
  document.getElementById("infoPontos").textContent += " " + arrayUser[''];
  document.getElementById("infoNivel").textContent += " " + arrayUser[''];
}

// Verifica se a sessão está definida
function verifySession() {
  let xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
          if (xhr.status === 200) {
              if (xhr.responseText === 'Sessão ativa') {
                window.location.href = '/SingSpeak/index.html';
              }
              let responseJson = JSON.parse(xhr.responseText);
              console.log(responseJson.user);
              assignUserInfo(responseJson.user);
          }
      }
  };

  xhr.open('GET', 'userCodes/verifySession.php', true);
  xhr.send();
}

// Funções jQuery

// Carrega as funções quando a página é carregada
$(function(){
  // Verifica a sessão
  verifySession();

  // Insere as informações do usuário nos campos corretos
  assignUserInfo();

  });