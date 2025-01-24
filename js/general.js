$(document).ready(function () {
    timeStamp = document.getElementById('timeStamp');
    timeStamp.innerHTML = `<b>最後更新: 2025.01.24 15:30</b>`

    test = ''
    // test = '.html'

    navbar_dropdown = document.getElementById('navbar-dropdown');
    navs = [
        ['', '球隊陣容'],
        ['players', '現役球員'],
        ['free-agents', '自由球員'],
        ['contracts', '合約'],
        ['drafts', '選秀'],
        ['trades', '交易'],
        ['us-players', '旅美大學生']
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
        </a>&nbsp;
        <a style="color:white;"
            href="https://www.instagram.com/sam_basketball_tw/" target="_blank">
            <i class="bi bi-instagram" style="color:white; font-size: 18px;"></i>
            sam_basketball_tw&nbsp;
        </a>
        <br>
        <a style="color:white; font-size:12px;">本網站僅供學習、展示之用，若有侵權，請連絡告知</a>
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
class PlayerCount {
    constructor(id, filter, men_count = 0, women_count = 0) {
        this.id = id;
        this.filter = filter;
        this.men_count = men_count;
        this.women_count = women_count;
    }
}

braves = new Team('men', 'PLG', 'braves', '臺北富邦勇士', '勇士', '執行教練: 吳永仁');
pilots = new Team('men', 'PLG', 'pilots', '桃園璞園領航猿', '領航猿', '總教練: 卡米諾斯 Iurgi Caminos');
ghosthawks = new Team('men', 'PLG', 'ghosthawks', '台鋼獵鷹', '獵鷹', '總教練: 柯納 Raoul Korner');
steelers = new Team('men', 'PLG', 'steelers', '高雄鋼鐵人', '鋼鐵人', '總教練: 邱大宗');
mars = new Team('men', 'TPBL', 'mars', '臺北台新戰神', '戰神', '總教練: 許皓程');
kings = new Team('men', 'TPBL', 'kings', '新北國王', '國王', '總教練: 萊恩 Ryan Marchand');
dea = new Team('men', 'TPBL', 'dea', '新北中信特攻', '特攻', '執行教練: Momir Ratković');
leopards = new Team('men', 'TPBL', 'leopards', '桃園台啤永豐雲豹', '雲豹', '總教練: 查爾斯 Charles Dubé-Brais');
lioneers = new Team('men', 'TPBL', 'lioneers', '新竹御頂攻城獅', '攻城獅', '總教練: 威森 Wesam Al-Sous');
dreamers = new Team('men', 'TPBL', 'dreamers', '福爾摩沙夢想家', '夢想家', '總教練: 皮爾曼 Jamie Pearlman');
aquas = new Team('men', 'TPBL', 'aquas', '高雄全家海神', '海神', '總教練: 費雪 Mathias Fischer');
beer = new Team('men', 'SBL', 'beer', '台灣啤酒', '台啤', '總教練: 劉孟竹');
bank = new Team('men', 'SBL', 'bank', '臺灣銀行', '臺銀', '總教練: 程恩傑');
yulon = new Team('men', 'SBL', 'yulon', '裕隆集團', '裕隆', '執行教練: 李啟億');
bll = new Team('men', 'SBL', 'bll', '彰化璞園柏力力', '柏力力', '總教練: 吳俊雄');
cathay = new Team('women', 'WSBL', 'cathay', '國泰人壽', '國泰', '總教練: 鄭慧芸');
taipower = new Team('women', 'WSBL', 'taipower', '台灣電力', '台電', '教練: 陳萓峰');
cht = new Team('women', 'WSBL', 'cht', '中華電信', '電信', '教練: 楊志豪');
taiyuen = new Team('women', 'WSBL', 'taiyuen', '台元紡織', '台元', '執行教練: 邱啟益');

plgTeams = [braves, pilots, ghosthawks, steelers];
tpblTeams = [mars, dea, kings, leopards, lioneers, dreamers, aquas];
sblTeams = [beer, bank, yulon, bll];
wsblTeams = [cathay, taipower, cht, taiyuen];

allTeams = plgTeams.concat(tpblTeams, sblTeams, wsblTeams);

braves.url = 'https://pleagueofficial.com/team/1';
pilots.url = 'https://pleagueofficial.com/team/2';
ghosthawks.url = 'https://pleagueofficial.com/team/7';
steelers.url = 'https://pleagueofficial.com/team/5';
mars.url = 'https://taipeimars.com.tw/';
dea.url = 'https://ctbcdea.com.tw/';
kings.url = 'https://kings.tpbl.basketball/';
leopards.url = 'https://t-leopards.com/';
lioneers.url = 'https://lioneers.tpbl.basketball/';
dreamers.url = 'https://dreamers.tpbl.basketball/';
aquas.url = 'https://ktown-aquas.com/';
beer.url = 'https://sleague.tw/squad/10731';
bank.url = 'https://sleague.tw/squad/10732';
yulon.url = 'https://sleague.tw/squad/10729';
bll.url = 'https://sleague.tw/squad/10730';
cathay.url = 'https://wsbl.meetagile.com/squad/10736';
taipower.url = 'https://wsbl.meetagile.com/squad/10737';
cht.url = 'https://wsbl.meetagile.com/squad/10734';
taiyuen.url = 'https://wsbl.meetagile.com/squad/10735';

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
    '亞外': 4,
    '洋將': 5
}