$(document).ready(function () {
    men_html = document.getElementById('team-dropdown_m')
    women_html = document.getElementById('team-dropdown_w')

    teams = [];
    if (men_html) {
        teams = ['braves', 'kings', 'pilots', 'lioneers', 'dreamers', 'steelers',
            'dea', 'mars', 'leopards', 'ghosthawks', 'aquas',
            'beer', 'trust', 'yulon', 'bll'];
        gender = "men"
    } else if (women_html) {
        teams = ['cathay', 'power', 'telecom', 'taiyuen'];
        gender = "women"
    }

    for (let i = 0; i < teams.length; i++) {
        menu = document.getElementById("menu_" + teams[i]);
        menu.innerHTML += `<img src="../asset/images/${gender}/${teams[i]}.png" alt="${teams[i]}" class="teamicon">${cn_teamName[teams[i]]}</a></li>`
    }
});