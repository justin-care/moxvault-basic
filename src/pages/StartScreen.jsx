import {useNavigate} from "react-router-dom";
const StartScreen = () => {
    const navigate = useNavigate();
    const startNewGame = () => {
        window.navigator.vibrate(100);
        navigate("/create");
    }
    return (
        <div className="w-full h-[95dvh] flex flex-col justify-center items-center">
            <h1 className="text-4xl font-bold mb-4">MoxVault</h1>
            <button onClick={startNewGame} className="mt-4 text-xl font-bold btn btn-xl btn-primary px-4 py-2 rounded-md cursor-pointer">New Game</button>
        </div>
    )
}

export default StartScreen;