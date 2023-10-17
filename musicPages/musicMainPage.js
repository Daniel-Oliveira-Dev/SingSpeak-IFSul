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
                        alert(responseJson.erro);
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
    let srcCover = "../" + musicArray.musicCover;
    $(".musicCover").find("img").attr("src", srcCover);
    let srcYouTube = "https://www.youtube.com/embed/" + musicArray.codYouTube;
    $("#ytPlayer").attr("src", srcYouTube);
    $(".musicArtistYear").text(musicArray.artista + ", " + musicArray.ano);
    $(".musicInfo").attr("data-idmusica", musicArray.idMusica);
    $(".musicInfo").attr("data-idnivel", musicArray.idNivel);
}

// Carregamento inicial da página
$(function(){
    // Verifica se a sessão está ativa
    verifySession();

    // Busca as informações da música
    assembleMusic();
})