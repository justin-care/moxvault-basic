import {useNavigate} from "react-router-dom";
const StartScreen = () => {
    const navigate = useNavigate();
    const startNewGame = () => {
        window.navigator.vibrate(100);
        navigate("/create");
    }
    const jumpToCards = () => {
        window.navigator.vibrate(100);
        navigate("/cards");
    }
    return (
        <div className="w-full h-[95dvh] flex flex-col justify-center items-center">
            <h1 className="text-4xl font-bold mb-4">MoxVault</h1>
            <button onClick={startNewGame} className="mt-4 text-xl font-bold btn btn-xl btn-primary px-4 py-2 rounded-md cursor-pointer">New Game</button>
            {/* <button onClick={jumpToCards} className="mt-4 text-xl font-bold btn btn-xl btn-secondary px-4 py-2 rounded-md cursor-pointer">Scan Cards</button> */}
        </div>
    )
}

export default StartScreen;