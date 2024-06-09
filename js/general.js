$(document).ready(function () {
    timeStamp = document.getElementById("timeStamp");
    timeStamp.innerHTML = `<b>最後更新: 2024.06.09</b>`

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
    "日本 B2": 2,
    "TAT": 3,
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
    "葡萄牙PNB": 3,
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