/*function namepopup() {
    alert("Hello, my name is Flashes-dashes");
}*/
var settings = {
    counter: []
};
var thisGame = [];
var winHistory = [];
var drawHistory = [];

function changeSettings() { //amend to add computer settings back in when clicking back on computer versus
    let v = document.getElementsByName("versus");
    v.forEach(function(element) { if (element.checked == true) { settings[versus] == element.value } });
    if (settings[versus] == "Player") {
        let vCPU = document.getElementsByClassName("vCPU");
        for (i = 0; i < vCPU.length; i++) { vCPU[i].style.display = "none" };
    } else {
        let vCPU = document.getElementsByClassName("vCPU");
        for (i = 0; i < vCPU.length; i++) { vCPU[i].style.display = "block" };
    }
}

function startGame() {
    //Gets and sets the user counter and order of play.
    let a = document.getElementsByName("counter");
    let b = document.getElementsByName("first");
    b.forEach(element => {
        if (element.checked == true) { settings['first'] = element.value; }
    });
    let ctrP = "";
    let ctrC = "";
    if (a[0].checked == true) {
        ctrP = a[0].value;
        ctrC = a[1].value;
    } else {
        ctrP = a[1].value;
        ctrC = a[0].value;
    };
    if (b[0].checked == true) {
        settings['counter'][1] = ctrP;
        settings['counter'][0] = ctrC;
    } else {
        settings['counter'][1] = ctrC;
        settings['counter'][0] = ctrP;
    }
    //Gets and sets the 'difficulty', select the cpu play profile to use.
    let c = document.getElementsByName("difficulty");
    c.forEach(element => { if (element.checked == true) { settings["difficulty"] = element.value } });

    //Create the gameboard.
    var gw = document.getElementById("gameWindow"),
        gwn = gw.childNodes,
        gwl = gwn.length,
        i = 0,
        j = 0;
    for (i = 0; i < gwl; i++) {
        gw.removeChild(gwn[0]);
    }
    for (i = 0; i < 3; i++) {
        let r = document.createElement("div");
        r.classList.add("row");
        for (j = 0; j < 3; j++) {
            let s = document.createElement("div");
            s.classList.add("square");
            s.classList.add("squareFree");
            r.appendChild(s);
        }
        gw.appendChild(r);
    }
    let sb = document.createElement("div");
    sb.setAttribute("id", "statusBar");
    gw.appendChild(sb);
    //Add event handlers to the squares.
    let sq = document.getElementsByClassName("square");
    i = 0;
    while (i < sq.length) {
        sq[i].addEventListener("click", recordMove);
        let sqid = "sq" + i;
        sq[i].setAttribute("id", sqid);
        i++;
    }
    //Check if previous gamehistory.
    if (localStorage != undefined) {
        let wh = localStorage.getItem("winHistory");
        let dh = localStorage.getItem("drawHistory");
        if (wh != undefined) {
            winHistory = JSON.parse(wh);
        } else {
            console.log("No win history found.")
        }
        if (dh != undefined) {
            drawHistory = JSON.parse(dh);
        } else {
            console.log("No draw history found.")
        }

    } else {
        alert("Error, game memory unavailable.")
    }
    //Clear previous game data.
    thisGame = [0];
    //Check first to play.
    nextPlayer();
}

function nextPlayer() {
    let gl = thisGame.length;
    let sb = document.getElementById("statusBar");
    if (settings.versus == "Computer") {
        if (gl == 1) {
            if (settings.first == "Player") {
                sb.innerHTML = "Your turn...";
            } else {
                sb.innerHTML = "Computer is thinking...";
                cpuPlay();
            }
        } else {
            if (settings.first == "Player") {
                if (gl % 2 != 0) { sb.innerHTML = "Your turn..."; } else {
                    sb.innerHTML = "Computer is thinking...";
                    cpuPlay();
                }
            } else {
                if (gl % 2 == 0) { sb.innerHTML = "Your turn..."; } else {
                    sb.innerHTML = "Computer is thinking...";
                    cpuPlay();
                }
            }
        }
    } else {
        sb.innerHTML = "PvP: Play and pass!";
    }
}
//Record the move just made and remove the eventlistener.
function recordMove() {
    let move = event.target;
    let sb = document.getElementById("statusBar");
    let gl = thisGame.length;
    let c = gl % 2;
    let ctr = settings.counter[c];
    thisGame[gl] = move.id;
    move.removeEventListener("click", recordMove);
    move.classList.remove("squareFree");
    move.classList.add("squareTaken");
    move.innerHTML = ctr;
    /*if (gl % 2 == 0) {
        move.innerHTML = settings.counter[0];
    } else {
        move.innerHTML = settings.counter[1];
    }*/
    //If a player has won.
    if (checkWin()) {
        let sq = document.getElementsByClassName("square");
        for (i = 0; i < sq.length; i++) {
            sq[i].classList.remove("squareFree");
            sq[i].removeEventListener("click", recordMove);
        }
        checkStore(winHistory, "winHistory");
        sb.innerHTML = move.innerHTML + " has won!";
        //If the game board is full without a winner.
    } else if (gl >= 9) {
        sb.innerHTML = "DRAW!";
        checkStore(drawHistory, "drawHistory");
        //If no winner and gameboard not full.
    } else { nextPlayer() };
}
//To check whether the move pattern is repeated, and store if not.
function checkStore(xh, sh) {
    let xhl = xh.length;
    let tgl = thisGame.length;
    for (i = 0; i < xhl; i++) {
        let xhil = xh[i].length;
        let matches = 0;
        for (j = 1; j < xhil; j++) {
            if (xh[i][j] == thisGame[j]) {
                matches++;
                if (matches == xhil - 1) {
                    xh[i][0] += 1;
                    let hStr = JSON.stringify(xh);
                    localStorage.setItem(sh, hStr);
                    return; //to end the script as repetition has been found.
                }
            } else {
                break;
            }
        }
    }
    //record the new game, and store in local storage.
    thisGame[0] = 1;
    xh[xhl] = thisGame;
    let hStr = JSON.stringify(xh);
    localStorage.setItem(sh, hStr);
}

const winMap = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8]
]

function checkWin() {
    let grid = document.getElementsByClassName("square");
    //horizontal checks.
    for (i = 0; i < 3; i++) {
        let a = winMap[i][0],
            b = winMap[i][1],
            c = winMap[i][2];
        if (grid[a].innerHTML == grid[b].innerHTML && grid[a].innerHTML == grid[c].innerHTML && grid[a].innerHTML != "") {
            grid[a].classList.add("winRow");
            grid[b].classList.add("winRow");
            grid[c].classList.add("winRow");
            return true;
        }
    }
    //vertical checks.
    for (i = 0; i < 3; i++) {
        let a = winMap[0][i],
            b = winMap[1][i],
            c = winMap[2][i];
        if (grid[a].innerHTML == grid[b].innerHTML && grid[a].innerHTML == grid[c].innerHTML && grid[a].innerHTML != "") {
            grid[a].classList.add("winRow");
            grid[b].classList.add("winRow");
            grid[c].classList.add("winRow");
            return true;
        }
    }
    //diagonal checks.
    let x = winMap[0][0],
        y = winMap[1][1],
        z = winMap[2][2];
    let d = winMap[0][2],
        e = winMap[1][1],
        f = winMap[2][0];
    if (grid[x].innerHTML == grid[y].innerHTML && grid[x].innerHTML == grid[z].innerHTML && grid[x].innerHTML != "") {
        grid[x].classList.add("winRow");
        grid[y].classList.add("winRow");
        grid[z].classList.add("winRow");
        return true;
    }
    if (grid[d].innerHTML == grid[e].innerHTML && grid[d].innerHTML == grid[f].innerHTML && grid[d].innerHTML != "") {
        grid[d].classList.add("winRow");
        grid[e].classList.add("winRow");
        grid[f].classList.add("winRow");
        return true;
    }
    return false;
}
//For the cpu turn, to check where to move then call recordMove() with click event.
/*
function cpuPlay() {
    let r = ranNum(0, 9);
    let gl = thisGame.length;
    let wl = winHistory.length;
    let dl = drawHistory.length;
    let freeMoves = document.getElementsByClassName("squareFree");
    let f = freeMoves.length;
    let rf = ranNum(0, f);
    let x = document.createEvent("MouseEvent");
    x.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    //if total history is less than 5 OR difficulty set to 'low', play randomly.
    if (wl + dl < 5 || settings["difficulty"] == "Low") {
        freeMoves[rf].dispatchEvent(x);
        //Check this game for matches in the winhistory (upto its length only.)
    } else {
        if (wl > 0) {
            let j = ranNum(0, wl);
            let wrem = wl - j;
            for (j; j < wl; j++) { //Checks from random point in winhistory.
                let i = 0;
                while (winHistory[j][i] == thisGame[i]) {
                    i++;
                }
                if (i == gl) {
                    if (winHistory[j].length % 2 != gl % 2) {
                        document.getElementById(winHistory[j][i]).dispatchEvent(x);
                        return;
                    }
                }
            }
            for (j = 0; j < wrem; j++) {
                let i = 0;
                while (winHistory[j][i] == thisGame[i]) { //Checks from start upto random point in winhistory.
                    i++;
                }
                if (i == gl) {
                    if (winHistory[j].length % 2 != gl % 2) {
                        document.getElementById(winHistory[j][i]).dispatchEvent(x);
                        return;
                    }
                }
            }
        }
        //check this game for draw history if no win matches found.
        if (dl > 0) {
            for (j = 0; j < dl; j++) {
                let i = 0;
                while (drawHistory[j][i] == thisGame[i]) {
                    i++;
                }
                if (i == gl) {
                    if (drawHistory[j].length % 2 != gl % 2) {
                        document.getElementById(drawHistory[j][i]).dispatchEvent(x);
                        return;
                    }
                }
            }
        }
        freeMoves[rf].dispatchEvent(x);
    }
}
*/


function ranNum(initial, range) {
    var rn = Math.floor(Math.random() * range) + initial;
    return rn;
}

function clearHistory() {
    if (confirm("This will remove all saved game history, are you sure? This cannot be undone.")) {
        localStorage.removeItem("winHistory");
        localStorage.removeItem("drawHistory");
        winHistory = [];
        drawHistory = [];
    }
}

function cpuPlay() {
    let r = ranNum(0, 9);
    let gl = thisGame.length;
    let wl = winHistory.length;
    let dl = drawHistory.length;
    let freeMoves = document.getElementsByClassName("squareFree");
    let f = freeMoves.length;
    let rf = ranNum(0, f);
    let x = document.createEvent("MouseEvent");
    x.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    //if total history is less than 5 OR difficulty set to 'low', play randomly.
    if (wl + dl < 5 || settings["difficulty"] == "Low") {
        freeMoves[rf].dispatchEvent(x);
        //Check this game for matches in the winhistory (upto its length only.)
    } else {
        let nxtmov = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        if (wl > 0) {
            let j = 0;
            for (j = 0; j < wl; j++) { //Checks from start in winhistory.
                let i = 1;
                while (winHistory[j][i] == thisGame[i]) {
                    i++;
                }
                if (i >= gl) {
                    if (winHistory[j].length % 2 != gl % 2) {
                        let str = winHistory[j][i];
                        let nstr = str.charAt(2);
                        let num = parseInt(nstr);
                        nxtmov[num] += winHistory[j][0];
                    }
                }
            }
        }
        let nmf = nxtmov.filter(function(nm) { return nm > 0 });
        if (nmf.length == 0) {
            //check this game for draw history if no win matches found.
            if (dl > 0) {
                for (j = 0; j < dl; j++) {
                    let i = 1;
                    while (drawHistory[j][i] == thisGame[i]) {
                        i++;
                    }
                    if (i >= gl) {
                        if (drawHistory[j].length % 2 != gl % 2) {
                            let str = drawHistory[j][i];
                            let nstr = str.charAt(2);
                            let num = parseInt(nstr);
                            nxtmov[num] += drawHistory[j][0];
                        }
                    }
                }
            }
        }
        nmf = nxtmov.filter(function(nm) { return nm > 0 });
        if (nmf.length == 0) { //To run if no win or draw moves can be mapped.
            freeMoves[rf].dispatchEvent(x);
            return;
        } else { //Uses the nxtmov array map, to select the next move to make.
            let k = 0;
            nxtmov.forEach(element => {
                if (element > k) { k = element; } //Will have early bias. Can add in mulitple storage of equal items and then use ranNum() to select which.
            });
            let ki;
            if (r > 4) { ki = nxtmov.lastIndexOf(k) } else { ki = nxtmov.indexOf(k); };
            let kmov = "sq" + ki;
            document.getElementById(kmov).dispatchEvent(x);
        }
    }
}