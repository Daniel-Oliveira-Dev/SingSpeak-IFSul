// Funções jQuery

$(function(){
  // Alterna a prioridade dos Formulários
  $(".loginForm").click(function(){
    $(this).removeClass("formBehind").addClass("formFront");
    $(".signupForm").removeClass("formFront").addClass("formBehind");
  });
  $(".signupForm").click(function(){
    $(this).removeClass("formBehind").addClass("formFront");
    $(".loginForm").removeClass("formFront").addClass("formBehind");
  });

  $("#loginForm input").change(function(){
    if($("#loginPassword").val() && $("#loginUsername").val()) {
      $("#loginSubmit").prop("disabled", false);
    } else {
      $("#loginSubmit").prop("disabled", true);
    }
  });

  $("#signupForm input").change(function(){
    if($("#signupPassword").val() && $("#signupUsername").val() && $("#signupEmail").val()) {
      $("#signupSubmit").prop("disabled", false);
    } else {
      $("#signupSubmit").prop("disabled", true);
    }
  });
  
});

// Funções JavaScript
