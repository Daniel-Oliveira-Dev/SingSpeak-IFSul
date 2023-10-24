// Funções

// Retorna as músicas presentes no Banco de Dados
function getMusicList(userLevel) {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                let responseJson = JSON.parse(xhr.responseText);
                listMusics(responseJson.musicArray);
            }
        }
    };
  
    xhr.open('GET', 'musicCodes/getMusicList.php', true);
    xhr.send();
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

// Seleciona as informações públicas do usuário para a página utilizar
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
  
    xhr.open('GET', 'userCodes/getMusicPageUserInfo.php', true);
    xhr.send();
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
        divClone.attr("data-idMusica", music.idMusica);
        divClone.attr("data-artist", music.artista);
        divClone.attr("data-idnivel", music.idNivel);
        divClone.attr("data-cover", music.musicCover);

        if ($("#userInfo").attr("data-idnivel") < music.idNivel) {
            divClone.addClass("unavailableMusic");
        }

        divClone.appendTo("#musicList"); // Adicione a div clonada à lista de músicas
    });

    // Define os atributos para exibir os detalhes da música clicada
    $(".musicName").click(function(){
        let artistToShow = $(this).closest(".musicModel").attr("data-artist");
        let coverToShow = $(this).closest(".musicModel").attr("data-cover");
        $(".musicArtist").text(artistToShow);
        $(".selectMusicCover img").attr("src", coverToShow);
    });

    // Encaminha o usuário para a página da música selecionada
    $(".playButton").click(function(){
        let idMusica = $(this).closest(".musicModel").attr("data-idMusica");
        goToPlayPage(idMusica);
    })
    }

// Envia o formulário para a página
function goToPlayPage(idMusica) {
    // Envia a solicitação AJAX para verificar o login
    $.post('musicCodes/loadMusicPage.php', { 
        idMusica: idMusica
    }, function(response) {
      if (response.sucesso) {
        window.location.href = "musicPages/musicMainPage.html";
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

    // Abre a Sidebar
    $(".sideBarButton").click(function () {
        $(".sideBar").toggleClass("open");
    })

    // Redireciona para a página de músicas
    $(".sideBarUsername").click(function () {
        window.location.href = '/SingSpeak/userpage.html';
    })

    $(".sideBarUserPage").click(function () {
        window.location.href = '/SingSpeak/userpage.html';
    })

    $(".sideBarMusicPage").click(function () {
        window.location.href = '/SingSpeak/main.html';
    })
});