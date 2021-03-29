import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ImageBackground } from 'react-native';
import Cell from './Cell';
import {
    initBoardData,
    revealEmpty,
    getHidden,
    getMines,
    getFlags,
} from '../helpers/board-helpers.js';
import PopUp from './PopUp';

const config = {
    height: 9,
    width: 9,
    mines: 10,
};

const Board = () => {
    const initialState = {
        boardData: initBoardData(config.height, config.width, config.mines),
        gameStatus: '',
        mineCount: config.mines,
    };

    const [state, setState] = useState(initialState);

    const [modalVsible, setModal] = useState(false);

    // modal pops up when game status changes
    useEffect(() => {
        state.gameStatus ? setModal(true) : null;
    }, [state.gameStatus]);

    // game reset
    const retry = () => {
        setModal(false);
        setState(initialState);
    };

    // Game over, reveals the whole board
    const revealBoard = result => {
        let newBoardData = state.boardData;
        newBoardData.map(row => {
            row.map(item => {
                item.isRevealed = true;
            });
        });
        setState({ ...state, boardData: newBoardData, gameStatus: result });
    };

    const handleCellClick = (x, y) => {
        if (state.boardData[x][y].isMine) {
            return revealBoard('Kaotasid.');
        }

        let newBoardData = state.boardData;
        newBoardData[x][y].isFlagged = false;
        newBoardData[x][y].isRevealed = true;

        if (newBoardData[x][y].isEmpty) {
            newBoardData = revealEmpty(
                x,
                y,
                newBoardData,
                config.height,
                config.width
            );
        }

        if (getHidden(newBoardData).length === config.mines) {
            return revealBoard('Võitsid!');
        }

        setState({ ...state, boardData: newBoardData });
    };

    const handleLongPress = (x, y) => {
        let newBoardData = state.boardData;
        let mines = state.mineCount;

        if (newBoardData[x][y].isFlagged) {
            newBoardData[x][y].isFlagged = false;
            mines++;
        } else {
            newBoardData[x][y].isFlagged = true;
            mines--;
        }

        if (mines === 0) {
            const mineArray = getMines(newBoardData);
            const FlagArray = getFlags(newBoardData);
            if (JSON.stringify(mineArray) === JSON.stringify(FlagArray)) {
                return revealBoard('Võitsid!');
            }
        }

        setState({ ...state, boardData: newBoardData, mineCount: mines });
    };

    return (
        <ImageBackground
            source={{ uri: './images/background.png' }}
            style={{ width: 410, height: 700 }}
        >
            <View style={styles.container}>
                <Text style={styles.title}>Minesweeper</Text>
                <Text style={styles.tipText}>
                    Miine alles: {state.mineCount}
                </Text>
                <View style={styles.board}>
                    {state.boardData.map(row =>
                        row.map(item => (
                            <View key={item.x * row.length + item.y}>
                                <Cell
                                    onClick={() =>
                                        handleCellClick(item.x, item.y)
                                    }
                                    onLongPress={e =>
                                        handleLongPress(item.x, item.y)
                                    }
                                    value={item}
                                />
                            </View>
                        ))
                    )}
                    <Text style={styles.tipText}>Hoia nuppu all, et 🚩</Text>
                    <PopUp
                        modalVsible={modalVsible}
                        close={retry}
                        gameStatus={state.gameStatus}
                    />
                </View>
            </View>
        </ImageBackground>
    );
};

export default Board;

const styles = StyleSheet.create({
    container: {
        marginTop: 60,
    },
    board: {
        marginTop: 15,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        flexWrap: 'wrap',
    },
    tipText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'normal',
        textAlign: 'center',
        marginTop: 15,
    },
    title2: {
        marginTop: 15,
        flex: 1,
        fontSize: 30,
        color: 'green',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    title: {
        color: 'lightcyan',
        fontSize: 30,
        textAlign: 'center',
    },
});
