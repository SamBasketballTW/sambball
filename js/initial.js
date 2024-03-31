$(document).ready(function () {
    if (window.innerWidth <= 450) {
        document.getElementById("index").innerHTML = `&nbsp;&nbsp;<img src="../asset/images/logo.png" class="icon"> 首頁`
    } else if (window.innerWidth > 450) {
        document.getElementById("index").innerHTML = `&nbsp;&nbsp;<img src="../asset/images/logo.png" class="icon"> 山姆籃球 SamBasketballTW`
    }

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
$(document).ready(function () {

    footerBody = document.getElementById("footerContent");
    timeStamp = document.getElementById("timeStamp");
    timeStamp.innerHTML = `
    <b>更新日期: 2024.03.31</b>`
    footerBody.innerHTML = `
    <div class="container" style="padding:1.5rem;text-align:center;">
                    <a style="color:white;">
                        山姆籃球
                    </a>
                    <br>
                    <a style="color:white;"
                        href="https://www.instagram.com/sam_basketball_tw/">
                        <i class="bi bi-instagram" style="color:white; font-size: 18px;"></i>
                        sam_basketball_tw&nbsp;
                    </a>
                    <a style="color:white;"
                        href="mailto:sambasketballtw@gmail.com"> 
                        <i class="bi bi-envelope-open" style="color:white; font-size: 18px;"></i>
                        Gmail
                    </a>
                    <br>
                    <a style="color:white; font-size:12px;">All rights reserved © 2024</a>

    </div>`
});