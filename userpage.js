// Funções JavaScript

// Insere as informações do usuário na página
function assignUserInfo(arrayUser) {
  document.getElementById("infoUsername").textContent += " " + arrayUser[0];
  document.getElementById("infoEmail").textContent += " " + arrayUser[1];
  document.getElementById("infoDataCriacao").textContent += " " + arrayUser[2];
  document.getElementById("infoPontos").textContent += " " + arrayUser[3] + " pontos e está na posição " + arrayUser[5];
  document.getElementById("infoNivel").textContent += " " + arrayUser[4];
}

// Verifica se a sessão está definida
function verifySession() {
  let xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
          if (xhr.status === 200) {
              if (xhr.responseText === 'Sessão não encontrada') {
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
                const response = JSON.parse(xhr.responseText);
                if (response.sucesso) {
                    window.location.href = '/SingSpeak/index.html';
                } else {
                    alert(response.erro);
                }
            }
        }
    };

    xhr.open('GET', 'userCodes/logout.php', true);
    xhr.send();
  });


  // Ativa e desativa os botões de Configurações
  $("#buttonConfig").click(function () {
      $("#optionsConfig").toggleClass("hiddenElement");
      $(".configForm").addClass("hiddenElement");
  })

  // Ativa e desativar o Formulário de Editar Username
  $("#optionsUsername").click(function () {
    $("#alterEmailDiv, #alterPasswordDiv, #deleteAccountDiv").addClass("hiddenElement");
    $("#alterUsernameDiv").toggleClass("hiddenElement");
  })

  // Ativa e desativar o Formulário de Editar Email
  $("#optionsEmail").click(function () {
    $("#alterUsernameDiv, #alterPasswordDiv, #deleteAccountDiv").addClass("hiddenElement");
    $("#alterEmailDiv").toggleClass("hiddenElement");
  })

  // Ativa e desativar o Formulário de Editar Senha
  $("#optionsPassword").click(function () {
    $("#alterUsernameDiv, #alterEmailDiv, #deleteAccountDiv").addClass("hiddenElement");
    $("#alterPasswordDiv").toggleClass("hiddenElement");
  })

  // Ativa e desativar o Formulário de Apagar Conta
  $("#optionsDelete").click(function () {
    $("#alterUsernameDiv, #alterPasswordDiv, #alterEmailDiv").addClass("hiddenElement");
    $("#deleteAccountDiv").toggleClass("hiddenElement");
  })

  // Verifica se os campos de Alterar Username estão preenchidos para liberar o botão de envio
  $("#alterUsernameForm input").change(function(){
    if($("#passwordConfirmUser").val() && $("#newUsername").val() && $("#newUsernameConfirm").val()) {
      $("#newUsernameSubmit").prop("disabled", false);
    } else {
      $("#newUsernameSubmit").prop("disabled", true);
    }
  });

  // Envia o formulário para alterar o username
  $("#alterUsernameForm").submit(function(event) {
    event.preventDefault(); // Evita o comportamento padrão do formulário

    // Obtenha os valores dos campos de entrada
    let oldPasswordInput = $("#passwordConfirmUser").val();
    let newUsernameInput = $("#newUsername").val();
    let newUsernameConfirmInput = $("#newUsernameConfirm").val();

    if (newUsernameConfirmInput != newUsernameInput) {
      alert("Os nomes de usuário não coincidem!");
      return;
    }

    // Envia a solicitação AJAX para verificar o login
    $.post('userCodes/alterUsername.php', { 
      oldPassword: oldPasswordInput, 
      newUsername: newUsernameInput 
    }, function(response) {
      if (response.erro) {
        // Exibir a mensagem de erro na página HTML
        alert(response.erro);
      }
      if (response.sucesso) {
        window.location.reload();
      }
    }, 'json');
  });

  // Verifica se os campos de Alterar Email estão preenchidos para liberar o botão de envio
  $("#alterEmailForm input").change(function(){
    if($("#passwordConfirmEmail").val() && $("#newEmail").val() && $("#newEmailConfirm").val()) {
      $("#newEmailSubmit").prop("disabled", false);
    } else {
      $("#newEmailSubmit").prop("disabled", true);
    }
  });

  // Envia o formulário para alterar o email
  $("#alterEmailForm").submit(function(event) {
    event.preventDefault(); // Evita o comportamento padrão do formulário

    // Obtenha os valores dos campos de entrada
    let oldPasswordInput = $("#passwordConfirmEmail").val();
    let newEmailInput = $("#newEmail").val();
    let newEmailConfirmInput = $("#newEmailConfirm").val();

    if (newEmailInput != newEmailConfirmInput) {
      alert("Os endereços de email não coincidem");
      return;
    }

    // Envia a solicitação AJAX para verificar o login
    $.post('userCodes/alterEmail.php', { 
      oldPassword: oldPasswordInput, 
      newEmail: newEmailInput 
    }, function(response) {
      if (response.erro) {
        // Exibir a mensagem de erro na página HTML
        alert(response.erro);
      }
      if (response.sucesso) {
        window.location.reload();
      }
    }, 'json');
  });

  // Verifica se os campos de Alterar Senha estão preenchidos para liberar o botão de envio
  $("#alterPasswordForm input").change(function(){
    if($("#oldPassword").val() && $("#newPassword").val() && $("#newPasswordConfirm").val()) {
      $("#newPasswordSubmit").prop("disabled", false);
    } else {
      $("#newPasswordSubmit").prop("disabled", true);
    }
  });

  // Envia o formulário para alterar a senha
  $("#alterPasswordForm").submit(function(event) {
    event.preventDefault(); // Evita o comportamento padrão do formulário

    // Obtenha os valores dos campos de entrada
    let oldPasswordInput = $("#oldPassword").val();
    let newPasswordInput = $("#newPassword").val();
    let newPasswordConfirmInput = $("#newPasswordConfirm").val();

    if (newPasswordInput != newPasswordConfirmInput) {
      alert("As senhas não coincidem");
      return;
    }

    if (newPasswordInput === oldPasswordInput) {
      alert("Sua nova senha precisa ser diferente da atual!");
      return;
    }

    // Envia a solicitação AJAX para verificar o login
    $.post('userCodes/alterPassword.php', { 
      oldPassword: oldPasswordInput, 
      newPassword: newPasswordInput
    }, function(response) {
      if (response.erro) {
        // Exibir a mensagem de erro na página HTML
        alert(response.erro);
      }
      if (response.sucesso) {
        window.location.href = '/SingSpeak/index.html';
      }
    }, 'json');
  });

  // Verifica se os campos de Deletar Conta estão preenchidos para liberar o botão de envio
  $("#deleteAccountForm input").change(function(){
    if($("#confirmPasswordOne").val() && $("#confirmPasswordTwo").val() && $("#confirmDeleteCheckbox").prop("checked")) {
      $("#confirmDeleteAccountButton").prop("disabled", false);
    } else {
      $("#confirmDeleteAccountButton").prop("disabled", true);
    }
  });

  // Envia o formulário para deletar a conta
  $("#deleteAccountForm").submit(function(event) {
    event.preventDefault(); // Evita o comportamento padrão do formulário

    // Obtenha os valores dos campos de entrada
    let confirmPasswordOneInput = $("#confirmPasswordOne").val();
    let confirmPasswordTwoInput = $("#confirmPasswordTwo").val();

    if (confirmPasswordOneInput != confirmPasswordTwoInput) {
      alert("As senhas não são iguais!");
      return;
    }

    // Envia a solicitação AJAX para verificar o login
    $.post('userCodes/deleteAccount.php', { 
      confirmPassword: confirmPasswordOneInput,
    }, function(response) {
      if (response.erro) {
        // Exibir a mensagem de erro na página HTML
        alert(response.erro);
      }
      if (response.sucesso) {
        window.location.href = '/SingSpeak/index.html';
      }
    }, 'json');
  });

  });