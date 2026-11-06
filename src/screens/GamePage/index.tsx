import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ImageBackground } from 'react-native';
import { useDispatch } from 'react-redux';
import mainStyles from '../../styles/main_styles';
import { t } from 'i18next';
import { RootStackParamList } from '../../navigation/router';
import { RouteProp } from '@react-navigation/native';
import SelectionModal from './SelectionModal';
import EndOfGameModal from './EndOfGameModal';
import { reset } from '../../utils/navigationMethod';
import BoardSizeModal from './BoardSizeModal';
import Ionicons from "@react-native-vector-icons/ionicons";

type GameProps = RouteProp<RootStackParamList, 'GamePage'>;

type Props = {
  route: GameProps;
}

const GamePage: React.FC<Props> = ({ route }) => {

  const dispatch = useDispatch();

  const { playerMode } = route.params;
  const [boardSize, setBoardSize] = useState<number>(3); //3x3, 4x4 5x5
  const [board, setBoard] = useState<(number | null)[][]>(Array(3).fill(null).map(() => Array(3).fill(null)));

  const [showSelectionModal, setShowSelectionModal] = useState<boolean>(false);
  const [endOfGameModalVisible, setEndOfGameModalVisible] = useState<boolean>(false);
  const [openBoardSizeModal, setOpenBoardSizeModal] = useState<boolean>(false);
  const [activeCell, setActiveCell] = useState<{ row: number, col: number } | null>(null);
  const [sosLines, setSosLines] = useState<{ row1: number, col1: number, row2: number, col2: number, color: string }[]>([]);
  const [aiHeuristic, setAiHeuristic] = useState<1 | 2>(1);

  const [activeTurn, setActiveTurn] = useState<boolean>(false); //human vs human false is player 1 (human vs ai false is human true is AI)
  const [player1sos, setPlayer1sos] = useState<number>(0); //human
  const [player2sos, setPlayer2sos] = useState<number>(0); //ai
  const [winner, setWinner] = useState<number | null>(null);

  const [AIsTurn, setAIsTurn] = useState<boolean>(false);
  const [gameStarted, setGameStarted] = useState<boolean>(false);

  useEffect(() => {
    console.log('playerMode', playerMode);
  }, [playerMode])

  useEffect(() => {
    // Reset the board when boardSize changes
    setBoard(Array(boardSize).fill(null).map(() => Array(boardSize).fill(null)));
  }, [boardSize])

  /*minimax with alpha beta pruning
  max : AI
  min : HUMAN
  */

  useEffect(() => {
    if (winner === null) return;
    setEndOfGameModalVisible(true);
  }, [winner])

  useEffect(() => {
    if (playerMode === 1 || !gameStarted) return; // Human vs Human

    if (playerMode === 0) {
      if (!activeTurn) return;
      setAIsTurn(true);
      setTimeout(() => {
        callMiniMax(true, aiHeuristic); // activeTurn is true, which is AI (Player 2)
      }, 1000);
    } else if (playerMode === 2) {
      setAIsTurn(true);
      setTimeout(() => {
        // activeTurn === false is Player 1 (H1), activeTurn === true is Player 2 (H2)
        callMiniMax(activeTurn, activeTurn ? 2 : 1);
      }, 1000);
    }
  }, [playerMode, activeTurn, aiHeuristic, gameStarted])

  const renderBox = (row: number, col: number, value: number | null) => {
    return (
      <TouchableOpacity
        key={`${row}-${col}`}
        style={mainStyles.box}
        onPress={() => {
          if (value === null) {
            setActiveCell({ row, col });
            setShowSelectionModal(true);
          }
        }}
        disabled={value !== null || AIsTurn || playerMode === 2}
      >
        {value !== null &&
          <Text style={mainStyles.boxTxt}>{value === 1 ? "S" : "O"}</Text>
        }
      </TouchableOpacity>
    )
  }

  const renderGameBoard = () => {
    return (
      <View>
        {board.map((row, i) => (
          <View key={i} style={{ flexDirection: 'row' }}>
            {row.map((cellValue, j) => (
              renderBox(i, j, cellValue)
            ))}
          </View>
        ))}
        {sosLines.map((line, index) => {
          const x1 = line.col1 * 50 + 25;
          const y1 = line.row1 * 50 + 25;
          const x2 = line.col2 * 50 + 25;
          const y2 = line.row2 * 50 + 25;

          const cx = (x1 + x2) / 2;
          const cy = (y1 + y2) / 2;
          const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
          const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;

          return (
            <View key={`line-${index}`} style={{
              position: 'absolute',
              left: cx - length / 2,
              top: cy - 2,
              width: length,
              height: 4,
              backgroundColor: line.color,
              transform: [{ rotate: `${angle}deg` }],
              zIndex: 10
            }} pointerEvents="none" />
          )
        })}
      </View>
    )
  }

  const makeSelection = (value: number) => {
    if (activeCell) {
      const newBoard = [...board];
      newBoard[activeCell.row] = [...newBoard[activeCell.row]];
      newBoard[activeCell.row][activeCell.col] = value;
      setBoard(newBoard);
      playMove(value, activeCell, activeTurn, newBoard);
      setActiveCell(null);
      setActiveTurn(!activeTurn); //pass the move to other player
    }
  }

  const makeAiSelection = (row: number, col: number, value: number) => {
    const newBoard = [...board];
    newBoard[row] = [...newBoard[row]];
    newBoard[row][col] = value;
    setBoard(newBoard);
    playMove(value, { row, col }, activeTurn, newBoard);
    setActiveTurn(!activeTurn); // toggle the turn to the next player
    setAIsTurn(false); // unlock board
  }

  const callMiniMax = (isPlayer2: boolean, heuristic: 1 | 2) => {
    let emptyCells = 0;
    for (let r = 0; r < boardSize; r++) {
      for (let c = 0; c < boardSize; c++) {
        if (board[r][c] === null) emptyCells++;
      }
    }

    let targetDepth = 4;
    if (playerMode === 2) {
      if (emptyCells < 8) targetDepth = 5;
      else if (emptyCells < 12) targetDepth = 4;
      else targetDepth = 3;
    }

    let bestScore = -Infinity;
    let bestMove: { row: number, col: number, value: number } | null = null;

    const simulatedBoard = board.map(row => [...row]);

    const myScore = isPlayer2 ? player2sos : player1sos;
    const opponentScore = isPlayer2 ? player1sos : player2sos;

    for (let r = 0; r < boardSize; r++) {
      for (let c = 0; c < boardSize; c++) {
        if (simulatedBoard[r][c] === null) {
          for (const val of [0, 1]) {
            simulatedBoard[r][c] = val;
            const earnedPoints = getSosMatches(r, c, val, simulatedBoard).length;

            const score = minimax(simulatedBoard, targetDepth - 1, false, -Infinity, Infinity, myScore + earnedPoints, opponentScore, heuristic);

            simulatedBoard[r][c] = null;

            if (score > bestScore || bestMove === null) {
              bestScore = score;
              bestMove = { row: r, col: c, value: val };
            }
          }
        }
      }
    }

    if (bestMove) {
      makeAiSelection(bestMove.row, bestMove.col, bestMove.value);
    }
  }

  const evaluateH1 = (aiScore: number, humanScore: number) => {
    return aiScore - humanScore;
  }

  const evaluateH2 = (simulatedBoard: (number | null)[][], aiScore: number, humanScore: number) => {
    let score = (aiScore - humanScore) * 10;
    // Prefer placing 'S' in corners and edges (less likely to be used by opponent immediately)
    for (let r = 0; r < boardSize; r++) {
      for (let c = 0; c < boardSize; c++) {
        if (simulatedBoard[r][c] === 1) { // 'S'
          if (r === 0 || r === boardSize - 1 || c === 0 || c === boardSize - 1) {
            score += 0.1;
          }
        }
      }
    }
    return score;
  }

  const minimax = (simulatedBoard: (number | null)[][], depth: number, isMaximizing: boolean, alpha: number, beta: number, myScore: number, opponentScore: number, heuristic: 1 | 2): number => {
    if (depth === 0 || endOfGame(simulatedBoard)) {
      if (heuristic === 1) return evaluateH1(myScore, opponentScore);
      return evaluateH2(simulatedBoard, myScore, opponentScore);
    }

    if (isMaximizing) {
      let maxEval = -Infinity;
      for (let r = 0; r < boardSize; r++) {
        for (let c = 0; c < boardSize; c++) {
          if (simulatedBoard[r][c] === null) {
            for (const val of [0, 1]) {
              simulatedBoard[r][c] = val;
              const earnedPoints = getSosMatches(r, c, val, simulatedBoard).length;
              const ev = minimax(simulatedBoard, depth - 1, false, alpha, beta, myScore + earnedPoints, opponentScore, heuristic);
              simulatedBoard[r][c] = null;

              maxEval = Math.max(maxEval, ev);
              alpha = Math.max(alpha, ev);
              if (beta <= alpha) break;
            }
          }
          if (beta <= alpha) break;
        }
        if (beta <= alpha) break;
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (let r = 0; r < boardSize; r++) {
        for (let c = 0; c < boardSize; c++) {
          if (simulatedBoard[r][c] === null) {
            for (const val of [0, 1]) {
              simulatedBoard[r][c] = val;
              const earnedPoints = getSosMatches(r, c, val, simulatedBoard).length;
              const ev = minimax(simulatedBoard, depth - 1, true, alpha, beta, myScore, opponentScore + earnedPoints, heuristic);
              simulatedBoard[r][c] = null;

              minEval = Math.min(minEval, ev);
              beta = Math.min(beta, ev);
              if (beta <= alpha) break;
            }
          }
          if (beta <= alpha) break;
        }
        if (beta <= alpha) break;
      }
      return minEval;
    }
  }

  const getSosMatches = (r: number, c: number, value: number, currentBoard: (number | null)[][]) => {
    const matches: { row1: number, col1: number, row2: number, col2: number }[] = [];
    if (value === 1) { // 'S'
      const directions = [
        [0, -1], [0, 1], [-1, 0], [1, 0],
        [-1, -1], [1, 1], [-1, 1], [1, -1]
      ];
      for (const [dr, dc] of directions) {
        if (
          r + 2 * dr >= 0 && r + 2 * dr < boardSize &&
          c + 2 * dc >= 0 && c + 2 * dc < boardSize
        ) {
          if (currentBoard[r + dr][c + dc] === 0 && currentBoard[r + 2 * dr][c + 2 * dc] === 1) {
            matches.push({ row1: r, col1: c, row2: r + 2 * dr, col2: c + 2 * dc });
          }
        }
      }
    } else if (value === 0) { // 'O'
      const axes = [
        [[0, -1], [0, 1]], // horizontal
        [[-1, 0], [1, 0]], // vertical
        [[-1, -1], [1, 1]], // diagonal 1
        [[-1, 1], [1, -1]]  // diagonal 2
      ];
      for (const [[dr1, dc1], [dr2, dc2]] of axes) {
        if (
          r + dr1 >= 0 && r + dr1 < boardSize && c + dc1 >= 0 && c + dc1 < boardSize &&
          r + dr2 >= 0 && r + dr2 < boardSize && c + dc2 >= 0 && c + dc2 < boardSize
        ) {
          if (currentBoard[r + dr1][c + dc1] === 1 && currentBoard[r + dr2][c + dc2] === 1) {
            matches.push({ row1: r + dr1, col1: c + dc1, row2: r + dr2, col2: c + dc2 });
          }
        }
      }
    }
    return matches;
  }

  const playMove = (value: number, activeCell: { row: number, col: number }, activeTurn: boolean, newBoard: (number | null)[][]) => {
    const r = activeCell.row;
    const c = activeCell.col;
    const matches = getSosMatches(r, c, value, newBoard);
    const sosCount = matches.length;

    const lineColor = activeTurn ? 'green' : 'red';
    const newLines = matches.map(m => ({ ...m, color: lineColor }));

    let p1Sos = player1sos;
    let p2Sos = player2sos;

    if (sosCount > 0) {
      if (activeTurn) {
        p2Sos += sosCount;
        setPlayer2sos(p2Sos);
      } else {
        p1Sos += sosCount;
        setPlayer1sos(p1Sos);
      }
      setSosLines(prev => [...prev, ...newLines]);
    }

    if (endOfGame(newBoard)) {
      endTheGame(p1Sos, p2Sos);
    }
  }

  const endOfGame = (newBoard: (number | null)[][]) => {
    for (let i = 0; i < newBoard.length; i++) {
      for (let j = 0; j < newBoard[i].length; j++) {
        if (newBoard[i][j] === null) {
          return false;
        }
      }
    }
    return true;
  }

  const endTheGame = (finalPlayer1Sos: number, finalPlayer2Sos: number) => {
    if (finalPlayer1Sos > finalPlayer2Sos) {
      setWinner(1);
    } else if (finalPlayer2Sos > finalPlayer1Sos) {
      setWinner(2);
    } else {
      setWinner(0); //tie
    }
  }

  const restartGame = () => {
    setBoard(Array(boardSize).fill(null).map(() => Array(boardSize).fill(null)));
    setPlayer1sos(0);
    setPlayer2sos(0);
    setActiveTurn(false);
    setWinner(null);
    setEndOfGameModalVisible(false);
    setSosLines([]);
  }

  const goToMainMenu = () => {
    setBoard(Array(boardSize).fill(null).map(() => Array(boardSize).fill(null)));
    setPlayer1sos(0);
    setPlayer2sos(0);
    setActiveTurn(false);
    setWinner(null);
    setEndOfGameModalVisible(false);
    setSosLines([]);
    reset('Landing');
  }

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground source={require('../../assets/images/background_image.jpg')}
        style={mainStyles.imageStyle}>

        <View style={{ ...mainStyles.boardSizeTxt, flexDirection: 'row', gap: 15 }}>
          {playerMode === 0 && (
            <TouchableOpacity onPress={() => setAiHeuristic(aiHeuristic === 1 ? 2 : 1)}>
              <Text style={{ ...mainStyles.scoreText, color: "#FFD700" }}>{`AI: H${aiHeuristic}`}</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={() => setOpenBoardSizeModal(true)}>
            <Text style={{ ...mainStyles.scoreText, color: "#FFFFFF" }}>{t('boardSize') + ": " + boardSize + "x" + boardSize}</Text>
          </TouchableOpacity>
        </View>

        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

          <View style={mainStyles.scoreContainer}>
            <Text style={{ ...mainStyles.scoreText, color: "#FFFFFF" }}>{playerMode === 0 ? t('sen') : playerMode === 2 ? "AI 1 (H1)" : t('player1')} {": " + player1sos}</Text>
          </View>

          {gameStarted && (
            <View style={{ alignItems: 'center', gap: 10, marginVertical: 100 }}>
              {!activeTurn ? (
                <>
                  <Ionicons name={"caret-down"} color="#FFFFFF" size={60} />
                  <Text style={{ ...mainStyles.playerTxt, ...(!activeTurn && { color: "#FFFFFF" }) }}>{playerMode === 0 ? t('sen') : playerMode === 2 ? "AI 1 (H1)" : t('player1')}</Text>
                </>
              ) : null}
            </View>
          )}

          {gameStarted ?
            renderGameBoard() :
            (
              <TouchableOpacity style={mainStyles.button}
                onPress={() => setGameStarted(true)}>
                <Text style={{ ...mainStyles.scoreText, color: "#FFFFFF" }}>{t('basla')}</Text>
              </TouchableOpacity>
            )}

          {gameStarted && (
            <View style={{ alignItems: 'center', gap: 10, marginVertical: 100 }}>
              {activeTurn ? (
                <>
                  <Ionicons name={"caret-up"} color="#FFFFFF" size={60} />
                  <Text style={{ ...mainStyles.playerTxt, ...(activeTurn && { color: "#FFFFFF" }) }}>{playerMode === 0 ? t('sosGuru') : playerMode === 2 ? "AI 2 (H2)" : t('player2')}</Text>
                </>
              ) : null}
            </View>
          )}

          <View style={mainStyles.scoreContainer}>
            <Text style={{ ...mainStyles.scoreText, color: "#FFFFFF" }}>{playerMode === 0 ? t('sosGuru') : playerMode === 2 ? "AI 2 (H2)" : t('player2')} {": " + player2sos}</Text>
          </View>

          <SelectionModal
            visible={showSelectionModal}
            onClose={() => setShowSelectionModal(false)}
            onSelect={(value) => makeSelection(value)} />

          {endOfGameModalVisible && winner !== null &&
            <EndOfGameModal
              visible={true}
              winner={winner}
              player1sos={player1sos}
              player2sos={player2sos}
              onClose={() => setEndOfGameModalVisible(false)}
              onRestart={() => restartGame()}
              onGoToMainMenu={() => goToMainMenu()} />
          }

          <BoardSizeModal
            visible={openBoardSizeModal}
            onClose={() => setOpenBoardSizeModal(false)}
            onSelect={(value) => { setBoardSize(value), setOpenBoardSizeModal(false), restartGame() }}
          />

        </View>
      </ImageBackground>
    </View>
  );
};

export default GamePage;
