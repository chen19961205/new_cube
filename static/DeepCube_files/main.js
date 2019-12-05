var state = [];
var rotateIdxs_old = null;
var rotateIdxs_new = null;
var stateToFE = null;
var FEToState = null;
var legalMoves = null;

var solveStartState = [];
var solveMoves = [];
var solveMoves_rev = [];
var solveIdx = null;
var solution_text = null;

var faceNames = ["top", "bottom", "left", "right", "back", "front"];
var colorMap = { 0: "#ffffff", 1: "#ffff1a", 4: "#0000ff", 5: "#33cc33", 2: "#ff8000", 3: "#e60000" };
var lastMouseX = 0,
    lastMouseY = 0;
var rotX = -30,
    rotY = -30;

var moves = []

function reOrderArray(arr, indecies) {
    var temp = []
    for (var i = 0; i < indecies.length; i++) {
        var index = indecies[i]
        temp.push(arr[index])
    }

    return temp;
}

/*
	Rand int between min (inclusive) and max (exclusive)
*/
function randInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function clearCube() {
    for (i = 0; i < faceNames.length; i++) {
        var myNode = document.getElementById(faceNames[i]); //mynode存储的是上下左右前后值
        while (myNode.firstChild) {
            myNode.removeChild(myNode.firstChild);  //把子节点都去掉
        }
    }
}

function setStickerColors(newState) {
    state = newState
    clearCube()    //把上下左右的子节点都去掉，恢复原来状态

    idx = 0
    for (i = 0; i < faceNames.length; i++) {
        for (j = 0; j < 9; j++) {           //对魔方六个面的九个小格进行操作
            var iDiv = document.createElement('div');
            iDiv.className = 'sticker';
            iDiv.style["background-color"] = colorMap[Math.floor(newState[idx] / 9)]
            iDiv.innerText = Math.floor(newState[idx]);   //给每个小格编号
            document.getElementById(faceNames[i]).appendChild(iDiv);
            idx = idx + 1
        }
    }
}

function buttonPressed(ev) {
    var face = ''
    var direction = '1'

    if (ev.shiftKey) {
        direction = '-1'
    }
    if (ev.which == 85 || ev.which == 117) { //event.which将event.keyCode和event.charCode标准化。
        face = 'U'
    } else if (ev.which == 68 || ev.which == 100) {
        face = 'D'
    } else if (ev.which == 76 || ev.which == 108) {
        face = 'L'
    } else if (ev.which == 82 || ev.which == 114) {
        face = 'R'
    } else if (ev.which == 66 || ev.which == 98) {
        face = 'B'
    } else if (ev.which == 70 || ev.which == 102) {
        face = 'F'
    }
    if (face != '') {
        clearSoln();
        moves.push(face + "_" + direction);  //moves里存键盘按钮操作
        nextState();
    }
}


function enableScroll() {
    document.getElementById("first_state").disabled = false;
    document.getElementById("prev_state").disabled = false;
    document.getElementById("next_state").disabled = false;
    document.getElementById("last_state").disabled = false;
}

function disableScroll() {
    document.getElementById("first_state").blur(); //so keyboard input can work without having to click away from disabled button
    document.getElementById("prev_state").blur(); //出发被选元素的blur事件
    document.getElementById("next_state").blur();
    document.getElementById("last_state").blur();

    document.getElementById("first_state").disabled = true; //都变为不可用状态
    document.getElementById("prev_state").disabled = true;
    document.getElementById("next_state").disabled = true;
    document.getElementById("last_state").disabled = true;
}

/*
	Clears solution as well as disables scroll
*/
function clearSoln() {
    solveIdx = 0;
    solveStartState = [];
    solveMoves = [];
    solveMoves_rev = [];
    solution_text = null;
    document.getElementById("solution_text").innerHTML = "Solution:";
    disableScroll();
}


function setSolnText(setColor = true) {
    solution_text_mod = JSON.parse(JSON.stringify(solution_text)) //json.parse()是为了把json对象转化为js对象
    if (solveIdx >= 0) {
        if (setColor == true) {
            solution_text_mod[solveIdx] = solution_text_mod[solveIdx].bold().fontcolor("blue")

        } else {
            solution_text_mod[solveIdx] = solution_text_mod[solveIdx]
        }
    }
    document.getElementById("solution_text").innerHTML = "Solution: " + solution_text_mod.join(" ");
}

function enableInput() {
    document.getElementById("scramble").disabled = false;
    document.getElementById("solve").disabled = false;
    $(document).on("keypress", buttonPressed);
}

function disableInput() {
    document.getElementById("scramble").disabled = true; //设置为不可用状态
    document.getElementById("solve").disabled = true;
    $(document).off("keypress", buttonPressed); //移除键盘事件
}

function nextState(moveTimeout = 0) {
    if (moves.length > 0) {
        disableInput();
        disableScroll();
        move = moves.shift() // get Move

        //convert to python representation
        state_rep = reOrderArray(state, FEToState)    //返回state[FEToState[i]]数组
        newState_rep = JSON.parse(JSON.stringify(state_rep))//js对象先转换为json对象再转换为js对象

        //swap stickers     不断的回退，使魔方恢复到原来的效果  最重要部分
        for (var i = 0; i < rotateIdxs_new[move].length; i++) {
            newState_rep[rotateIdxs_new[move][i]] = state_rep[rotateIdxs_old[move][i]]
        }

        // Change move highlight
        if (moveTimeout != 0) { //check if nextState is used for first_state click, prev_state,etc.
            solveIdx++
            setSolnText(setColor = true)
        }
        //convert back to HTML representation   
        //对魔方进行打乱
        newState = reOrderArray(newState_rep, stateToFE)

        //set new state
        setStickerColors(newState)

        //Call again if there are more moves
        if (moves.length > 0) {
            setTimeout(function () { nextState(moveTimeout) }, moveTimeout);
        } else {
            enableInput();
            if (solveMoves.length > 0) {
                enableScroll();
                setSolnText();
            }
        }
    } else {
        enableInput();
        if (solveMoves.length > 0) {
            enableScroll(); //把四个键变为可用状态
            setSolnText();
        }
    }
}

function scrambleCube() {    //点击按钮的效果
    disableInput();
    clearSoln();   //把一些必要东西设置为空，然后触发上边四个button的blur事件  

    numMoves = 10;
    for (var i = 0; i < numMoves; i++) {
        console.log("开始往moves"+i+"个值为：");
        moves.push(legalMoves[randInt(0, legalMoves.length)]);  //把移动原始数据加入moves队列里
        console.log(moves);
    }

    nextState(0);
}

function solveCube() {
    disableInput();
    clearSoln();
    document.getElementById("solution_text").innerHTML = "SOLVING..."

    //执行到前一步，缺少服务器传数据
    $.ajax({
        // url: '/solve'这里的http://
        url: '/solvecube',
        data: { "state": JSON.stringify(state) },
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            solveStartState = JSON.parse(JSON.stringify(state))
            solveMoves = response["moves"];
            solveMoves_rev = response["moves_rev"];
            solution_text = response["solve_text"];
            solution_text.push("SOLVED!")
            setSolnText(true);

            moves = JSON.parse(JSON.stringify(solveMoves))

            setTimeout(function () { nextState(500) }, 500);
        },
        error: function (error) {
            console.log(error);
            document.getElementById("solution_text").innerHTML = "..."
            setTimeout(function () { solveCube() }, 500);
        },
    });
}

$(document).ready($(function () {
    disableInput();
    clearSoln();
    $.ajax({
        //url: '/initState',   //加载远程数据
        url: '../../webpytest',   //加载远程数据
        data: {},
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            setStickerColors(response["state"]);    //重新初始化魔方的六个面九个小格，state是6*9=54的数组
            rotateIdxs_old = response["rotateIdxs_old"];//原来是null单个值
            rotateIdxs_new = response["rotateIdxs_new"];//24  多维数组
            stateToFE = response["stateToFE"];
            FEToState = response["FEToState"];   //54个面
            legalMoves = response["legalMoves"]   //12中转法 u_1，u_-1
            enableInput();   //让scremble和solve 以及键盘都变为可用
        },
        error: function (error) {
            //  document.getElementById("solution_text").innerHTML = "进来错误信息:";
            //后台响应中断执行这个
            response = { "FEToState": [6, 3, 0, 7, 4, 1, 8, 5, 2, 15, 12, 9, 16, 13, 10, 17, 14, 11, 24, 21, 18, 25, 22, 19, 26, 23, 20, 33, 30, 27, 34, 31, 28, 35, 32, 29, 38, 41, 44, 37, 40, 43, 36, 39, 42, 51, 48, 45, 52, 49, 46, 53, 50, 47], "legalMoves": ["U_-1", "U_1", "D_-1", "D_1", "L_-1", "L_1", "R_-1", "R_1", "B_-1", "B_1", "F_-1", "F_1"], "rotateIdxs_new": { "B_-1": [36, 37, 38, 38, 41, 44, 44, 43, 42, 42, 39, 36, 2, 5, 8, 35, 34, 33, 15, 12, 9, 18, 19, 20], "B_1": [36, 37, 38, 38, 41, 44, 44, 43, 42, 42, 39, 36, 2, 5, 8, 35, 34, 33, 15, 12, 9, 18, 19, 20], "D_-1": [9, 10, 11, 11, 14, 17, 17, 16, 15, 15, 12, 9, 18, 21, 24, 36, 39, 42, 27, 30, 33, 45, 48, 51], "D_1": [9, 10, 11, 11, 14, 17, 17, 16, 15, 15, 12, 9, 18, 21, 24, 36, 39, 42, 27, 30, 33, 45, 48, 51], "F_-1": [45, 46, 47, 47, 50, 53, 53, 52, 51, 51, 48, 45, 0, 3, 6, 24, 25, 26, 17, 14, 11, 29, 28, 27], "F_1": [45, 46, 47, 47, 50, 53, 53, 52, 51, 51, 48, 45, 0, 3, 6, 24, 25, 26, 17, 14, 11, 29, 28, 27], "L_-1": [18, 19, 20, 20, 23, 26, 26, 25, 24, 24, 21, 18, 0, 1, 2, 44, 43, 42, 9, 10, 11, 45, 46, 47], "L_1": [18, 19, 20, 20, 23, 26, 26, 25, 24, 24, 21, 18, 0, 1, 2, 44, 43, 42, 9, 10, 11, 45, 46, 47], "R_-1": [27, 28, 29, 29, 32, 35, 35, 34, 33, 33, 30, 27, 6, 7, 8, 51, 52, 53, 15, 16, 17, 38, 37, 36], "R_1": [27, 28, 29, 29, 32, 35, 35, 34, 33, 33, 30, 27, 6, 7, 8, 51, 52, 53, 15, 16, 17, 38, 37, 36], "U_-1": [0, 1, 2, 2, 5, 8, 8, 7, 6, 6, 3, 0, 20, 23, 26, 47, 50, 53, 29, 32, 35, 38, 41, 44], "U_1": [0, 1, 2, 2, 5, 8, 8, 7, 6, 6, 3, 0, 20, 23, 26, 47, 50, 53, 29, 32, 35, 38, 41, 44] }, "rotateIdxs_old": { "B_-1": [38, 41, 44, 44, 43, 42, 42, 39, 36, 36, 37, 38, 18, 19, 20, 2, 5, 8, 35, 34, 33, 15, 12, 9], "B_1": [42, 39, 36, 36, 37, 38, 38, 41, 44, 44, 43, 42, 35, 34, 33, 15, 12, 9, 18, 19, 20, 2, 5, 8], "D_-1": [11, 14, 17, 17, 16, 15, 15, 12, 9, 9, 10, 11, 45, 48, 51, 18, 21, 24, 36, 39, 42, 27, 30, 33], "D_1": [15, 12, 9, 9, 10, 11, 11, 14, 17, 17, 16, 15, 36, 39, 42, 27, 30, 33, 45, 48, 51, 18, 21, 24], "F_-1": [47, 50, 53, 53, 52, 51, 51, 48, 45, 45, 46, 47, 29, 28, 27, 0, 3, 6, 24, 25, 26, 17, 14, 11], "F_1": [51, 48, 45, 45, 46, 47, 47, 50, 53, 53, 52, 51, 24, 25, 26, 17, 14, 11, 29, 28, 27, 0, 3, 6], "L_-1": [20, 23, 26, 26, 25, 24, 24, 21, 18, 18, 19, 20, 45, 46, 47, 0, 1, 2, 44, 43, 42, 9, 10, 11], "L_1": [24, 21, 18, 18, 19, 20, 20, 23, 26, 26, 25, 24, 44, 43, 42, 9, 10, 11, 45, 46, 47, 0, 1, 2], "R_-1": [29, 32, 35, 35, 34, 33, 33, 30, 27, 27, 28, 29, 38, 37, 36, 6, 7, 8, 51, 52, 53, 15, 16, 17], "R_1": [33, 30, 27, 27, 28, 29, 29, 32, 35, 35, 34, 33, 51, 52, 53, 15, 16, 17, 38, 37, 36, 6, 7, 8], "U_-1": [2, 5, 8, 8, 7, 6, 6, 3, 0, 0, 1, 2, 38, 41, 44, 20, 23, 26, 47, 50, 53, 29, 32, 35], "U_1": [6, 3, 0, 0, 1, 2, 2, 5, 8, 8, 7, 6, 47, 50, 53, 29, 32, 35, 38, 41, 44, 20, 23, 26] }, "state": [2, 5, 8, 1, 4, 7, 0, 3, 6, 11, 14, 17, 10, 13, 16, 9, 12, 15, 20, 23, 26, 19, 22, 25, 18, 21, 24, 29, 32, 35, 28, 31, 34, 27, 30, 33, 42, 39, 36, 43, 40, 37, 44, 41, 38, 47, 50, 53, 46, 49, 52, 45, 48, 51], "stateToFE": [2, 5, 8, 1, 4, 7, 0, 3, 6, 11, 14, 17, 10, 13, 16, 9, 12, 15, 20, 23, 26, 19, 22, 25, 18, 21, 24, 29, 32, 35, 28, 31, 34, 27, 30, 33, 42, 39, 36, 43, 40, 37, 44, 41, 38, 47, 50, 53, 46, 49, 52, 45, 48, 51] }
            setStickerColors(response["state"]);
            rotateIdxs_old = response["rotateIdxs_old"];
            rotateIdxs_new = response["rotateIdxs_new"];
            stateToFE = response["stateToFE"];
            FEToState = response["FEToState"];
            legalMoves = response["legalMoves"]
            enableInput();
            console.log(error);
        },
    });
    $('#tijiao').click(function () {
        scrambleCube2()
        $.ajax({
        url: '/solvetext',
        data: {
            "white": document.getElementById('cube_white').value,
            "yellow": document.getElementById('cube_yellow').value,
            "orange": document.getElementById('cube_orange').value,
            "red": document.getElementById('cube_red').value,
            "blue": document.getElementById('cube_blue').value,
            "green": document.getElementById('cube_green').value
        },
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            solveStartState = JSON.parse(JSON.stringify(state))
            solveMoves = response["moves"];
            solveMoves_rev = response["moves_rev"];
            solution_text = response["solve_text"];
            solution_text.push("SOLVED!")
            setSolnText(true);
            moves = JSON.parse(JSON.stringify(solveMoves))
            setTimeout(function () { nextState(500) }, 500);
        },
        error: function (error) {
            console.log(error);
            document.getElementById("solution_text").innerHTML = "..."
            setTimeout(function () { solveCube() }, 500);
        },
    });
    });

    $("#cube").css("transform", "translateZ( -100px) rotateX( " + rotX + "deg) rotateY(" + rotY + "deg)"); //Initial orientation -30	

    $('#scramble').click(function () {
        scrambleCube()
    });

    $('#solve').click(function () {
        solveCube()
    });

    $('#first_state').click(function () {
        if (solveIdx > 0) {
            moves = solveMoves_rev.slice(0, solveIdx).reverse();
            solveIdx = 0;
            nextState();
        }
    });

    $('#prev_state').click(function () {
        if (solveIdx > 0) {
            solveIdx = solveIdx - 1
            moves.push(solveMoves_rev[solveIdx])
            nextState()
        }
    });

    $('#next_state').click(function () {
        if (solveIdx < solveMoves.length) {
            moves.push(solveMoves[solveIdx])
            solveIdx = solveIdx + 1
            nextState()
        }
    });

    $('#last_state').click(function () {
        if (solveIdx < solveMoves.length) {
            moves = solveMoves.slice(solveIdx, solveMoves.length);
            solveIdx = solveMoves.length
            nextState();
        }
    });
    // 键盘对按钮控制效果
    document.onkeydown = function (event) {
        var e = event || window.event || arguments.callee.caller.arguments[0];
        if (e && e.keyCode == 38) {
            scrambleCube()
        }
        if (e && e.keyCode == 37) {
            if (solveIdx > 0) {
                moves = solveMoves_rev.slice(0, solveIdx).reverse();
                solveIdx = 0;
                nextState();
            }
        }
        if (e && e.keyCode == 39) {
            if (solveIdx < solveMoves.length) {
                moves.push(solveMoves[solveIdx])
                solveIdx = solveIdx + 1
                nextState()
            }
        }
        if (e && e.keyCode == 40) {
            solveCube()
        }
    };
    document.onkeydown = function (event) {
        var e = event || window.event || arguments.callee.caller.arguments[0];
        if (e && e.keyCode == 38) {
            scrambleCube()
        }
    };

    //鼠标对魔方的移动效果
    $('#cube_div').on("mousedown", function (ev) {
        lastMouseX = ev.clientX;
        lastMouseY = ev.clientY;
        $('#cube_div').on("mousemove", mouseMoved);
    });
    $('#cube_div').on("mouseup", function () {
        $('#cube_div').off("mousemove", mouseMoved);
    });
    $('#cube_div').on("mouseleave", function () {
        $('#cube_div').off("mousemove", mouseMoved);
    });

    console.log("ready!");
}));


function mouseMoved(ev) {
    var deltaX = ev.pageX - lastMouseX;
    var deltaY = ev.pageY - lastMouseY;

    lastMouseX = ev.pageX;
    lastMouseY = ev.pageY;

    rotY += deltaX * 0.2;
    rotX -= deltaY * 0.5;

    $("#cube").css("transform", "translateZ( -100px) rotateX( " + rotX + "deg) rotateY(" + rotY + "deg)");
}






// 对于右面按钮的实现
var text01=null;          //"9,12,26,52,4,41,35,3,44,";
var text02=null;           //"15,7,6,16,13,48,24,1,27,";
var text03=null;          //"42,28,38,43,22,21,11,30,33,";
var text04=null;           //"2,5,47,25,31,37,53,14,17,";
var text05=null;            //"45,23,51,19,40,34,18,39,0,";
var text06=null;              //"8,50,20,10,49,46,36,32,29";
//var states=[text01,text02,text03,text04,text05,text06]
var states=[];
function scrambleCube2(){
    text01 = $('#cube_white').val().replace(/\s*/g,"");
    text02 = $('#cube_yellow').val().replace(/\s*/g,"");
    text03 = $('#cube_orange').val().replace(/\s*/g,"");
    text04 = $('#cube_red').val().replace(/\s*/g,"");
    text05 = $('#cube_blue').val().replace(/\s*/g,"");
    text06 = $('#cube_green').val().replace(/\s*/g,"");
    //disableInput();
    clearSoln();   //把一些必要东西设置为空，然后触发上边四个button的blur事件  
    states = (text01 +","+ text02 +","+ text03 +","+ text04 +","+ text05 +","+text06).split(',');  //moves里存键盘按钮操作
    // console.log(states);
    state=states;
    // console.log("state:"+state)
    state_rep = reOrderArray(state, FEToState)    //返回state[FEToState[i]]数组
    // console.log("state_rep"+state_rep)
    newState_rep = JSON.parse(JSON.stringify(state_rep))//js对象先转换为json对象再转换为js对象
    // console.log("json转化为字符串后的state"+JSON.stringify(state_rep))
    // console.log("newstate_rep"+newState_rep)
    //convert back to HTML representation
    //对魔方进行打乱
    newState = reOrderArray(newState_rep, stateToFE)
    // console.log(nextState)
    //set new state
    setStickerColors(newState)




    // states = text01 + text02 + text03 + text04 + text05 + text06;  //moves里存键盘按钮操作
    // moves=states.split(',');

}

