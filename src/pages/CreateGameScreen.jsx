import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaCopy } from "react-icons/fa";
import { dispatchGameAction, gameActions } from "../slices/historySlice";
import ShortUniqueId from "short-unique-id";

const uid = new ShortUniqueId({ length: 10 });
const CreateGameScreen = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const showGameId = useSelector(state => state.game.present.showGameId);
    const potentialPlayers = [2,3,4,5,6];
    const [numPlayers, setNumPlayers] = useState(4);
    const [startingLifeTotal, setStartingLifeTotal] = useState(40);
    const gameId = useSelector(state => state.game.present.gameId);

    useEffect(() => {
        const id = uid.rnd();
        dispatch(dispatchGameAction(gameActions.setGameId(id)));
    },[])

    const handleStartGame = () => {
        dispatch(dispatchGameAction(gameActions.setGameSettings({numPlayers, startingLifeTotal})));
        dispatch(dispatchGameAction(gameActions.setGameActive(true)));
        window.navigator.vibrate(100);
        navigate("/game");
    }

    const handleReturnToStart = () => {
        window.navigator.vibrate(50);
        navigate("/");
    }

    const handleLifeTotalChange = (e) => {
        let num = Number(e.target.value);
        if (num < 20) num = 20;
        if (num > 100) num = 100;
        window.navigator.vibrate(50);
        setStartingLifeTotal(Number(e.target.value));
    }

    const handleNumPlayersChange = (e) => {
        let num = Number(e.target.value);
        window.navigator.vibrate(50);
        setNumPlayers(Number(e.target.value));
    }

    return (
        <div className="w-full h-[95dvh] flex flex-col justify-center items-center">
            <div className="card w-96 bg-base-100 shadow-xl p-6">
                <h2 className="text-2xl font-bold mb-4">Create a New Game</h2>
                <label className="label mb-2">Number of Players:</label>
                <select className="select select-xl select-bordered w-full mb-6" value={numPlayers} onChange={handleNumPlayersChange}>
                    {
                        potentialPlayers.map((num) => {
                            return <option key={num} value={num}>{num} Players</option>
                        })
                    }
                </select>
                <label className="label mb-2">Starting Life:</label>
                <input type="number" className="input input-xl input-bordered validator w-full mb-6" min={20} max={100} value={startingLifeTotal} onChange={handleLifeTotalChange} onBlur={handleLifeTotalChange} />
                {showGameId &&
                    <div className="flex flex-row justify-evenly items-center gap-6">
                        <div>
                            <label className="label mb-2">Game ID:</label>
                            <input type="text" className="input input-xl input-bordered validator w-full mb-6" value={gameId || ""} readOnly />
                        </div>
                        <button onClick={() => navigator.clipboard.writeText(gameId)} className="mt-4 text-xl font-bold btn btn-xl btn-primary px-4 py-2 rounded-md cursor-pointer mr-6"><FaCopy /></button>
                    </div>
                }
            </div>
            <div className="flex flex-row justify-center p-6">
                <button onClick={handleReturnToStart} className="mt-4 text-xl font-bold btn btn-xl btn-secondary px-4 py-2 rounded-md cursor-pointer mr-6">Return</button>
                <button onClick={handleStartGame} className="mt-4 text-xl font-bold btn btn-xl btn-primary px-4 py-2 rounded-md cursor-pointer">Start Game</button>
            </div>
        </div>
    )
}

export default CreateGameScreen;