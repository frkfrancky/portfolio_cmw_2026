if(isDark){
    document.body.classList.add("dark");
}else{
    document.body.classList.add("light");
}


let languagedata = {
    "fr": {
        "nom": "Rasataharisoa",
        "prenom": "Francky",
        "presentation": "Je suis un étudiant en Master 2 CMW",
    },
    "en": {
        "nom": "Rasataharisoa",
        "prenom": "Francky",
        "presentation": "I am a Master 2 CMW student",
    },
    "kr": {
        "nom": "Rasataharisoa",
        "prenom": "Francky",
        "presentation": "저는 Master 2 CMW 학생입니다",
    }
};

// Fonction qui met à jour le texte selon la langue choisie
function changerLangue(code) {
    let langue = languagedata[code];
    Object.keys(langue).forEach(function(cle){
        document.querySelector("#" + cle).innerHTML = langue[cle];
    });
}

changerLangue("fr");

// Boutons
document.querySelector("#langue-fr").addEventListener("click", function(){
    changerLangue("fr");
});

document.querySelector("#langue-en").addEventListener("click", function(){
    changerLangue("en");
});

document.querySelector("#langue-kr").addEventListener("click", function(){
    changerLangue("kr");
});
