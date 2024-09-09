$(document).ready(function () {
    timeStamp = document.getElementById('timeStamp');
    timeStamp.innerHTML = `<b>最後更新: 2024.09.09 17:00</b>`

    test = ''
    // test = '.html'

    navbar_dropdown = document.getElementById('navbar-dropdown');
    navs = [
        ['rosters', '球隊陣容'],
        ['players', '現役球員'],
        ['free-agents', '自由球員'],
        ['contracts', '合約'],
        ['drafts', '選秀'],
        ['trades', '交易'],
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
class Team {
    constructor(gender, league, id, full_name_CN, short_name_CN, coach = '', url = '') {
        this.gender = gender;
        this.league = league;
        this.id = id;
        this.full_name_CN = full_name_CN;
        this.short_name_CN = short_name_CN;
        this.coach = coach;
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
braves = new Team('men', 'plg', 'braves', '臺北富邦勇士', '勇士', '執行教練: 吳永仁');
pilots = new Team('men', 'plg', 'pilots', '桃園璞園領航猿', '領航猿', '總教練: 卡米諾斯 Iurgi Caminos');
ghosthawks = new Team('men', 'plg', 'ghosthawks', '臺南台鋼獵鷹', '獵鷹', '總教練: 柯納 Raoul Korner');
steelers = new Team('men', 'plg', 'steelers', '高雄17直播鋼鐵人', '鋼鐵人', '總教練: 邱大宗');
mars = new Team('men', 'tpbl', 'mars', '臺北戰神', '戰神', '總教練: 許皓程');
kings = new Team('men', 'tpbl', 'kings', '新北國王', '國王', '總教練: 萊恩 Ryan Marchand');
dea = new Team('men', 'tpbl', 'dea', '新北中信特攻', '特攻', '總教練: 李逸驊');
leopards = new Team('men', 'tpbl', 'leopards', '桃園台啤永豐雲豹', '雲豹', '總教練: 查爾斯 Charles Dubé-Brais');
lioneers = new Team('men', 'tpbl', 'lioneers', '新竹御頂攻城獅', '攻城獅', '總教練: 密特羅維奇 Milan Mitrović');
dreamers = new Team('men', 'tpbl', 'dreamers', '福爾摩沙夢想家', '夢想家', '總教練: 皮爾曼 Jamie Pearlman');
aquas = new Team('men', 'tpbl', 'aquas', '高雄全家海神', '海神', '總教練: 費雪 Mathias Fischer');
beer = new Team('men', 'sbl', 'beer', '台灣啤酒', '台啤', '總教練: 楊志豪');
bank = new Team('men', 'sbl', 'bank', '臺灣銀行', '臺銀', '代理總教練: 程恩傑');
yulon = new Team('men', 'sbl', 'yulon', '裕隆納智捷', '裕隆', '執行教練: 李啟億');
bll = new Team('men', 'sbl', 'bll', '彰化柏力力', '柏力力', '總教練: 吳俊雄');
cathay = new Team('women', 'wsbl', 'cathay', '國泰人壽', '國泰', '總教練: 鄭慧芸');
taipower = new Team('women', 'wsbl', 'taipower', '台灣電力', '台電', '教練: 陳萓峰');
cht = new Team('women', 'wsbl', 'cht', '中華電信', '電信', '教練: 柯孟儀');
taiyuen = new Team('women', 'wsbl', 'taiyuen', '台元紡織', '台元', '執行教練: 邱啟益');

plgTeams = [braves, pilots, ghosthawks, steelers];
tpblTeams = [mars, kings, dea, leopards, lioneers, dreamers, aquas];
sblTeams = [beer, bank, yulon, bll];
wsblTeams = [cathay, taipower, cht, taiyuen];

allTeams = plgTeams.concat(tpblTeams, sblTeams, wsblTeams);

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