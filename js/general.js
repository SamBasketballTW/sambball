$(document).ready(function () {
    timeStamp = document.getElementById('timeStamp');
    timeStamp.innerHTML = `<b>最後更新: 2024.07.07</b>`

    test = ''
    // test = '.html'

    navbar_dropdown = document.getElementById('navbar-dropdown');
    navs = [
        ['playoffs', '季後賽'],
        ['standings', '戰績'],
        ['rosters', '球隊陣容'],
        ['players', '現役球員'],
        ['contracts', '合約'],
        ['drafts', '選秀'],
        ['trades', '交易'],
        ['free-agents', '自由球員'],
        ['us-players', '旅美學生']
    ]
    navs.forEach(nav => {
        navbar_dropdown.innerHTML += `
        <li class="nav-item">
            <a class="nav-link" href="./${nav[0]}${test}">${nav[1]}</a>
        </li>`
    });

    footerBody = document.getElementById("footerContent");
    footerBody.innerHTML = `
    <div class="container" style="padding:1.5rem;text-align:center;">
        <a style="color:white;">
            山姆籃球
        </a>
        <br>
        <a style="color:white;"
            href="https://www.instagram.com/sam_basketball_tw/" target="_blank">
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
class Teams {
    constructor(gender, league, id, full_name_CN, short_name_CN, coach_EN = '', url = '') {
        this.gender = gender;
        this.league = league;
        this.id = id;
        this.coach_EN = coach_EN;
        this.full_name_CN = full_name_CN;
        this.short_name_CN = short_name_CN;
        this.coach_EN = coach_EN;
        this.url = url;
    }

    name_CN(value) {
        if (value == 'short') {
            return this.short_name_CN;
        } else if (value == 'full') {
            return this.full_name_CN;
        }
    }
    teamIndex() {
        return allTeams.indexOf(this);
    }
}
braves = new Teams('men', 'plg', 'braves', '臺北富邦勇士', '勇士');
kings = new Teams('men', 'plg', 'kings', '新北國王', '國王', 'Ryan Marchand');
pilots = new Teams('men', 'plg', 'pilots', '桃園璞園領航猿', '領航猿', 'Iurgi Caminos');
lioneers = new Teams('men', 'plg', 'lioneers', '新竹御頂攻城獅', '攻城獅', 'Milan Mitrović');
dreamers = new Teams('men', 'plg', 'dreamers', '福爾摩沙夢想家', '夢想家', 'Jamie Pearlman');
steelers = new Teams('men', 'plg', 'steelers', '高雄17直播鋼鐵人', '鋼鐵人');
dea = new Teams('men', 't1', 'dea', '新北中信特攻', '特攻');
mars = new Teams('men', 't1', 'mars', '臺北戰神', '戰神');
leopards = new Teams('men', 't1', 'leopards', '台啤永豐雲豹', '雲豹', 'Charles Dubé-Brais');
ghosthawks = new Teams('men', 't1', 'ghosthawks', '臺南台鋼獵鷹', '獵鷹', 'Raoul Korner');
aquas = new Teams('men', 't1', 'aquas', '高雄全家海神', '海神');
beer = new Teams('men', 'sbl', 'beer', '台灣啤酒', '台啤');
bank = new Teams('men', 'sbl', 'bank', '臺灣銀行', '臺銀');
yulon = new Teams('men', 'sbl', 'yulon', '裕隆納智捷', '裕隆');
bll = new Teams('men', 'sbl', 'bll', '彰化柏力力', '柏力力');
cathay = new Teams('women', 'wsbl', 'cathay', '國泰人壽', '國泰');
taipower = new Teams('women', 'wsbl', 'taipower', '台灣電力', '台電');
cht = new Teams('women', 'wsbl', 'cht', '中華電信', '電信');
taiyuen = new Teams('women', 'wsbl', 'taiyuen', '台元紡織', '台元');

allTeams = [
    braves, kings, pilots, lioneers, dreamers, steelers,
    dea, mars, leopards, ghosthawks, aquas,
    beer, bank, yulon, bll,
    cathay, taipower, cht, taiyuen
]
plgTeams = [braves, kings, pilots, lioneers, dreamers, steelers];
t1Teams = [dea, mars, leopards, ghosthawks, aquas];
sblTeams = [beer, bank, yulon, bll];
wsblTeams = [cathay, taipower, cht, taiyuen];

braves.url = 'https://pleagueofficial.com/team/1';
kings.url = 'https://pleagueofficial.com/team/6';
pilots.url = 'https://pleagueofficial.com/team/2';
lioneers.url = 'https://pleagueofficial.com/team/3';
dreamers.url = 'https://pleagueofficial.com/team/4';
steelers.url = 'https://pleagueofficial.com/team/5';
dea.url = 'https://ctbcdea.com.tw/';
mars.url = 'https://taipeimars.com.tw/';
leopards.url = 'https://t-leopards.com/';
ghosthawks.url = 'https://ghosthawks.tw/';
aquas.url = 'https://ktown-aquas.com/';
beer.url = 'https://sleague.tw/team/1/76/714';
bank.url = 'https://sleague.tw/team/1/76/713';
yulon.url = 'https://sleague.tw/team/1/76/712';
bll.url = 'https://sleague.tw/team/1/76/711';
cathay.url = 'https://wsbl.meetagile.com/team/2/77/715';
taipower.url = 'https://wsbl.meetagile.com/team/2/77/716';
cht.url = 'https://wsbl.meetagile.com/team/2/77/717';
taiyuen.url = 'https://wsbl.meetagile.com/team/2/77/718';

function findTeam(team) {
    for (let i = 0; i < allTeams.length; i++) {
        if (allTeams[i].id == team) {
            return allTeams[i]
        }
    }
    return -1;
}
order = {
    '本土': 1,
    '華裔': 2,
    '外籍生': 3,
    '特案外籍生': 4,
    '亞外': 5,
    '洋將': 6
}