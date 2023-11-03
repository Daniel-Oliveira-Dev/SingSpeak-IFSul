// Funções

// Verifica se a sessão está definida
function verifySession() {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                if (xhr.responseText === 'Sessão não encontrada') {
                  window.location.href = '../index.html';
                }
            }
        }
    };
  
    xhr.open('GET', '../userCodes/verifySession.php', true);
    xhr.send();
}

// Retorna a música selecionada
function assembleMusic() {
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    let responseJson = JSON.parse(xhr.responseText);
                    if (responseJson.erro) {
                        $("body").css("visibility", "hidden");
                        setTimeout(function() {
                            alert(responseJson.erro);
                        }, 10);
                        window.location.href = '/SingSpeak/main.html';
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
}

// Lista o ranking de pontos
function rankRecordings(rankArray) {

}

// Carregamento inicial da página
$(function(){
    // Verifica se a sessão está ativa
    verifySession();

    // Busca as informações da música
    assembleMusic();

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
})