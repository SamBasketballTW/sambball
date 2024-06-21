$(document).ready(function () {
    timeStamp = document.getElementById("timeStamp");
    timeStamp.innerHTML = `<b>最後更新: 2024.06.21</b>`

    test = ""
    // test = ".html"

    navbar_dropdown = document.getElementById("navbar-dropdown");
    nav = [
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
    for (let i = 0; i < nav.length; i++) {
        navbar_dropdown.innerHTML += `
        <li class="nav-item">
            <a class="nav-link" href="./${nav[i][0]}${test}">${nav[i][1]}</a>
        </li>`
    }

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
allTeams = [];
class Teams {
    constructor(gender = "", league = "", id = "", full_name_CN = "", short_name_CN = "", full_name_EN = "", short_name_EN = "", link = "") {
        this.gender = gender;
        this.league = league;
        this.id = id;
        this.full_name_CN = full_name_CN;
        this.short_name_CN = short_name_CN;
        this.full_name_EN = full_name_EN;
        this.short_name_EN = short_name_EN;
        this.link = link;

        allTeams.push(this);
    }

    name_CN(value){
        if(value == 'short'){
            return this.short_name_CN;
        }else if(value == 'full'){
            return this.full_name_CN;
        }
    }
    teamIndex(){
        return allTeams.indexOf(this);
    }

}
braves = new Teams('men', 'plg', 'braves', '臺北富邦勇士', '勇士');
kings = new Teams('men', 'plg', 'kings', '新北國王', '國王');
pilots = new Teams('men', 'plg', 'pilots', '桃園璞園領航猿', '領航猿');
lioneers = new Teams('men', 'plg', 'lioneers', '新竹御頂攻城獅', '攻城獅');
dreamers = new Teams('men', 'plg', 'dreamers', '福爾摩沙夢想家', '夢想家');
steelers = new Teams('men', 'plg', 'steelers', '高雄17直播鋼鐵人', '鋼鐵人');
dea = new Teams('men', 't1', 'dea', '新北中信特攻', '特攻');
mars = new Teams('men', 't1', 'mars', '臺北戰神', '戰神');
leopards = new Teams('men', 't1', 'leopards', '台啤永豐雲豹', '雲豹');
ghosthawks = new Teams('men', 't1', 'ghosthawks', '臺南台鋼獵鷹', '獵鷹');
aquas = new Teams('men', 't1', 'aquas', '高雄全家海神', '海神');
beer = new Teams('men', 'sbl', 'beer', '台灣啤酒', '台啤');
bank = new Teams('men', 'sbl', 'bank', '臺灣銀行', '臺銀');
yulon = new Teams('men', 'sbl', 'yulon', '裕隆納智捷', '裕隆');
bll = new Teams('men', 'sbl', 'bll', '彰化柏力力', '柏力力');
cathay = new Teams('women', 'wsbl', 'cathay', '國泰人壽', '國泰');
taipower = new Teams('women', 'wsbl', 'taipower', '台灣電力', '台電');
cht = new Teams('women', 'wsbl', 'cht', '中華電信', '電信');
taiyuen = new Teams('women', 'wsbl', 'taiyuen', '台元紡織', '台元');

braves.link = 'https://pleagueofficial.com/team/1';
kings.link = 'https://pleagueofficial.com/team/6';
pilots.link = 'https://pleagueofficial.com/team/2';
lioneers.link = 'https://pleagueofficial.com/team/3';
dreamers.link = 'https://pleagueofficial.com/team/4';
steelers.link = 'https://pleagueofficial.com/team/5';
dea.link = 'https://ctbcdea.com.tw/';
mars.link = 'https://taipeimars.com.tw/';
leopards.link = 'https://t-leopards.com/';
ghosthawks.link = 'https://ghosthawks.tw/';
aquas.link = 'https://ktown-aquas.com/';
beer.link = 'https://sleague.tw/team/1/76/714';
bank.link = 'https://sleague.tw/team/1/76/713';
yulon.link = 'https://sleague.tw/team/1/76/712';
bll.link = 'https://sleague.tw/team/1/76/711';
cathay.link = 'https://wsbl.meetagile.com/team/2/77/715';
taipower.link = 'https://wsbl.meetagile.com/team/2/77/716';
cht.link = 'https://wsbl.meetagile.com/team/2/77/717';
taiyuen.link = 'https://wsbl.meetagile.com/team/2/77/718';

function findTeam(team){
    for(let i = 0; i < allTeams.length;i++){
        if(allTeams[i].id == team){
            return allTeams[i]
        }
    }
    return -1;
}
class Leagues {
    constructor(gender = "", id = "", name = "", team_count = 0, teams = [], games = 0, playoff_teams = 0) {
        this.gender = gender;
        this.id = id;
        this.name = name;
        this.team_count = team_count;
        this.teams = teams;
        this.games = games;
        this.playoff_teams = playoff_teams;
    }
}
plg = new Leagues('men', 'plg', 'P. Leagues+');
t1 = new Leagues('men', 't1', 'T1 Leagues');
sbl = new Leagues('men', 'sbl', 'SBL 超級籃球聯賽');
wsbl = new Leagues('women', 'wsbl', 'WSBL 超級籃球聯賽');

plg.teams = [braves, kings, pilots, lioneers, dreamers, steelers];
plg.team_count = plg.teams.length;
plg.games = 40;
plg.playoff_teams = 4;

t1.teams = [dea, mars, leopards, ghosthawks, aquas];
t1.team_count = t1.teams.length;
t1.games = 28;
t1.playoff_teams = 4;

sbl.teams = [beer, bank, yulon, bll];
sbl.team_count = sbl.teams.length;
sbl.games = 30;
sbl.playoff_teams = 3;

wsbl.teams = [cathay, taipower, cht, taiyuen];
wsbl.team_count = wsbl.teams.length;
wsbl.games = 30;
wsbl.playoff_teams = 3;


games = {
    "plg": 40,
    "t1": 28,
    "sbl": 30,
    "wsbl": 30
}
po_teams = {
    "plg": 4,
    "t1": 4,
    "sbl": 3,
    "wsbl": 3
}
coach_EN_name = {
    "braves": "",
    "kings": " Ryan Marchand",
    "pilots": " Iurgi Caminos",
    "lioneers": " Milan Mitrović",
    "dreamers": " Jamie Pearlman",
    "steelers": "",
    "dea": "",
    "mars": "",
    "leopards": " Charles Dubé-Brais",
    "ghosthawks": " Raoul Korner",
    "aquas": "",
    "beer": "",
    "bank": "",
    "yulon": "",
    "bll": "",

    "cathay": "",
    "taipower": "",
    "cht": "",
    "taiyuen": ""
}
teamName_full_CN = {
    "braves": "臺北富邦勇士",
    "kings": "新北國王",
    "pilots": "桃園璞園領航猿",
    "lioneers": "新竹御頂攻城獅",
    "dreamers": "福爾摩沙夢想家",
    "steelers": "高雄17直播鋼鐵人",
    "dea": "新北中信特攻",
    "mars": "臺北戰神",
    "leopards": "台啤永豐雲豹",
    "ghosthawks": "臺南台鋼獵鷹",
    "aquas": "高雄全家海神",
    "beer": "台灣啤酒",
    "bank": "臺灣銀行",
    "yulon": "裕隆納智捷",
    "bll": "彰化柏力力",

    "cathay": "國泰人壽",
    "taiyuen": "台元紡織",
    "taipower": "台灣電力",
    "cht": "中華電信",

    "fa": "自由球員",
}
teamName_short_CN = {
    "braves": "勇士",
    "kings": "國王",
    "pilots": "領航猿",
    "lioneers": "攻城獅",
    "dreamers": "夢想家",
    "steelers": "鋼鐵人",
    "dea": "特攻",
    "mars": "戰神",
    "leopards": "雲豹",
    "ghosthawks": "獵鷹",
    "aquas": "海神",
    "beer": "台啤",
    "bank": "臺銀",
    "yulon": "裕隆",
    "bll": "柏力力",

    "cathay": "國泰",
    "taiyuen": "台元",
    "taipower": "台電",
    "cht": "電信"
}
team_link = {
    "braves": "https://pleagueofficial.com/team/1",
    "kings": "https://pleagueofficial.com/team/6",
    "pilots": "https://pleagueofficial.com/team/2",
    "lioneers": "https://pleagueofficial.com/team/3",
    "dreamers": "https://pleagueofficial.com/team/4",
    "steelers": "https://pleagueofficial.com/team/5",
    "dea": "https://ctbcdea.com.tw/",
    "mars": "https://taipeimars.com.tw/",
    "leopards": "https://t-leopards.com/",
    "ghosthawks": "https://ghosthawks.tw/",
    "aquas": "https://ktown-aquas.com/",
    "beer": "https://sleague.tw/team/1/76/714",
    "bank": "https://sleague.tw/team/1/76/713",
    "yulon": "https://sleague.tw/team/1/76/712",
    "bll": "https://sleague.tw/team/1/76/711",
    "cathay": "https://wsbl.meetagile.com/team/2/77/715",
    "taipower": "https://wsbl.meetagile.com/team/2/77/716",
    "cht": "https://wsbl.meetagile.com/team/2/77/717",
    "taiyuen": "https://wsbl.meetagile.com/team/2/77/718"
}
order = {
    "本土": 1,
    "華裔": 2,
    "外籍生": 3,
    "洋將": 4,
    "亞外": 5,

    "CBA": 1,
    "日本 B1": 2,
    "日本 B2": 3,
    "日本 B3": 4,
    "braves": 11,
    "kings": 12,
    "pilots": 13,
    "lioneers": 14,
    "dreamers": 15,
    "steelers": 16,
    "dea": 21,
    "mars": 22,
    "leopards": 23,
    "ghosthawks": 24,
    "aquas": 25,
    "beer": 31,
    "bank": 32,
    "yulon": 33,
    "bll": 34,

    "WCBA": 1,
    "WKBL": 2,
    "葡萄牙 PNB": 3,
    "cathay": 4,
    "taipower": 5,
    "cht": 6,
    "taiyuen": 7,

    "fa": 40
}
league_teams = {
    'plg': 6,
    't1': 5,
    'sbl': 4,
    'wsbl': 4
}
plg_teams = {
    1: 'braves',
    2: 'kings',
    3: 'pilots',
    4: 'lioneers',
    5: 'dreamers',
    6: 'steelers'
}
t1_teams = {
    1: 'dea',
    2: 'mars',
    3: 'leopards',
    4: 'ghosthawks',
    5: 'aquas'
}
sbl_teams = {
    1: 'beer',
    2: 'bank',
    3: 'yulon',
    4: 'bll'
}
wsbl_teams = {
    1: 'cathay',
    2: 'taipower',
    3: 'cht',
    4: 'taiyuen'
}