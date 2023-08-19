/*
general desc:
when the play button is clicked, the current player is simon. the useEffect will trigger a function that will "flash" a button (change its value to 0) 
*/
import { useEffect, useState } from 'react';
import timeout from './utils/util';

const Simon = () => {
  //state will have
  // -> the sequence to execute
  const [sequence, setSequence] = useState([]);
  const [userInput, setUserInput] = useState([]);
  const [playerWon, setPlayerWon] = useState(true);
  const [score, setScore] = useState(0);
  // -> the sequence pressed after play
  const [currentPlayer, setCurrentPlayer] = useState('player');
  // -> whether the current player is simon or the user
  // -> button values
  const [buttonValues, setButtonValues] = useState({
    1: '1',
    2: '2',
    3: '3',
    4: '4',
  });

  //lets back up a little bit here and describe the user flow

  //the player clicks play, and its simons turn. simon then flashes the sequnce. then the current player becomes  player1.  player1 inputs the sequence, and when the sequence lenght matches, check for the equality. if they are equal, increment the score and add to the sequence, if they are not, flash the buttons again.

  const flashBtns = async () => {
    for (let i = 0; i < sequence.length; i++) {
      const newBtnVals = { ...buttonValues };
      newBtnVals[sequence[i]] = 'X';
      setButtonValues(newBtnVals);
      await timeout(250);
      setButtonValues({
        1: '1',
        2: '2',
        3: '3',
        4: '4',
      });
    }
  };

  const startGame = () => {
    setCurrentPlayer('simon');
    setPlayerWon(true);
  };

  const updateUserInput = (e) => {
    console.log(e.target.value);
    const newUserInput = [...userInput];
    newUserInput.push(e.target.value);
    setUserInput(newUserInput);
  };

  useEffect(() => {
    console.log('current sequence', sequence);
    if (currentPlayer === 'simon') {
      flashBtns();
      setCurrentPlayer('player');
    }
  }, [currentPlayer]);

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
          const nextVal = Math.floor(Math.random() * 4) + 1;
          newSeq.push(nextVal);
          setSequence(newSeq);
        } else {
          setPlayerWon(false);
        }
        setUserInput([]);
        setCurrentPlayer('simon');
      }
    }
  }, [userInput]);

  return (
    <>
      {currentPlayer === 'simon' ? <h1>Simon</h1> : <h1>Player 1</h1>}
      <span>
        <button
          style={{ fontSize: '20px', padding: '10px 20px' }}
          value={1}
          onClick={updateUserInput}
        >
          {buttonValues[1]}
        </button>
        <button
          style={{ fontSize: '20px', padding: '10px 20px' }}
          value={2}
          onClick={updateUserInput}
        >
          {buttonValues[2]}
        </button>
      </span>
      <span>
        <button
          style={{ fontSize: '20px', padding: '10px 20px' }}
          value={3}
          onClick={updateUserInput}
        >
          {buttonValues[3]}
        </button>
        <button
          style={{ fontSize: '20px', padding: '10px 20px' }}
          value={4}
          onClick={updateUserInput}
        >
          {buttonValues[4]}
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
