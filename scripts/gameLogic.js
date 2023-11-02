let game = (function() {

    const tablero = ["","","","","","","","",""];
    const ganador = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];

    let $modulo = $('#gameModule');
    let $tablero = $modulo.find('ul');
    let plantilla = $modulo.find('#ttt-template').html();
    let jugadas = 0;
    let $cuadroGanador = $('div.ganador');
    let $buttonRestart;
    let g = null;
    
    
    renderTablero()
    
    let $celda = $tablero.find('div');
    let celdas = Array.from($celda);

    $tablero.delegate('div.cell', 'click', jugada);

    function renderTablero() {
        $tablero.html(Mustache.render(plantilla, {gameboard : tablero}));
    }

    function renderGanador(ganador) {
        
        $buttonRestart = $('<input/>').attr({
            class: "btnRestart",
            type: "button",
            value: "Comenzar de nuevo",
        });

        $buttonRestart.on('click', reiniciar);
        if(ganador != 'iguales'){
            $cuadroGanador.html(`<p>Las ${ganador} han ganado!</p>`);
            $cuadroGanador.append($buttonRestart);
        } else {
            $cuadroGanador.html(`<p>Ha habido un empate !!!</p>`);
            $cuadroGanador.append($buttonRestart);
        }
    }

    function reiniciar() {
        g = null;
        players.resetMoves();
        //players.setActivePlayer();
        limpiarTablero();
        $cuadroGanador.text("")
        $cuadroGanador.remove($buttonRestart);
    }

    function jugada(e) {
        if(e.target.innerText) return;
        if(g) return; 
        insertartMarca(e);
        let a = $(e.target).closest('li');
        let index = $tablero.find('li').index(a);
        tablero[index] = players.getActivePlayer();
        players.setPlayerMove(index);
        //players.setActivePlayer();
        jugadas++;
        insertarJugadaAi(e);
        
        g = checkWin(ganador);
        if(g === null && checkFullBoard().length === 0){
            g = 'iguales'
        }
        if (g) {
            renderGanador(g);

        }
    }

    function insertarJugadaAi(e) {
        if(checkFullBoard().length === 0) return;
        let indice;
        if(!g) {
            indice = ai().index;
        } else {
            return;
        }
        $modulo.find('ul li div')[indice].innerText = ai().mark;
        jugadas++;
        
        
    }

    function insertartMarca(e) {
        let $celda = $(e.target).closest('div');
        $celda.append(players.getActivePlayer());    
    }

    function limpiarTablero() {
        celdas.forEach(elem => {
            elem.innerText = '';
        })
    }

    function checkWin(matrix) {
        let [player1, player2] = players.getPlayerMoves();
        let ganador = '';
        let marcados = Array.from(celdas);
        let controlPlayer1 = 0;
        let controlPlayer2 = 0;
        

        player1.sort();
        player2.sort();

        for(let i = 0; i < matrix.length; i++) {
            for(let j = 0; j < matrix[i].length; j++){
                if(marcados[matrix[i][j]].innerText === 'X') {
                controlPlayer1++;
                }
                if(controlPlayer1 === 3) {
                    ganador = 'X'
                    return ganador;
                }
                
            }

            for(let j = 0; j < matrix[i].length; j++){
                if(marcados[matrix[i][j]].innerText === 'O') {
                controlPlayer2++;
                }
                if(controlPlayer2 === 3) {
                    ganador = 'O'
                    return ganador;
                }
                
            }

            controlPlayer1 = 0;
            controlPlayer2 = 0;
        }
        return null;
    }

    function getBoard() {
        return tablero;
    }

    function getBoardCurrentState() {
        return celdas;
    }

    function checkFullBoard() {
        let indexesBoard = Array.from(getBoardCurrentState());
        let board = [];

        indexesBoard.forEach((e, index) => {
        
            if($(e).text()){
                board.push($(e).text());
            } else {
                board.push(index);
            }
        });

        let a = board.filter(i => (i != 'X' && i != 'O'));

        return a;
        
    }
    
    return {
        getBoard,
        getBoardCurrentState
    }
})()

let players = (function (){

    const player1 = 'X';
    const player2 = 'O';
    let activePlayer = '';
    let player1Move = [];
    let player2Move = [];
    
    setActivePlayer();
    mostrarJugadores();

    function setActivePlayer() {
        if(activePlayer === 'O') {
            activePlayer = 'X';
            return;
        }
        activePlayer = (activePlayer === 'X') ? player2 : player1;
    }

    function getActivePlayer() {
       return activePlayer; 
    }

    function setPlayerMove(index) {
        switch(activePlayer) {
            case 'X':
                player1Move.push(index);
                break;
            case 'O':
                player2Move.push(index);
                break;
        }
    }

    function getPlayerMoves() {
        return [ 
            player1Move,
            player2Move
        ]
    }

    function resetMoves() {
        player1Move = [];
        player2Move = [];
    }

    function mostrarJugadores() {
        let $j1 = $('.jugador-uno');
        let $j2 = $('.jugador-dos');

        $j1.text(`Jugador 1: ${player1}`);
        $j2.text(`IA: ${player2}`);
    }

    return {
        getActivePlayer,
        setPlayerMove,
        getPlayerMoves,
        setActivePlayer,
        resetMoves,
        mostrarJugadores
    }

})()