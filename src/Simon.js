/*
general desc:
when the play button is clicked, the current player is simon. the useEffect will trigger a function that will "flash" a button (change its value to 0) 
*/
import { useEffect, useState, useRef, useCallback } from 'react';
import timeout from './utils/util';

const colors = ['red', 'yellow', 'blue', 'green'];

const Simon = () => {
  //state will have
  // -> the sequence to execute
  const [sequence, setSequence] = useState([]);
  const [userInput, setUserInput] = useState([]);
  // const [playerWon, setPlayerWon] = useState(true);
  const [gameStatus, setGameStatus] = useState('not-started');
  const [score, setScore] = useState(0);
  // -> the sequence pressed after play
  const [currentPlayer, setCurrentPlayer] = useState('player');
  // -> whether the current player is simon or the user
  // -> button values
  // const [buttonValues, setButtonValues] = useState({
  //   1: '1',
  //   2: '2',
  //   3: '3',
  //   4: '4',
  // });

  const redRef = useRef(null);
  const yellowRef = useRef(null);
  const greenRef = useRef(null);
  const blueRef = useRef(null);

  //lets back up a little bit here and describe the user flow

  //the player clicks play, and its simons turn. simon then flashes the sequnce. then the current player becomes  player1.  player1 inputs the sequence, and when the sequence lenght matches, check for the equality. if they are equal, increment the score and add to the sequence, if they are not, flash the buttons again.

  const flashBtns = useCallback(async () => {
    for (let i = 0; i < sequence.length; i++) {
      let ref = null;
      //seq is going to be ['red','blue'....]
      //if the cuyrrent el of seq at the current index is equal to colors[i], we want to update the ref variable to the appropriate {color}Ref
      switch (sequence[i]) {
        case 'red':
          ref = redRef;
          break;
        case 'blue':
          ref = blueRef;
          break;
        case 'yellow':
          ref = yellowRef;
          break;
        case 'green':
          ref = greenRef;
          break;
        default:
          break;
      }
      //then we want to update the classList of the current ref to append flash button class
      ref.current.classList.add('flash-button');
      await timeout(500);
      ref.current.classList.remove('flash-button');
      await timeout(200);
    }
    setCurrentPlayer('player');
  }, [sequence]);

  const addToSeq = useCallback(() => {
    const newSeq = [...sequence];
    const nextVal = Math.floor(Math.random() * colors.length);
    newSeq.push(colors[nextVal]);
    setSequence(newSeq);
  }, [sequence]);

  const startGame = () => {
    console.log('game started!');
    console.log('sequence at game start is', sequence);
    addToSeq();
    setCurrentPlayer('simon');
    setGameStatus('playing');
  };

  const updateUserInput = (e) => {
    if (currentPlayer === 'player') {
      const button = e.target;
      const newUserInput = [...userInput];
      newUserInput.push(e.target.value);
      setUserInput(newUserInput);
      button.classList.add('button-pressed');
      setTimeout(() => {
        button.classList.remove('button-pressed');
      }, 100);
    }
  };

  useEffect(() => {
    if (currentPlayer === 'simon' && gameStatus === 'playing') {
      flashBtns();
    }
  }, [currentPlayer]);

  useEffect(() => {
    console.log('userInput', userInput);
    console.log('gameStatus', gameStatus);
    //check if the player lost continutously
    if (sequence.slice(0, userInput.length).join('') !== userInput.join('')) {
      setGameStatus('lost');
      setSequence([]);
      setScore(0);
      setUserInput([]);
      return;
    }
    if (userInput.length === sequence.length) {
      //when the player is done inputting
      //if the game is still playing
      if (currentPlayer === 'player' && gameStatus === 'playing') {
        //if the input matches the sequence
        if (sequence.join('') === userInput.join('')) {
          // win condition
          console.log('WINNNNN');
          setScore((s) => s + 1);
          //add another elemetn to the sequence
          addToSeq();
          setCurrentPlayer('simon');
        } else {
          //lose condition
          setGameStatus('lost');
          setSequence([]);
          setScore(0);
        }
        //regardless, reset the user input and switch the player
        setUserInput([]);
      }
    }
  }, [userInput]);

  return (
    <>
      {gameStatus === 'not-started' ? (
        <h1>Press Play to begin!</h1>
      ) : currentPlayer === 'simon' ? (
        <h1>Simon's Turn</h1>
      ) : (
        <h1>Player 1's Turn</h1>
      )}

      <span>
        <button
          style={{
            backgroundColor: 'red',
            borderTopLeftRadius: 100,
          }}
          className='button'
          value='red'
          onClick={updateUserInput}
          ref={redRef}
        >
          {/* {buttonValues[1]} */}
        </button>
        <button
          style={{
            backgroundColor: 'blue',
            borderTopRightRadius: 100,
          }}
          className='button'
          value={'blue'}
          onClick={updateUserInput}
          ref={blueRef}
        >
          {/* {buttonValues[2]} */}
        </button>
      </span>
      <span>
        <button
          style={{
            backgroundColor: 'green',
            borderBottomLeftRadius: 100,
          }}
          value='green'
          className='button'
          onClick={updateUserInput}
          ref={greenRef}
        >
          {/* {buttonValues[3]} */}
        </button>
        <button
          style={{
            backgroundColor: 'yellow',
            borderBottomRightRadius: 100,
          }}
          className='button'
          value={'yellow'}
          onClick={updateUserInput}
          ref={yellowRef}
        >
          {/* {buttonValues[4]} */}
        </button>
      </span>
      <span>
        {gameStatus === 'not-started' && (
          <button
            style={{ fontSize: '20px', padding: '10px 20px', margin: '10px' }}
            onClick={startGame}
          >
            Play!
          </button>
        )}
        {gameStatus === 'playing' && (
          <h3 style={{ margin: '10px' }}>Score: {score}</h3>
        )}
        {gameStatus === 'lost' && (
          <>
            <h3 style={{ margin: '10px' }}>You lost :(</h3>
            <h3 style={{ margin: '10px' }}>Press 'Play' to start again</h3>
            <button
              style={{ fontSize: '20px', padding: '10px 20px', margin: '10px' }}
              onClick={() => {
                console.log(currentPlayer);
                console.log(gameStatus);
                console.log(sequence);
                addToSeq();
                startGame();
              }}
            >
              Play again!
            </button>
          </>
        )}
      </span>
    </>
  );
};

export default Simon;
