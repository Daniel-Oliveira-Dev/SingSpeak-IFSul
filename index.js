// Funções JavaScript

// Verifica se a sessão está definida
function verifySession() {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
          if (xhr.status === 200) {
              if (xhr.responseText === 'Sessão ativa') {
                window.location.href = '/SingSpeak/musicPages/main.html';
              }
          }
      }
  };

  xhr.open('GET', 'userCodes/verifySession.php', true);
  xhr.send();
}

// Ativa o pop up com a mensagem identificada
function popUpOpen (mensagem) {
  new Howl({
        src: ['../assets/sounds/error.mp3'],
        volume: 1.0 // Volume (de 0.0 a 1.0)
    }).play();
    $(".popup").removeClass("animate__zoomOutDown");
    $(".popupContent").text(mensagem);
    $(".popup").css("visibility", "visible");
    $(".popup").addClass("animate__rubberBand");
    setTimeout(function () {
        $(".popup").removeClass("animate__rubberBand");
        $(".popup").addClass("animate__zoomOutDown");
        $(".userlevel").removeClass("animate__shakeX");
    }, 2000);
}

// Funções jQuery

// Carrega as funções quando a página é carregada
$(function(){
  // Verifica a sessão 
  verifySession();

  // Alterna a prioridade dos formulários
  $(".signupFormBox").click(function () {
    $(".signupFormBox").addClass("selectedForm");
    $(".loginFormBox").removeClass("selectedForm");
    $(".loginForm")[0].reset();
    $(document).on("click", function(e) {
      // Verifica se o clique não ocorreu dentro de um formulário com a classe "accessForms"
      if (!$(e.target).closest(".accessForms").length) {
          // Remove a classe "selectedForm" de todos os formulários
          $(".accessForms").removeClass("selectedForm");
      }
  });
  });

  $(".loginFormBox").click(function () {
    $(".loginFormBox").addClass("selectedForm");
    $(".signupFormBox").removeClass("selectedForm");
    $(".signupForm")[0].reset();
    $(document).on("click", function(e) {
      // Verifica se o clique não ocorreu dentro de um formulário com a classe "accessForms"
      if (!$(e.target).closest(".accessForms").length) {
          // Remove a classe "selectedForm" de todos os formulários
          $(".accessForms").removeClass("selectedForm");
      }
  });
  });

  // Verifica se os campos de login estão preenchidos para liberar o botão de Acessar
  $(".loginForm input").change(function(){
    if($("#loginPassword").val() && $("#loginUsername").val()) {
      $(".loginSubmit").prop("disabled", false);
    } else {
      $(".loginSubmit").prop("disabled", true);
    }
  });

  // Verifica se os campos de cadastro estão preenchidos para liberar o botão de Cadastrar
  $(".signupForm input").change(function(){
    if($("#signupPassword").val() && $("#signupUsername").val() && $("#signupEmail").val()) {
      $(".signupSubmit").prop("disabled", false);
    } else {
      $(".signupSubmit").prop("disabled", true);
    }
  });

  // Envia o formulário para verificar o login
   $(".loginSubmit").click(function(event) {
    event.preventDefault(); // Impede o envio padrão do formulário

    // Obtenha os valores dos campos de entrada
    let username = $("#loginUsername").val();
    let password = $("#loginPassword").val();

    // Envia a solicitação AJAX para verificar o login
    $.post('userCodes/acessUser.php', { loginUsername: username, loginPassword: password }, function(response) {
      if (response.erro) {
        // Exibir a mensagem de erro na página HTML
        popUpOpen(response.erro);
      } 
      if (response.sucesso) {
        // O login foi bem-sucedido, redirecionar para a página de usuário
        window.location.href = '/SingSpeak/musicPages/main.html';
      }
    }, 'json');
  });

  // Envia o formulário para verificar o cadastro
  $(".signupSubmit").click(function(event) {
    event.preventDefault(); // Impede o envio padrão do formulário

    // Obtenha os valores dos campos de entrada
    let username = $("#signupUsername").val();
    let email = $("#signupEmail").val();
    let password = $("#signupPassword").val();
    
    if (password.length < 6) {
      popUpOpen("Sua senha é muito curta! Mínimo de 6 caracteres.");
      return;
    }

    // Envia a solicitação AJAX para verificar o cadastro
    $.post('userCodes/registerUser.php', { signupUsername: username, signupEmail: email, signupPassword: password }, function(response) {
      if (response.erro) {
          // Exibir a mensagem de erro na página HTML
          popUpOpen(response.erro);
      } 
      if (response.sucesso) {
          // O registro foi bem-sucedido, redirecionar para a página de usuário ou fazer outra ação
          window.location.href = '/SingSpeak/musicPages/main.html';
      }
  }, 'json');
  });

});