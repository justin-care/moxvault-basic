import {Routes, Route, useLocation} from 'react-router-dom'
import StartScreen from './pages/StartScreen'
import GameScreen from './pages/GameScreen'
import CreateGameScreen from './pages/CreateGameScreen'
import Header from './components/Header'
import { useSelector, useDispatch } from 'react-redux'
import useThemeColors from './hooks/useThemeColors'
import { useEffect } from 'react'
import { dispatchGameAction, gameActions } from "./slices/historySlice";
import historyReducer, * as historyActions from "./slices/historySlice";
import * as uiActions  from "./slices/uiSlice";
import { BiReset } from "react-icons/bi";
import { LiaUndoSolid, LiaRedoSolid  } from "react-icons/lia";
import config from "./config/config";

function App() {
    const settingsMenuOpen = useSelector(state => state.ui.settingsMenuOpen);
    const redoActive = useSelector(state => state.game.present.redoActive);
    const undoActive = useSelector(state => state.game.present.undoActive);
    const resetActive = useSelector(state => state.game.present.resetActive);
    const dispatch = useDispatch();
    const location = useLocation();
    const {bg, text, btn} = useThemeColors();

    useEffect(() => {
        if (settingsMenuOpen) {
            dispatch(uiActions.setSettingsMenuState(false));
        }
    }, [location]);

    useEffect(() => {
        dispatch(dispatchGameAction(gameActions.setConfig(config)));
    }, []);

    return (
        <div className="w-full bg-base-200 h-[100dvh] flex flex-col overflow-hidden">
            <Header />
            <div className="flex-grow">
                <Routes >
                    <Route path="/"  element={<StartScreen />} />
                    <Route path="/game" element={<GameScreen />} />
                    <Route path="/create" element={<CreateGameScreen />} />
                </Routes>
            </div>
            {settingsMenuOpen && 
            <div className={`w-72 rounded-xl ${bg} ${text} shadow-lg absolute top-17 right-2 justify-between items-center gap-2 flex flex-col`}>
                <h2 tabIndex={0} className=" text-lg font-bold">Settings</h2>
                <div className="divider w-full"></div>
                <div className={`w-full bg-base-100 ${text} rounded-b-lg flex justify-center items-center py-2`}>
                    <button className="btn btn-ghost text-2xl" disabled={!undoActive} onClick={() => dispatch(historyActions.undo())}><LiaUndoSolid /></button>
                    <div className="divider divider-horizontal"></div>
                    <button className="btn btn-ghost text-2xl" disabled={!resetActive} onClick={() => dispatch(historyActions.reset())}><BiReset /></button>
                    <div className="divider divider-horizontal"></div>
                    <button className="btn btn-ghost text-2xl" disabled={!redoActive} onClick={() => dispatch(historyActions.redo())}><LiaRedoSolid /></button>
                </div>
            </div>}
        </div>
    )
}

export default App
