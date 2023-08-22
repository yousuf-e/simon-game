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
  const [sequence, setSequence] = useState(['red', 'blue']);
  const [userInput, setUserInput] = useState([]);
  const [playerWon, setPlayerWon] = useState(true);
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
      // const newBtnVals = { ...buttonValues };
      // newBtnVals[sequence[i]] = 'X';
      // setButtonValues(newBtnVals);
      // await timeout(250);
      // setButtonValues({
      //   1: '1',
      //   2: '2',
      //   3: '3',
      //   4: '4',
      // });
      // await timeout(50);

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
    }
  }, [sequence]);

  const startGame = () => {
    setCurrentPlayer('simon');
    setPlayerWon(true);
  };

  const updateUserInput = (e) => {
    console.log(e.target.value);
    const button = e.target;
    const newUserInput = [...userInput];
    newUserInput.push(e.target.value);
    setUserInput(newUserInput);
    button.classList.add('button-pressed');
    setTimeout(() => {
      button.classList.remove('button-pressed');
    }, 250);
  };

  useEffect(() => {
    console.log('current sequence', sequence);
    if (currentPlayer === 'simon') {
      flashBtns();
      setCurrentPlayer('player');
    }
  }, [currentPlayer, flashBtns, sequence]);

  useEffect(() => {
    console.log(userInput);
    if (userInput.length === sequence.length) {
      if (currentPlayer === 'player') {
        if (sequence.join('') === userInput.join('')) {
          // win condition
          console.log('WINNNNN');
          setScore(score + 1);

          //add another elemetn to the sequence
          const newSeq = [...sequence];
          const nextVal = Math.floor(Math.random() * 4);
          newSeq.push(colors[nextVal]);
          setSequence(newSeq);
        } else {
          setPlayerWon(false);
        }
        setUserInput([]);
        setCurrentPlayer('simon');
      }
    }
  }, [userInput, currentPlayer, score, sequence]);

  return (
    <>
      {currentPlayer === 'simon' ? <h1>Simon</h1> : <h1>Player 1</h1>}
      <span>
        <button
          style={{
            backgroundColor: 'red',
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
        <button
          style={{ fontSize: '20px', padding: '10px 20px' }}
          onClick={() => startGame()}
        >
          Play!
        </button>
      </span>
      {playerWon ? (
        <div
          style={{
            backgroundColor: 'green',
          }}
        >
          Winning!!
        </div>
      ) : (
        <div
          style={{
            backgroundColor: 'red',
          }}
        >
          Lost!!
        </div>
      )}
    </>
  );
};

export default Simon;
