export const getRandomCharacters = () => {
	const alphabets = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	return alphabets[Math.floor(Math.random() * alphabets.length)];
};

export const getBestScore = () => {
	let bestScore;
	if (localStorage.getItem('TimerArr') == null) {
		bestScore = 'No Best Score';
	} else {
		let bestScoreArr = JSON.parse(localStorage.getItem('TimerArr'));
		bestScoreArr = bestScoreArr?.map(Number);
		bestScore = Math.min(...bestScoreArr);
	}
	return bestScore;
};
