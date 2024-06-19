$(document).ready(function () {
    timeStamp = document.getElementById("timeStamp");
    timeStamp.innerHTML = `<b>最後更新: 2024.06.19</b>`

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
class league {
    constructor(gender = "", filter = "", name = "", team_count = 0, games = 0, playoff_teams = 0) {
        this.gender = gender;
        this.filter = filter;
        this.name = name;
        this.team_count = team_count;
        this.games = games;
        this.playoff_teams = playoff_teams;
    }
}
plg = new league('men', 'plg', 'P. LEAGUE+', 6, 40, 4);
t1 = new league('men', 't1', 'T1 LEAGUE', 5, 28, 4);
sbl = new league('men', 'sbl', 'SBL 超級籃球聯賽', 4, 30, 3);
wsbl = new league('women', 'wsbl', 'WSBL 超級籃球聯賽', 4, 30, 3);

class team {
    constructor(gender = "", league = "", filter = "", full_name_CN = "", short_name_CN = "", full_name_EN = "", short_name_EN = "", url = "") {
        this.gender = gender;
        this.league = league;
        this.filter = filter;
        this.full_name_CN = full_name_CN;
        this.short_name_CN = short_name_CN;
        this.full_name_EN = full_name_EN;
        this.short_name_EN = short_name_EN;
        this.url = url;
    }
}
braves = new team('men', 'plg', 'braves', '臺北富邦勇士', '勇士');
kings = new team('men', 'plg', 'kings', '新北國王', '國王');
pilots = new team('men', 'plg', 'pilots', '桃園璞園領航猿', '領航猿');
lioneers = new team('men', 'plg', 'lioneers', '新竹御頂攻城獅', '攻城獅');
dreamers = new team('men', 'plg', 'dreamers', '福爾摩沙夢想家', '夢想家');
steelers = new team('men', 'plg', 'steelers', '高雄17直播鋼鐵人', '鋼鐵人');
dea = new team('men', 't1', 'dea', '新北中信特攻', '特攻');
mars = new team('men', 't1', 'mars', '臺北戰神', '戰神');
leopards = new team('men', 't1', 'leopards', '台啤永豐雲豹', '雲豹');
ghosthawks = new team('men', 't1', 'ghosthawks', '臺南台鋼獵鷹', '獵鷹');
aquas = new team('men', 't1', 'aquas', '高雄全家海神', '海神');
beer = new team('men', 'sbl', 'beer', '台灣啤酒', '台啤');
bank = new team('men', 'sbl', 'bank', '臺灣銀行', '臺銀');
yulon = new team('men', 'sbl', 'yulon', '裕隆納智捷', '裕隆');
bll = new team('men', 'sbl', 'bll', '彰化柏力力', '柏力力');
cathay = new team('women', 'wsbl', 'cathay', '國泰人壽', '國泰');
taipower = new team('women', 'wsbl', 'taipower', '台灣電力', '台電');
cht = new team('women', 'wsbl', 'cht', '中華電信', '電信');
taiyuen = new team('women', 'wsbl', 'taiyuen', '台元紡織', '台元');

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