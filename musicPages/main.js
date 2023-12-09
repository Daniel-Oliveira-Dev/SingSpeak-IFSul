// Funções

// Retorna as músicas presentes no Banco de Dados
function getMusicList() {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                let responseJson = JSON.parse(xhr.responseText);
                listMusics(responseJson.musicArray);
            }
        }
    };
  
    xhr.open('GET', '../musicCodes/getMusicList.php', true);
    xhr.send();
}

// Ativa o pop up com a mensagem identificada
function popUpOpen (mensagem) {
    $(".popup").removeClass("animate__hinge");
    $(".popupContent").text(mensagem);
    $(".popup").css("visibility", "visible");
    $(".popup").addClass("animate__rubberBand");
    setTimeout(function () {
        $(".popup").removeClass("animate__rubberBand");
        $(".popup").addClass("animate__hinge");
        $(".userlevel").removeClass("animate__shakeX");
    }, 3000);
}

// Busca as informações de uma música específica
function showMusic(idMusica) {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                let responseJson = JSON.parse(xhr.responseText);
                if (responseJson.musicArray) {
                    let coverToShow = "../assets/musicCovers/".concat(responseJson.musicArray.musicCover);
                    $(".musicArtist").text(responseJson.musicArray.artista);
                    $(".selectMusicCover img").attr("src", coverToShow);
                }
                if (responseJson.maiorPontuacao && responseJson.maiorPontuacao.length > 0 && responseJson.maiorPontuacao[0].hasOwnProperty("pontuacaoAdquirida")) {
                    $(".userMaxPoints").text("Pontuação Máxima: " + responseJson.maiorPontuacao[0].pontuacaoAdquirida);
                } else {
                    $(".userMaxPoints").text("Sem pontos nessa música!");
                }                
                if (responseJson.erro) {
                    popUpOpen(responseJson.erro);
                }
            }
        }
    };

    // Criar um objeto FormData e adicionar o idMusica a ele
    let formData = new FormData();
    formData.append('idMusica', idMusica);

    // Definir o método como POST e enviar o FormData
    xhr.open('POST', '../musicCodes/showMusic.php', true);
    xhr.send(formData);
}

// Verifica se a sessão está definida
function verifySession() {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                let responseJson = JSON.parse(xhr.responseText);
                if (responseJson.erro) {
                  window.location.href = '/SingSpeak/index.html';
                }
            }
        }
    };
  
    xhr.open('GET', '../userCodes/verifySession.php', true);
    xhr.send();
}

// Seleciona as informações públicas do usuário para a página utilizar
function assembleUser() {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                let responseJson = JSON.parse(xhr.responseText);
                assignUserInfo(responseJson.userArray);
                if (responseJson.levelUp) {
                    levelUpAlarm();
                }
                if (responseJson.accessOfDay === 1) {
                    popUpOpen("Você recebeu 15 pontos por seu acesso diário!");
                }
            }
        }
    };
  
    xhr.open('GET', '../userCodes/getMusicPageUserInfo.php', true);
    xhr.send();
}

// Avisa o usuário que ele subiu de nível
function levelUpAlarm() {
    const sound = new Howl({
        src: ['../assets/sounds/level_up.mp3'],
        volume: 0.5, // Volume (de 0.0 a 1.0),
        onplay: function () {
            $(".levelUpArea").toggleClass("levelUpInactive");
            $(".levelUpDiv").addClass("animate__bounce");
            $(".levelUpContent").text("Parabéns! Você subiu de nível!");
            $(".levelUpClose").click(function () {
            window.location.reload();
        });
        }
    }).play();
}

  
// Insere as informações do usuário na página
function assignUserInfo(userArray) {
    $(".userlevel").append(userArray.nomenclatura);
    $(".sideBarUsername").text(userArray.username);
    $(".userInfo").attr("data-idnivel", userArray.idNivel);
    // Carrega as músicas depois do usuário ser carregado
    getMusicList();
}

// Listar músicas baseadas no array
function listMusics(arrayMusics) {
    let divOriginal = $("#musicModel");
    divOriginal.remove();

    arrayMusics.forEach(music => {
        let divClone = divOriginal.clone();
        divClone.find(".musicName").text(music.nome);
        divClone.find(".musicLevel").text(music.nomenclatura);
        divClone.attr("data-idMusica", music.idMusica);
        divClone.attr("data-idnivel", music.idNivel);

        if ($("#userInfo").attr("data-idnivel") < music.idNivel) {
            divClone.addClass("unavailableMusic");
            divClone.find(".playButton").text("lock");
        }

        divClone.appendTo("#musicList"); // Adicione a div clonada à lista de músicas
    });

    // Define os atributos para exibir os detalhes da música clicada
    $(".musicBasicInfo").click(function(){
        let idMusica = $(this).closest(".musicModel").attr("data-idMusica");

        if(idMusica == $(".selectedMusicInfo").attr("data-idMusica")) {
            $(".selectedMusicInfo").css("visibility", "hidden");
            $(".selectedMusicInfo").attr("data-idMusica", "");
        } else {
            showMusic(idMusica);
            $(".selectedMusicInfo").css("visibility", "visible");
            $(".selectedMusicInfo").attr("data-idMusica", idMusica);
            
        }
    });

    // Encaminha o usuário para a página da música selecionada
    $(".playButton").click(function(){
        if ($(this).closest(".musicModel").hasClass("unavailableMusic")) {
            new Howl({
                src: ['../assets/sounds/error.mp3'],
                volume: 0.5 // Volume (de 0.0 a 1.0)
            }).play();
            popUpOpen("Você precisa subir de nível para acessar essa música!");
            $(".userlevel").addClass("animate__shakeX");
        } else {
            let idMusica = $(this).closest(".musicModel").attr("data-idMusica");
            new Howl({
                src: ['../assets/sounds/decide.mp3'],
                volume: 0.1, // Volume (de 0.0 a 1.0)
                onend: function() {
                    goToPlayPage(idMusica);
                }
            }).play();
        }
    });
}

// Envia o formulário para a página
function goToPlayPage(idMusica) {
    // Envia a solicitação AJAX para verificar o login
    $.post('../musicCodes/loadMusicPage.php', { 
        idMusica: idMusica
    }, function(response) {
      if (response.sucesso) {
        window.location.href = "musicMainPage.html";
      }
      if (response.erro) {
        popUpOpen(response.erro);
      }
    }, 'json');
}

// Carregamento inicial da página
$(function(){
    // Verifica a sessão do usuário
    verifySession();
    // Pega os dados do usuário para a página de login e lista as músicas
    assembleUser();
    
    // Encerra a sessão se o usuário clicar no botão "Sair"
    $("#buttonLogout").click(function () {
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    const response = JSON.parse(xhr.responseText);
                    if (response.sucesso) {
                        window.location.href = '../index.html';
                    } else {
                        popUpOpen(response.erro);
                    }
                }
            }
        };

        xhr.open('GET', '../userCodes/logout.php', true);
        xhr.send();
    });

    // Abre a Sidebar
    $(".sideBarButton").click(function () {
        $(".sideBar").toggleClass("openSideBar");

        if ($(".sideBarButton span").text() == "double_arrow") {
            $(".sideBarButton span").text("keyboard_double_arrow_left");
        } else {
            $(".sideBarButton span").text("double_arrow");
        }
    });

    // Redireciona para a página de músicas
    $(".sideBarUsername").click(function () {
        window.location.href = '/SingSpeak/userCodes/userpage.html';
    })

    // Redireciona para a página de usuário
    $(".sideBarUserPage").click(function () {
        window.location.href = '/SingSpeak/userCodes/userpage.html';
    })

    // Redireciona para a página de músicas
    $(".sideBarMusicPage").click(function () {
        window.location.href = '/SingSpeak/musicPages/main.html';
    })
});