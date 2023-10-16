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
    $(".username").append(userArray.username);
    $(".userlevel").append(userArray.nomenclatura);
    $(".userInfo").attr("data-idnivel", userArray.idNivel);
  }

  // Listar músicas baseadas no array
  function listMusics(arrayMusics) {
    let divOriginal = $("#musicModel");

    arrayMusics.forEach(music => {
        let divClone = divOriginal.clone();
        divClone.find(".musicName").text(music.nome);
        divClone.attr("data-artist", music.artista);
        divClone.attr("data-idnivel", music.idNivel);
        divClone.attr("data-cover", music.musicCover);

        if ($("#userInfo").attr("data-idnivel") < music.idNivel) {
            divClone.addClass("unavailableMusic");
        }

        divClone.appendTo("#musicList"); // Adicione a div clonada à lista de músicas
    });

    divOriginal.remove();
    
    // Define os atributos para os botões de play
    $(".playButton").click(function(){
        let artistToShow = $(this).closest(".musicModel").attr("data-artist");
        let coverToShow = $(this).closest(".musicModel").attr("data-cover");
        $(".musicArtist").text(artistToShow);
        $(".selectMusicCover img").attr("src", coverToShow);
    });
    }

// Carregamento inicial da página
$(function(){
    // Verifica a sessão do usuário
    verifySession();
    // Pega os dados do usuário para a página de login
    assembleUser();

    // Lista as músicas do sistema
    getMusicList();
    
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
});