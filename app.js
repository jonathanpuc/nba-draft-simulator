/****************************************
                Elements
****************************************/
var profileHolder = document.getElementById('profile-holder');
var playersList = document.getElementById('draft-list');
var currentPick = document.getElementById('currently-picking');
var container = document.getElementById('container');
var app = document.getElementById('app');
var welcome = document.getElementById('welcome');
var selectingLogo = document.getElementById('currently-picking');
/****************************************
                Clock
****************************************/
var clockHTML, deadline, clockID;
deadline = 0;
clockHTML = document.getElementById('del-countdown');
clockID = 'del-countdown';

var updateTimer = function(deadline) {
    var time = deadline - new Date();
    return {
        'minutes': Math.floor((time / 1000 / 60) % 60),
        'seconds': Math.floor((time / 1000) % 60),
        'total': time
    };
};

var startTimer = function(id) {
    deadline = new Date();
    deadline.setMinutes(deadline.getMinutes() + 5);
    var timerInterval = setInterval(function() {
        var clock = document.getElementById(id);
        var timer = updateTimer(deadline);

        clock.innerHTML = '<div id="clock"><div id="timer">' + '<p class="timeText">' + timer.minutes +
            ':' + timer.seconds + '</p>' + '</div></div>';

        // if seconds on timer is less than 10 add 0 in front
        if (timer.seconds < 10) {
            clock.innerHTML = '<div id="clock"><div id="timer">' + '<p class="timeText">' + timer.minutes +
                ':0' + timer.seconds + '</p>' + '</div></div>';
        }
        //check for end of timer
        if (timer.total < 1) {
            clearInterval(timerInterval);
            clock.innerHTML = '<div id="clock"><div id="timer">' + '<p class="timeText">0:00</p>' + '</div></div>';
        }
    }, 1000);
};

/****************************************
              Misc controller
****************************************/
var miscCtrl = {

    createTeam: function(name, abr) {
        var teamName, teamAbr;
        teamName = name;
        teamAbr = abr;
        var team = {
            name: teamName,
            abr: teamAbr,
            drafted: [],
            logo: '<img src="img/logos/' + abr + '.png" class="team-logo">'
        };
        return team;
    },

    createPlayer: function(first, last, position, age, height, wingspan, weight, ppg, twpt, thpt, ft, reb, ast, stl, blk, shorthand) {
        var playerFirst, playerLast, playerPosition, playerAge, playerHeight, playerWingspan, playerWeight, playerPPG, playerTWPT, playerTHPT, playerFT, playerREB, playerAST, playerSTL, playerBLK, playerShorthand;
        playerFirst = first;
        playerLast = last;
        playerPosition = position;
        playerAge = age;
        playerHeight = height;
        playerWingspan = wingspan;
        playerWeight = weight;
        playerPPG = ppg;
        playerTWPT = twpt;
        playerTHPT = thpt;
        playerFT = ft;
        playerREB = reb;
        playerAST = ast;
        playerSTL = stl;
        playerBLK = blk;
        playerShorthand = shorthand;

        var player = {
            first: playerFirst,
            last: playerLast,
            position: playerPosition,
            age: playerAge,
            height: playerHeight,
            wingspan: playerWingspan,
            weight: playerWeight,
            ppg: playerPPG,
            twpt: playerTWPT,
            thpt: playerTHPT,
            ft: playerFT,
            reb: playerREB,
            ast: playerAST,
            stl: playerSTL,
            blk: playerBLK,
            shorthand: playerShorthand,
            avatar: '<img id="avatar" src="img/avatars/' + playerLast + playerFirst + '.png" >'
        };
        return player;
    },
    // get fullname of player letters in lowercaps only
    getPlayerName: function(player) {
        var str = player.last + player.first;
        str = str.replace(/'/g, '');
        str = str.toLowerCase();
        return str;
    }

};


/****************************************
              UI Controller
****************************************/
var UICtrl = {
    clearHTML: function(element) {
        element.innerHTML = "";
    },

    hideHTML: function(element) {
        element.classList.toggle('hide');
    },
    // render draftboard
    renderBoard: function() {
        var board;
        for (var i = 0; i < boardRender.length; i++) {
            id = 'prospect-' + i;
            board = document.getElementById(id);
            board.innerHTML = boardRender[i];
        }
    },

    renderProfile: function(player) {
        var item, backdrop, playerName;
        backdrop = draftOrder[0].abr + 'bg.jpg';
        playerName = miscCtrl.getPlayerName(player);
        item =
            '<div id="avatar-holder">' + player.avatar + '</div>' + // end avatar
            '<div id="' + player.last + '" class="player-profile">' +
            '<div class="bio">' +
            '<div class="tile">' + '<h6>position</h6><p>' + player.position + '</p>' + '</div>' +
            '<div class="tile">' + '<h6>age</h6><p>' + player.age + '</p>' + '</div>' +
            '<div class="tile">' + '<h6>height</h6><p>' + player.height + '</p>' + '</div>' +
            '<div class="tile">' + '<h6>wingspan</h6><p>' + player.wingspan + '</p>' + '</div>' +
            '<div class="tile">' + '<h6>weight</h6><p>' + player.weight + '</p>' + '</div>' + '</div>' + //end bio
            '<div id="stats">' + '<div class="stat"><h6>PPG</h3><p>' + player.ppg + '</p></div>' +
            '<div class="stat"><h6>2PT</h6><p>' + player.twpt + '</p></div>' +
            '<div class="stat"><h6>3PT</h6><p>' + player.thpt + '</p></div>' +
            '<div class="stat"><h6>FT</h6><p>' + player.ft + '</p></div>' +
            '<div class="stat"><h6>REB</h6><p>' + player.reb + '</p></div>' +
            '<div class="stat"><h6>AST</h6><p>' + player.ast + '</p></div>' +
            '<div class="stat"><h6>STL</h6><p>' + player.stl + '</p></div>' +
            '<div class="stat"><h6>BLK</h6><p>' + player.blk + '</p></div>' + '</div>' + //end stats
            '<div class="choose-prospect"><button class="select" id="choose" onclick="appCtrl.pickChosen(' + playerName + ');"> DRAFT </button></div>' +
            '</div>';
        profileHolder.innerHTML = item;
        // render profile player with image backdrop of city of team drafting
        container.style.backgroundImage = "url('img/misc/" + backdrop + "')";
    }

};

/****************************************
              App Controller
****************************************/
var appCtrl = {
    // pick has been confirmed, move onto next
    confirm: function() {
        UICtrl.hideHTML(clockHTML);
        UICtrl.hideHTML(playersList);
        console.log(count);
        if (count > 29) {
            profileHolder.innerHTML = '<div class="announcements"><p>The NBA Draft has concluded, goodluck to all the teams and their prospects next season.</p></div>';
            UICtrl.hideHTML(selectingLogo);
            UICtrl.hideHTML(clockHTML);
            UICtrl.hideHTML(playersList);
        } else {
            currentPick.innerHTML = '<div id="selectingteamlogo">' + draftOrder[0].logo + '</div>';
            profileHolder.innerHTML = '<div class="announcements"><p>The ' + draftOrder[0].name + ' are on the clock</p></div>';
        }
        startTimer(clockID);
    },

    pickChosen: function(player) {
        var playerName, fullName;
        playerName = miscCtrl.getPlayerName(player);
        fullName = player.first + ' ' + player.last;
        container.style.backgroundImage = 'none';
        // hide clock as player has chosen pick
        UICtrl.hideHTML(clockHTML);
        // hide prospects as player has chosen pick
        UICtrl.hideHTML(playersList);
        document.getElementById('choose').parentNode.parentNode.style.display = 'none';
        document.getElementById('' + playerName + '-btn').className = 'hide';
        profileHolder.innerHTML = '<div class="announcements"><h1>With the #' + pickOrder[0] + ' pick, the ' + draftOrder[0].name + ' select ' + fullName + '.</h1></div><img id="silver" src="img/misc/silver.png"><br><button id="ok-btn" type="submit" onclick="appCtrl.confirm();">></button>';
        // remove first element in array, slide next team over as [0];
        draftOrder[0].drafted.push(player.shorthand);
        // push team that just picked into picked array
        var string = draftOrder[0].logo + '<p>' + player.shorthand + '</p>';
        boardRender.push(string);
        // remove team that just picked from draftOrder
        draftOrder.shift();
        pickOrder.shift();
        // update draft board
        UICtrl.renderBoard();
        count++;
        console.log(count);
    },

    init: function() {
        UICtrl.hideHTML(welcome);
        UICtrl.hideHTML(app);
        this.confirm();
        UICtrl.hideHTML(clockHTML);
        UICtrl.hideHTML(playersList);
    }
};

/****************************************
              Global variables
****************************************/

// teams
var celtics = miscCtrl.createTeam('Boston Celtics', 'BOS');
var lakers = miscCtrl.createTeam('Los Angeles Lakers', 'LAL');
var seventysixers = miscCtrl.createTeam('Philadelphia 76ers', 'PHI');
var suns = miscCtrl.createTeam('Phoenix Suns', 'PHX');
var kings = miscCtrl.createTeam('Sacramento Kings', 'SAC');
var magic = miscCtrl.createTeam('Orlando Magic', 'ORL');
var timberwolves = miscCtrl.createTeam('Minnesota Timberwolves', 'MIN');
var knicks = miscCtrl.createTeam('New York Knicks', 'NY');
var mavericks = miscCtrl.createTeam('Dallas Mavericks', 'DAL');
var hornets = miscCtrl.createTeam('Charlotte Hornets', 'CHA');
var pistons = miscCtrl.createTeam('Detroit Pistons', 'DET');
var nuggets = miscCtrl.createTeam('Denver Nuggets', 'DEN');
var heat = miscCtrl.createTeam('Miami Heat', 'MIA');
var blazers = miscCtrl.createTeam('Portland Trailblazers', 'POR');
var bulls = miscCtrl.createTeam('Chicago Bulls', 'CHI');
var bucks = miscCtrl.createTeam('Milwaukee Bucks', 'MIL');
var pacers = miscCtrl.createTeam('Indiana Pacers', 'IND');
var hawks = miscCtrl.createTeam('Atlanta Hawks', 'ATL');
var thunder = miscCtrl.createTeam('Oklahoma City Thunder', 'OKC');
var nets = miscCtrl.createTeam('Brooklyn Nets', 'BKN');
var raptors = miscCtrl.createTeam('Toronto Raptors', 'TOR');
var jazz = miscCtrl.createTeam('Utah Jazz', 'UTA');
var spurs = miscCtrl.createTeam('San Antonio Spurs', 'SA');

// players

// Guards
var balllonzo = miscCtrl.createPlayer('Lonzo', 'Ball', 'PG', '19', '6\'6\"', '6\'7\'', '190', '14.6', '73.2%', '41.2%', '67.3%', '6.0', '7.6', '1.8', '0.8', 'L. BALL');
var fultzmarkelle = miscCtrl.createPlayer('Markelle', 'Fultz', 'PG', '19', '6\'4\"', '6\'9\'', '195', '23.2', '50.2%', '41.3%', '64.9%', '5.7', '5.9', '1.6', '1.2', 'M. FULTZ');
var foxdeaaron = miscCtrl.createPlayer('De\'Aaron', 'Fox', 'PG', '19', '6\'4\"', '6\'6\'', '171', '16.7', '52.1%', '24.6%', '73.6%', '4.0', '4.6', '1.5', '0.2', 'D. FOX');
var smithdennis = miscCtrl.createPlayer('Dennis', 'Smith', 'PG', '19', '6\'3\"', '6\'3\'', '195', '18.1', '50.9%', '35.9%', '71.5%', '4.6', '6.2', '1.9', '0.4', 'D. SMITH');
var ntilikinafrank = miscCtrl.createPlayer('Frank', 'Ntilikina', 'SG', '19', '6\'5\"', '7\'1\'', '170', '5.2', '48.3%', '40.3%', '60.5%', '2.3', '1.5', '0.7', '0.2', 'F. NTILIKINA');
var fergusonterrance = miscCtrl.createPlayer('Terrance', 'Ferguson', 'SG', '19', '6\'7\"', '6\'8\'', '186', '4.6', '44.4%', '31.3%', '60.0%', '1.2', '0.6', '0.2', '0.3', 'T. FERGUSON');
var whitederrick = miscCtrl.createPlayer('Derrick', 'White', 'PG/SG', '23', '6\'5\"', '6\'7\'', '200', '18.3', '57.0%', '40.1%', '80.5%', '4.1', '4.3', '1.2', '1.4', 'D. WHITE');
var evansjawun = miscCtrl.createPlayer('Jawun', 'Evans', 'PG', '20', '6\'1\"', '6\'5\'', '177', '19.0', '45.3%', '37.6%', '80.6%', '3.4', '6.5', '1.7', '0.1', 'J. EVANS');
// Wings
var jacksonjosh = miscCtrl.createPlayer('Josh', 'Jackson', 'SF', '20', '6\'8\"', '6\'9\'', '203', '16.3', '54.9%', '37.8%', '56.6%', '7.4', '3.0', '1.7', '1.1', 'J. JACKSON');
var tatumjayson = miscCtrl.createPlayer('Jayson', 'Tatum', 'SF', '19', '6\'8\"', '6\'11\'', '204', '16.8', '50.4%', '34.2%', '84.9%', '7.3', '2.1', '1.3', '1.1', 'J. TATUM');
var monkmalik = miscCtrl.createPlayer('Malik', 'Monk', 'SG', '19', '6\'4\"', '6\'3\'', '197', '19.8', '49.7%', '39.7%', '82.2%', '2.5', '2.3', '0.9', '0.5', 'M. MONK');
var isaacjonathan = miscCtrl.createPlayer('Jonathan', 'Isaac', 'SF/PF', '19', '6\'11\"', '7\'1\'', '205', '12.0', '59.3%', '34.8%', '78.0%', '7.8', '1.2', '1.2', '1.5', 'J. ISAAC');
var jacksonjustin = miscCtrl.createPlayer('Justin', 'Jackson', 'SF', '22', '6\'8\"', '6\'11\'', '193', '18.4', '51.0%', '36.8%', '74.8%', '4.7', '2.8', '0.8', '0.2', 'J. JACKSON');
var kennardluke = miscCtrl.createPlayer('Luke', 'Kennard', 'SG', '21', '6\'6\"', '6\'5\'', '202', '19.5', '52.5%', '43.8%', '85.6%', '5.1', '2.5', '0.8', '0.4', 'L. KENNARD');
var lydontyler = miscCtrl.createPlayer('Tyler', 'Lydon', 'SF/PF', '21', '6\'10\"', '7\'0\'', '225', '13.2', '52.3%', '39.2%', '83.6%', '8.6', '2.1', '1.0', '1.4', 'T. LYDON');
var anunobyog = miscCtrl.createPlayer('OG', 'Anunoby', 'SF/PF', '19', '6\'8\"', '7\'2\'', '215', '11.1', '70.1%', '31.1%', '56.3%', '5.4', '1.4', '1.3', '1.3', 'O. ANUNOBY');
var mitchelldonovan = miscCtrl.createPlayer('Donovan', 'Mitchell', 'SG', '20', '6\'3\"', '6\'10\'', '210', '15.6', '46.3%', '35.4%', '80.6%', '4.9', '2.7', '2.1', '0.5', 'D. MITCHELL');
var ojeleyesemi = miscCtrl.createPlayer('Semi', 'Ojeleye', 'SF/PF', '22', '6\'7\"', '6\'9\'', '235', '19.0', '52.9%', '42.4%', '78.5%', '6.9', '1.5', '0.4', '0.4', 'S. OJELEYE');


// Bigs
var markkanenlauri = miscCtrl.createPlayer('Lauri', 'Markkanen', 'PF', '20', '7\'0\"', 'N/A', '225', '15.6', '54.5%', '42.3%', '83.5%', '7.2', '0.9', '0.4', '0.5', 'L. MARKKANEN');
var collinszach = miscCtrl.createPlayer('Zach', 'Collins', 'PF/C', '19', '7\'0\"', '7\'1\'', '230', '10.0', '67.2%', '47.6%', '74.3%', '5.9', '0.4', '0.5', '1.8', 'Z. COLLINS');
var leaftj = miscCtrl.createPlayer('TJ', 'Leaf', 'PF', '20', '6\'10\"', '6\'11\'', '220', '16.3', '64.4%', '46.6%', '67.9%', '8.2', '2.4', '0.6', '1.1', 'T. LEAF');
var collinsjohn = miscCtrl.createPlayer('John', 'Collins', 'PF', '19', '6\'10\"', '6\'11\'', '225', '19.2', '62.4%', '0.0%', '74.5%', '9.8', '0.5', '0.6', '1.6', 'J. COLLINS');
var pattonjustin = miscCtrl.createPlayer('Justin', 'Patton', 'C', '20', '7\'0\"', '7\'3\'', '226', '12.9', '68.4%', '57.1%', '51.8%', '6.1', '1.2', '0.9', '1.4', 'J. PATTON');
var adebayobam = miscCtrl.createPlayer('Bam', 'Adebayo', 'C', '19', '6\'10\"', '7\'2\'', '250', '13.0', '60.1%', '0.0%', '65.3%', '8.0', '0.8', '0.7', '1.5', 'B. ADEBAYO');
var anigboguike = miscCtrl.createPlayer('Ike', 'Anigbogu', 'C', '18', '6\'10\"', '7\'6\'', '230', '4.7', '56.4%', '0.0%', '53.3%', '4.0', '0.2', '0.2', '1.2', 'I. ANIGBOGU');
var gilesharry = miscCtrl.createPlayer('Harry', 'Giles', 'C', '19.1', '6\'11\"', '7\'3\'', '222', '3.9', '57.7%', '0.0%', '50.0%', '3.8', '0.3', '0.3', '0.7', 'H. GILES');
var hartensteinisaiah = miscCtrl.createPlayer('Isaiah', 'Hartenstein', 'PF/C', '19', '7\'0\"', '7\'2\'', '225', '1.0', '66.7%', '0.0%', '100.0%', '0.8', '0.2', '0.0', '0.0', 'I. HARTENSTEIN');
var pasecniksanzejs = miscCtrl.createPlayer('Anzejs', 'Pasecniks', 'C', '21', '7\'2\"', 'N/A', '229', '7.8', '66.2%', '58.3%', '62.0%', '3.1', '0.3', '0.4', '0.7', 'A. PASECNIKS');
var wilsondj = miscCtrl.createPlayer('DJ', 'Wilson', 'PF', '21', '6\'10\"', '7\'3\'', '240', '11.0', '63.1%', '37.3%', '83.3%', '5.3', '1.3', '0.5', '1.5', 'D. WILSON');
var allenjarrett = miscCtrl.createPlayer('Jarrett', 'Allen', 'C', '19', '6\'11\"', '7\'5\'', '224', '13.4', '57.9%', '0.0%', '56.4%', '5.7', '0.8', '0.6', '1.5', 'J. ALLEN');
var jeannejonathan = miscCtrl.createPlayer('Jonathan', 'Jeanne', 'C', '20', '7\'2\"', '7\'6\'', '210', '3.7', '48.0%', '25.0%', '52.0%', '3.9', '0.4', '0.4', '0.8', 'J. JEANNE');
var rabbivan = miscCtrl.createPlayer('Ivan', 'Rabb', 'PF/C', '20', '6\'10\"', '7\'1\'', '215', '14.0', '49.0%', '40.0%', '66.3%', '10.5', '1.5', '0.7', '1.0', 'I. RABB');
var kuzmakyle = miscCtrl.createPlayer('Kyle', 'Kuzma', 'PF', '21', '6\'9\"', '7\'0\'', '221', '16.3', '55.7%', '32.1%', '66.9%', '9.0', '2.4', '0.6', '0.5', 'K. KUZMA');
var bradleytony = miscCtrl.createPlayer('Tony', 'Bradley', 'C', '19', '6\'10\"', '7\'5\'', '248', '6.9', '56.4%', '0.0%', '61.6%', '5.1', '0.6', '0.3', '0.6', 'T. BRADLEY');
var lessortmathias = miscCtrl.createPlayer('Mathias', 'Lessort', 'PF/C', '21', '6\'9\"', 'N/A', '250', '10.2', '57.0%', '100.0%', '59.3%', '7.2', '0.7', '0.7', '1.0', 'M. LESSORT');
var belljordan = miscCtrl.createPlayer('Jordan', 'Bell', 'PF', '22', '6\'9\"', '6\'11\"', '227', '11.0', '66.1%', '15.4%', '69.4%', '8.7', '1.8', '1.3', '2.3', 'J. BELL');

var draftOrder = [celtics, lakers, seventysixers, suns, kings, magic, timberwolves, knicks, mavericks, kings, hornets, pistons, nuggets, heat, blazers, bulls, bucks, pacers, hawks, blazers, thunder, nets, raptors, jazz, magic, blazers, nets, lakers, spurs, jazz];
var pickOrder = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];
var boardRender = [];
var count = 0;


UICtrl.hideHTML(app);

// If prospect button is clicked, render profile
document.getElementById("draft-list").addEventListener("click", function(e) {
    if (e.target.nodeName === "BUTTON") {
        var player;
        player = e.target.id;
        player = player.slice(0, -4);
        player = eval(player);
        UICtrl.renderProfile(player);
    }
});
