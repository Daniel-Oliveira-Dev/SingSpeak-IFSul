// Funções JavaScript

// Insere as informações do usuário na página
function assignUserInfo(arrayUser) {
  document.getElementById("infoUsername").textContent += " " + arrayUser[0];
  document.getElementById("infoEmail").textContent += " " + arrayUser[1];
  document.getElementById("infoDataCriacao").textContent += " " + arrayUser[2];
  document.getElementById("infoPontos").textContent += " " + arrayUser[3];
  document.getElementById("infoNivel").textContent += " " + arrayUser[4];
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
          }
      }
  };

  xhr.open('GET', 'userCodes/verifySession.php', true);
  xhr.send();
}

function assembleUser() {
  let xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
          if (xhr.status === 200) {
              let responseJson = JSON.parse(xhr.responseText);
              assignUserInfo(responseJson.userArray);
          }
      }
  };

  xhr.open('GET', 'userCodes/getUserPageInfo.php', true);
  xhr.send();
}

// Funções jQuery

// Carrega as funções quando a página é carregada
$(function(){
  // Verifica a sessão
  verifySession();

  // Insere as informações do usuário nos campos corretos
  assembleUser();

  // Encerra a sessão se o usuário clicar no botão "Sair"
  $("#buttonLogout").click(function () {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
              window.location.href = '/SingSpeak/index.html';
            }
        }
    };

    xhr.open('GET', 'userCodes/logout.php', true);
    xhr.send();
  });

  });