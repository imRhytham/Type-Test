import React, { useState, useEffect, useRef } from 'react';
import { getRandomCharacters, getBestScore } from '../Helper';

function Game() {
	const [input, setInput] = useState('');
	const [startTimer, setStartTimer] = useState(false);
	const [activeAlphabet, setActiveAlphabet] = useState(getRandomCharacters);
	const [index, setIndex] = useState(0);
	const [store, setStore] = useState(false);
	const [milliSeconds, setMilliSeconds] = useState(0);
	const [seconds, setSeconds] = useState(0);
	const [isDisabled, setIsDisabled] = useState(false);
	const textInput = useRef();
	const [bestScore, setBestScore] = useState(getBestScore);
	const [isBest, setIsBest] = useState();

	//function to check if current score is better than previous score
	const currentScore = () => {
		let currentScore = parseFloat(`${seconds}.${milliSeconds}`);
		if (bestScore === 'No Best Score') {
			setBestScore(currentScore);
		}
		bestScore > currentScore ? setIsBest(true) : setIsBest(false);
	};

	//function to store timer value in local storage
	const storeTimerValue = () => {
		if (localStorage.getItem('TimerArr') == null) {
			localStorage.setItem('TimerArr', '[]');
		}
		let timerArr = JSON.parse(localStorage.getItem('TimerArr'));
		timerArr.push(`${seconds}.${milliSeconds}`);
		localStorage.setItem('TimerArr', JSON.stringify(timerArr));
	};

	// Timer Function
	useEffect(() => {
		let timer = null;
		if (startTimer) {
			timer = setInterval(() => {
				setMilliSeconds((milliSeconds) => milliSeconds + 10);
				if (milliSeconds === 1000) {
					setSeconds(seconds + 1);
					setMilliSeconds(0);
				}
			}, 10);
		}

		return () => {
			clearInterval(timer);
			if (store === true) {
				storeTimerValue();
				currentScore();
			}
		};
	});

	//function to handle input change events
	const handleChange = (value) => {
		setInput(value);

		//starting timer on writing first character
		if (startTimer === false) {
			setStartTimer(true);
		}

		//check if active alphabet is same as input character
		if (value === activeAlphabet) {
			setActiveAlphabet(getRandomCharacters());
			setTimeout(() => {
				setInput('');
			}, 200);
			setIndex(index + 1);
			textInput.current.focus();
		}

		//if active alphabet is not same as input character then disable input for 500 milliseconds
		if (value !== activeAlphabet) {
			setIsDisabled(true);
			setTimeout(() => {
				setIsDisabled(false);
				setInput('');
			}, 500);
			textInput.current.focus();
		}

		// stop time after 20 char
		if (index >= 19) {
			setStartTimer(false);
			setInput('Completed');
			setStore(true);
		}
	};

	return (
		<div className='flex justify-center items-center h-screen text-white text-center border-red-200 rounded'>
			<div>
				<h1 className='text-3xl font-bold'>Type the Alphabet</h1>
				<p className='text-2xl mt-5'>
					Typing Game to see how fast you can type. Timer Starts when you do :)
				</p>
				<div className='bg-white border-2 rounded w-full h-64 mt-5 flex justify-center items-center '>
					<h2 className='text-[100px] text-[#438e34] font-bold'>
						{index === 20 ? (isBest ? 'Success' : 'Failure') : activeAlphabet}
					</h2>
				</div>
				<div className='mt-7 flex justify-center items-center'>
					<input
						className='w-2/12 h-24 text-[#438e34] font-bold text-[50px] rounded text-center '
						autoFocus
						ref={textInput}
						disabled={isDisabled}
						maxLength={1}
						type='text'
						value={input}
						onChange={(e) => {
							handleChange(e.target.value);
						}}
					/>
				</div>
				<div className='text-2xl text-slate-300 mt-5'>
					Time: {seconds}.{milliSeconds}s
				</div>
				<div className='text-xl text-slate-300 mt-5'>
					Best Score: {bestScore}s
				</div>
			</div>
		</div>
	);
}

export default Game;
