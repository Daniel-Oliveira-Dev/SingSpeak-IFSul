// Funções JavaScript

// Insere as informações do usuário na página
function assignUserInfo(arrayUser) {
  $(".infoUsername").text($(".infoUsername").text() + " " + arrayUser[0]);
  $(".infoEmail").text(arrayUser[1]);
  $(".infoDataCriacao").text($(".infoDataCriacao").text() + " " + arrayUser[2]);
  $(".rankingScore").text(arrayUser[3] + " pontos");
  $(".rankingPlacement").text(arrayUser[5] + "º lugar");
  $(".levelName").text(arrayUser[4]);
  $(document).prop('title', arrayUser[0]);
}

// Abre o Pop Up
function popupOpen(mensagem) {
  $(".popup").removeClass("animate__backOutDown");
  $(".configTabPopup").removeClass("hiddenConfig");
  $(".popup").addClass("animate__rubberBand");
  $(".popupContent").text(mensagem);
  setTimeout(() => {
    $(".popup").removeClass("animate__rubberBand");
    $(".popup").addClass("animate__backOutDown");
    $(".configTabPopup").addClass("hiddenConfig");
  }, 3000);
}

// Verifica se a sessão está definida
function verifySession() {
  let xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            let responseJson = JSON.parse(xhr.responseText);
            if (responseJson.erro) {
              window.location.href = '../index.html';
            }
          }
      }
  };

  xhr.open('GET', 'verifySession.php', true);
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

  xhr.open('GET', 'getUserPageInfo.php', true);
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
  $(".buttonLogout").click(function () {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                if (response.sucesso) {
                    window.location.href = '../index.html';
                } else {
                    popupOpen(response.erro);
                }
            }
        }
    };

    xhr.open('GET', 'logout.php', true);
    xhr.send();
  });

  // Redireciona para a página de músicas
  $(".buttonMusics").click(function () {
    window.location.href = '../musicPages/main.html';
  })

  // Ativa e desativa a aba de Configurações
  $(".configStartButton, .optionsExit").click(function () {
    $(".configTabBackground").toggleClass("hiddenConfig");
  })

  // Muda o formulário exibido baseado no clique nas opções
  $(".buttonConfigMenu, #resetForm").click(function() {
    $(".configForm").addClass("hiddenConfig");
    $("form").each(function () {
      this.reset();
    });
    let formtype = $(this).data("formtype");
    $(".submitButton").prop("disabled", true);
    $(".configForm[data-formtype='" + formtype + "']").removeClass("hiddenConfig");
  });

  // Verifica se o formulário está com todos os campos preenchidos para liberar o botão de Enviar
  $(".configFormArea input").change(function () {
    let form = $(this).closest("form");
    let todosPreenchidos = true;
  
    // Verifica cada input para ver se estão preenchidos
    form.find("input").each(function () {
      if ($(this).is(":checkbox") && !$(this).prop("checked")) {
        todosPreenchidos = false;
        return false;  // Sai do loop se encontrar um checkbox não marcado
      } else if ($(this).val() === "") {
        todosPreenchidos = false;
        return false;  // Sai do loop se encontrar um campo de texto vazio
      }
    });    

    form.parent().find(".submitButton").prop("disabled", !todosPreenchidos);
  });

  // Ativa o envio do formulário
 $(".submitButton").click(function () {
  $(this).parent().parent().find(".configFormArea").submit();
 });

  // Envia o formulário para alterar o username
  $(".alterUsernameForm").submit(function(event) {
    event.preventDefault(); // Evita o comportamento padrão do formulário

    // Obtenha os valores dos campos de entrada
    let oldPasswordInput = $("#passwordConfirmUser").val();
    let newUsernameInput = $("#newUsername").val();
    let newUsernameConfirmInput = $("#newUsernameConfirm").val();

    if (newUsernameConfirmInput != newUsernameInput) {
      popupOpen("Os nomes de usuário não coincidem!");
      return;
    }

    // Envia a solicitação AJAX para verificar o login
    $.post('alterUsername.php', { 
      oldPassword: oldPasswordInput, 
      newUsername: newUsernameInput 
    }, function(response) {
      if (response.erro) {
        // Exibir a mensagem de erro na página HTML
        popupOpen(response.erro);
      }
      if (response.sucesso) {
        window.location.reload();
      }
    }, 'json');
  });

  // Envia o formulário para alterar o email
  $(".alterEmailForm").submit(function(event) {
    event.preventDefault(); // Evita o comportamento padrão do formulário

    // Obtenha os valores dos campos de entrada
    let oldPasswordInput = $("#passwordConfirmEmail").val();
    let newEmailInput = $("#newEmail").val();
    let newEmailConfirmInput = $("#newEmailConfirm").val();

    if (newEmailInput != newEmailConfirmInput) {
      popupOpen("Os endereços de email não coincidem");
      return;
    }

    // Envia a solicitação AJAX para verificar o login
    $.post('alterEmail.php', { 
      oldPassword: oldPasswordInput, 
      newEmail: newEmailInput 
    }, function(response) {
      if (response.erro) {
        // Exibir a mensagem de erro na página HTML
        popupOpen(response.erro);
      }
      if (response.sucesso) {
        window.location.reload();
      }
    }, 'json');
  });

  // Envia o formulário para alterar a senha
  $(".alterPasswordForm").submit(function(event) {
    event.preventDefault(); // Evita o comportamento padrão do formulário

    // Obtenha os valores dos campos de entrada
    let oldPasswordInput = $("#oldPassword").val();
    let newPasswordInput = $("#newPassword").val();
    let newPasswordConfirmInput = $("#newPasswordConfirm").val();

    if (newPasswordInput != newPasswordConfirmInput) {
      popupOpen("As senhas não coincidem");
      return;
    }

    if (newPasswordInput === oldPasswordInput) {
      popupOpen("Sua nova senha precisa ser diferente da atual!");
      return;
    }

    // Envia a solicitação AJAX para verificar o login
    $.post('alterPassword.php', { 
      oldPassword: oldPasswordInput, 
      newPassword: newPasswordInput
    }, function(response) {
      if (response.erro) {
        // Exibir a mensagem de erro na página HTML
        popupOpen(response.erro);
      }
      if (response.sucesso) {
        window.location.href = '../index.html';
      }
    }, 'json');
  });


  // Envia o formulário para deletar a conta
  $(".deleteAccountForm").submit(function(event) {
    event.preventDefault(); // Evita o comportamento padrão do formulário

    // Obtenha os valores dos campos de entrada
    let confirmPasswordOneInput = $("#confirmPasswordOne").val();
    let confirmPasswordTwoInput = $("#confirmPasswordTwo").val();

    if (confirmPasswordOneInput != confirmPasswordTwoInput) {
      popupOpen("As senhas não são iguais!");
      return;
    }

    // Envia a solicitação AJAX para verificar o login
    $.post('deleteAccount.php', { 
      confirmPassword: confirmPasswordOneInput,
    }, function(response) {
      if (response.erro) {
        // Exibir a mensagem de erro na página HTML
        popupOpen(response.erro);
      }
      if (response.sucesso) {
        window.location.href = '../index.html';
      }
    }, 'json');
  });

  });