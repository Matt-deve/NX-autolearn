//global variables and objects
var settings = {
    player: "O",
    difficulty: "Regular",
    first: "O",
};
var grid = {
    tl: document.getElementById("topLeft"),
    tm: document.getElementById("topMid"),
    tr: document.getElementById("topRight"),
    ml: document.getElementById("midLeft"),
    mm: document.getElementById("midMid"),
    mr: document.getElementById("midRight"),
    bl: document.getElementById("botLeft"),
    bm: document.getElementById("botMid"),
    br: document.getElementById("botRight"),
}

var corner = [
    grid.tr,
    grid.tl,
    grid.bl,
    grid.br
]
var clength = corner.length;
var side = [
    document.getElementById("topMid"),
    document.getElementById("midLeft"),
    document.getElementById("midRight"),
    document.getElementById("botMid")
]
var slength = side.length;
var col1 = [grid.tl, grid.ml, grid.bl]
var col2 = [grid.tm, grid.mm, grid.bm]
var col3 = [grid.tr, grid.mr, grid.br]
var row1 = [grid.tl, grid.tm, grid.tr]
var row2 = [grid.ml, grid.mm, grid.mr]
var row3 = [grid.bl, grid.bm, grid.br]
var dia1 = [grid.tl, grid.mm, grid.br]
var dia2 = [grid.tr, grid.mm, grid.bl]
var runs = [
    col1,
    col2,
    col3,
    row1,
    row2,
    row3,
    dia1,
    dia2,
]
var free = [];
var turn = 0;
var nextMove = 0;
var winner = 0;
var outputLine = document.getElementById("outputLine");

//define player settings
function changeSetting(setting, input) {
    switch (setting) {
        case 1:
            settings.player = input;
            break;
        case 2:
            settings.difficulty = input;
            break;
        case 3:
            settings.first = input;
            break;
        default:
            settings.player = "O";
            settings.difficulty = "Regular";
            settings.first = "O";
    }
    // outputLine.innerHTML = "Player: " + settings.player + "CPU: " + settings.difficulty + "First to play: " + settings.first;
}

//starts the game
function startGame() {
    emptyGrid();
    document.getElementById("cover").style.display = "none";
    document.getElementById("quitBox").style.display = "block";
    if (settings.player == "O" && settings.first == "X") {
        cpuPlays();
    } else if (settings.player == "X" && settings.first == "O") {
        cpuPlays();
    } else {
        outputLine.innerHTML = "Your turn";
    }
}

//run on player turn
function mark(x) {
    if (winner != 1) {
        if (grid[x].innerHTML == "") {
            grid[x].innerHTML = settings.player;
            turn++;
            cpuPlays();
        }
    }
}
//clear grid contents and reset global variables
function emptyGrid() {
    for (x in grid) {
        grid[x].innerHTML = "";
    }
    turn = 0;
    winner = 0;
}
//cpu play controller, runs on cpu turn
function cpuPlays() {
    checkWin();
    if (winner == 0) {
        outputLine.innerHTML = "CPU is thinking...";
        var t = checkTurn();
        var d = settings.difficulty;
        var mark = cpuMark();

        if (t != 1) {
            switch (d) {
                case "Easy":
                    cpuEasy(mark);
                    break;
                case "Regular":
                    cpuReg(t, mark);
                    break;
                case "Impossible":
                    cpuImp(mark);
                    break;
            }
            turn++;
        }
    }
}

//check turn progression
function checkTurn() {
    if (turn < 6) {
        return 0;
    } else if (turn == 9) {
        return 1;
    } else {
        return 2;
    }
}

//random number generator
function ranNum(initial, range) {
    var rn = Math.floor(Math.random() * range) + initial;
    return rn;
}

//get cpu mark
function cpuMark() {
    if (settings.player == "O") {
        return "X";
    } else {
        return "O";
    }
}

//difficulty of cpu play
function cpuEasy(mark) {
    var free = [];
    var i = 0;
    var r = 0;
    var l = 0;

    for (x in grid) {
        if (grid[x].innerHTML == "") {
            free[i] = grid[x];
            i++;
        }
        l = free.length;
    }
    r = ranNum(0, l);
    if (r == 9) {
        r--;
    }
    free[r].innerHTML = mark;
    outputLine.innerHTML = "Your turn";
    checkWin();
}

function cpuReg(turn, mark) {}

function cpuImp(mark) {

    var i = 0;
    var j = 0;
    var r = 0;
    var l = 0;

    /*for (x in grid) {
        if (grid[x].innerHTML == "") {
            free[i] = grid[x];
            i++;
        }
        l = free.length;
    }*/
    switch (turn) {
        case 0:
            grid.mm.innerHTML = mark;
            break;
        case 1:
            if (grid.mm.innerHTML == "") {
                grid.mm.innerHTML = mark
            } else {
                r = ranNum(0, 3);
                for (x in corner) {
                    free[i] = corner[x];
                    i++
                }
                free[r].innerHTML = mark;
            };
            break;
        case 2:
            //checkIfCPUWin(mark);
            var p;
            for (i = 0; i < clength; i++) {
                if (corner[i].innerHTML != "") {
                    p = corner[i];
                    break;
                }
            }
            if (p == grid.tl) {
                grid.tr.innerHTML = mark;
            } else if (p == grid.tr) {
                grid.br.innerHTML = mark;
            } else if (p == grid.bl) {
                grid.tl.innerHTML = mark;
            } else if (p == grid.br) {
                grid.bl.innerHTML = mark;
            } else {
                r = ranNum(0, 3);
                corner[r].innerHTML = mark;
            }
            break;
        case 3:
            checkWin();
            checkIfCPUWin(mark);
            checkIfPlayerWin(mark);
            break;
        case 4:
            checkWin();
            checkIfCPUWin(mark);
            checkIfPlayerWin(mark);
            break;
        case 5:
            checkWin();
            checkIfCPUWin(mark);
            checkIfPlayerWin(mark);
            break;
        case 6:
            checkWin();
            checkIfCPUWin(mark);
            checkIfPlayerWin(mark);
            break;
        case 7:
            checkWin();
            checkIfCPUWin(mark);
            checkIfPlayerWin(mark);
            break;
        case 8:
            checkWin();
            checkIfCPUWin(mark);
            checkIfPlayerWin(mark);
            break;
        case 9:
            break;
    }
    outputLine.innerHTML = "Your turn";
    checkWin();
}
//finds the unavailable spaces in corners and sides
function getPlayed(series) {
    var s = series;
    var ispace = 0;
    for (i = 0; i < series.length; i++) {
        if (series[i].innerHTML == "") {
            free[ispace] = series[i];
            ispace++;
        }
    }
}

function checkIfCPUWin(mark) {
    var cCount = 0;
    nextMove = 0;
    var x = 0;
    var xl = runs.length;
    for (x = 0; x < xl; x++) {
        cCount = 0;
        if (nextMove == 0) {
            var cRun = runs[x];
            var l = cRun.length;
            for (i = 0; i < l; i++) {
                if (cRun[i].innerHTML == mark) {
                    cCount++;
                }
                if (cCount == 2) {
                    var j = 0;
                    for (j = 0; j < l; j++) {
                        if (cRun[j].innerHTML == "") {
                            cRun[j].innerHTML = mark;
                            nextMove = 1;
                            break;
                        } else if (cRun[j].innerHTML == mark) {
                            break;
                        }
                    }
                }
            }
        }
    }
}

function checkIfPlayerWin(mark) {
    var pMark = settings.player;
    var pCount = 0;

    var x = 0;
    var xl = runs.length;
    for (x = 0; x < xl; x++) {
        pCount = 0;
        if (nextMove == 0) {
            var pRun = runs[x];
            var l = pRun.length;
            for (i = 0; i < l; i++) {
                if (pRun[i].innerHTML == pMark) {
                    pCount++;
                }
                if (pCount == 2) {
                    for (j = 0; j < l; j++) {
                        if (pRun[j].innerHTML == "") {
                            pRun[j].innerHTML = mark;
                            nextMove = 1;
                            break;
                        } else if (pRun[j].innerHTML == mark) {
                            break;
                        }
                    }
                }
            }
        } else {
            //write code for alternative move
            break;
        }
    }
}

function impMove2(p) {
    r = ranNum(0, 1);
    var nm;
    switch (p) {
        case 0:
            if (r == 0) {
                nm = grid.tr;
            } else {
                nm = grid.bl;
            };
            break;
        case 1:
            if (r == 0) {
                nm = grid.bl;
            } else {
                nm = grid.br;
            };
            break;
        case 2:
            if (r == 0) {
                nm = grid.tl;
            } else {
                nm = grid.br;
            };
            break;
        case 3:
            if (r == 0) {
                nm = grid.tr;
            } else {
                nm = grid.br;
            };
            break;
        case 4:
            if (r == 0) {
                nm = grid.tl;
            } else {
                nm = grid.bl;
            };
            break;
        case 5:
            if (r == 0) {
                nm = grid.tl;
            } else {
                nm = grid.br;
            };
            break;
        case 6:
            if (r == 0) {
                nm = grid.tl;
            } else {
                nm = grid.tr;
            };
            break;
        case 7:
            if (r == 0) {
                nm = grid.bl;
            } else {
                nm = grid.tr;
            };
            break;
    }
    nm.innerHTML = mark;
}

function winNext() {

}

//win and draw conditions
function checkWin() {
    if (grid.tl.innerHTML != "" && grid.tl.innerHTML == grid.tm.innerHTML && grid.tm.innerHTML == grid.tr.innerHTML) {
        outputLine.innerHTML = grid.tl.innerHTML + " is the Winner!";
        winner = 1;
    } else if (grid.ml.innerHTML != "" && grid.ml.innerHTML == grid.mm.innerHTML && grid.mm.innerHTML == grid.mr.innerHTML) {
        outputLine.innerHTML = grid.ml.innerHTML + " is the Winner!";
        winner = 1;
    } else if (grid.bl.innerHTML != "" && grid.bl.innerHTML == grid.bm.innerHTML && grid.bm.innerHTML == grid.br.innerHTML) {
        outputLine.innerHTML = grid.bl.innerHTML + " is the Winner!";
        winner = 1;
    } else if (grid.tl.innerHTML != "" && grid.tl.innerHTML == grid.ml.innerHTML && grid.ml.innerHTML == grid.bl.innerHTML) {
        outputLine.innerHTML = grid.bl.innerHTML + " is the Winner!";
        winner = 1;
    } else if (grid.tm.innerHTML != "" && grid.tm.innerHTML == grid.mm.innerHTML && grid.mm.innerHTML == grid.bm.innerHTML) {
        outputLine.innerHTML = grid.tm.innerHTML + " is the Winner!";
        winner = 1;
    } else if (grid.tr.innerHTML != "" && grid.tr.innerHTML == grid.mr.innerHTML && grid.mr.innerHTML == grid.br.innerHTML) {
        outputLine.innerHTML = grid.tr.innerHTML + " is the Winner!";
        winner = 1;
    } else if (grid.tl.innerHTML != "" && grid.tl.innerHTML == grid.mm.innerHTML && grid.mm.innerHTML == grid.br.innerHTML) {
        outputLine.innerHTML = grid.mm.innerHTML + " is the Winner!";
        winner = 1;
    } else if (grid.tr.innerHTML != "" && grid.tr.innerHTML == grid.mm.innerHTML && grid.mm.innerHTML == grid.bl.innerHTML) {
        outputLine.innerHTML = grid.mm.innerHTML + " is the Winner!";
        winner = 1;
    } else if (turn == 8 && winner == 0) {
        outputLine.innerHTML = "Draw!";
    }
}

//runs on quit game
function quitGame() {
    document.getElementById("cover").style.display = "flex";
    document.getElementById("quitBox").style.display = "none";
    outputLine.innerHTML = "";
}
