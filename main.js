$(function(){
    let divOriginal = document.getElementById("musicModel");

    let divClone1 = divOriginal.cloneNode(true);
    let divClone2 = divOriginal.cloneNode(true);
    let divClone3 = divOriginal.cloneNode(true);
    let divClone4 = divOriginal.cloneNode(true);

    $(divClone1).find(".musicName").text("Musica Gu");

    document.getElementById("musicList").appendChild(divClone1);
    document.getElementById("musicList").appendChild(divClone2);
    document.getElementById("musicList").appendChild(divClone3);
    document.getElementById("musicList").appendChild(divClone4);
});