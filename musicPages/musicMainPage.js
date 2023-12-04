// Funções

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
            }
        }
    };
  
    xhr.open('GET', '../userCodes/getMusicPageUserInfo.php', true);
    xhr.send();
}

// Insere as informações do usuário na página
function assignUserInfo(userArray) {
    $(".sideBarUsername").text(userArray.username);
}

// Retorna a música selecionada
function assembleMusic() {
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    let responseJson = JSON.parse(xhr.responseText);
                    if (responseJson.erro) {
                        $("mainDiv").css("visibility", "hidden");
                        setTimeout(function() {
                            alert(responseJson.erro);
                        }, 10);
                        window.location.href = '/SingSpeak/musicPages/main.html';
                    }
                    if (responseJson.musicArray) {
                        assignMusicInfo(responseJson.musicArray);
                    }
                }
            }
        };
      
        xhr.open('GET', '../musicCodes/getLoadedMusic.php', true);
        xhr.send();
}

// Insere as informações da música na tela
function assignMusicInfo(musicArray) {
    $(".musicTitle").text(musicArray.nome);
    let srcCover = "../assets/musicCovers/" + musicArray.musicCover;
    $(".musicCover").find("img").attr("src", srcCover);
    let srcYouTube = "https://www.youtube.com/embed/" + musicArray.codYouTube;
    $("#ytPlayer").attr("src", srcYouTube);
    $(".musicArtistYear").text(musicArray.artista + ", " + musicArray.ano);
    $(".musicInfo").attr("data-idmusica", musicArray.idMusica);
    $(".musicInfo").attr("data-idnivel", musicArray.idNivel);
    $(document). prop( 'title' , musicArray.nome);

    getMusicRanking();
}

// Retorna o array com o ranking do servidor
function getMusicRanking() {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                let responseJson = JSON.parse(xhr.responseText);
                if (responseJson.rankArray && responseJson.rankArray.length > 0) {
                    rankRecordings(responseJson.rankArray);
                } else {
                    $(".posicaoPontuacao").text("Sem registros nesta música!");
                }
            }
        }
    };

    xhr.open('GET', '../musicCodes/getRankingOfMusic.php', true);
    xhr.send();
}

// Lista o ranking de pontos
function rankRecordings(rankArray) {
    let divOriginal = $(".posicaoRanking");
    divOriginal.remove();

    let posicao = 1;
    rankArray.forEach(rank => {
        let divClone = divOriginal.clone();
        divClone.find(".posicaoPontuacao").text(posicao + "º - " + rank.pontuacaoAdquirida + " pontos");
        divClone.find(".posicaoUsername").text(rank.username);
        posicao++;

        divClone.appendTo(".ranking");
    });
}

// Carregamento inicial da página
$(function(){
    // Verifica se a sessão está ativa
    verifySession();

    // Busca as informações da música
    assembleMusic();

    // Retorna os dados do usuário
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
                        alert(response.erro);
                    }
                }
            }
        };

        xhr.open('GET', '../userCodes/logout.php', true);
        xhr.send();
    });

    // Acessa o gravador de música
    $(".playButtonIcon").click(function () {
        window.location.href = 'http://localhost:3000';
    });
    
    // Redireciona para a página de músicas
    $(".sideBarUsername").click(function () {
        window.location.href = '../userCodes/userpage.html';
    })

    $(".sideBarUserPage").click(function () {
        window.location.href = '../userCodes/userpage.html';
    })

    $(".sideBarMusicPage").click(function () {
        window.location.href = 'main.html';
    })
})