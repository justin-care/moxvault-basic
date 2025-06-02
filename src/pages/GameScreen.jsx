import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { dispatchGameAction, gameActions } from "../slices/historySlice";
import * as uiActions  from "../slices/uiSlice";
import { useState, useEffect, use } from "react";
import useWakeLock from "../hooks/useWakeLock";

import {motion} from "framer-motion";

const GameScreen = () => {
    useWakeLock(true);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const players = useSelector(state => state.game.present.players);
    const gameActive = useSelector(state => state.game.present.gameActive);
    const [activePlayer, setActivePlayer] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedOpponent, setSelectedOpponent] = useState(null);

    const selectedPlayer = players.find(player => player.id === activePlayer);
    const availableOpponents = players.filter(player =>  !selectedPlayer?.commanderDamage[player.id]);

    const past = useSelector(state => state.game.past);
    const future = useSelector(state => state.game.future);
    useEffect(() => {
        console.log('Players:', players);
        console.log('Past length:', past.length);
        console.log('Future length:', future.length);
    }, [players, past, future]);


    useEffect(() => {
        if(!gameActive) {
            navigate("/");
        }
    },[])

    const openDrawer = (id) => {
        setActivePlayer(id);
        setDrawerOpen(true);
    }

    const closeDrawer = () => {
        setActivePlayer(null);
        setDrawerOpen(false);
        window.navigator.vibrate(50);
    }

    return (
        <div className="h-full w-full flex flex-col justify-center items-center bg-secondary-content p-2" onClick={() => dispatch(uiActions.setSettingsMenuState(false))}>
            <div className="h-full w-full max-w-8xl flex flex-col justify-center md:flex-row md:flex-wrap gap-1 ">
            {
                    players.map((player) => {
                        return <div key={player.id} className="flex flex-row items-center justify-between bg-base-200 px-4 py-3 rounded-lg shadow-lg 
               xsm:p-2 md:p-4 lg:w-1/2 min-w-1/3 md:max-w-1/2" style={{
                            flexGrow: 1, 
                            flexBasis: 0, 
                            minHeight: `${95 / players.length}%`,
                          }}>
                            <button className="btn btn-lg btn-warning xsm:w-16 md:w-20 h-full text-3xl"  onClick={() => dispatch(dispatchGameAction(gameActions.decrementLifeTotal({id: player.id})))}>-</button>
                            <div className="flex flex-col items-center justify-evenly w-full xsm:gap-0 md:gap-4">
                                <h2 className="text-lg md:text-2xl font-bold text-base-content">{player.name}</h2>
                                <motion.h3 initial={{ scale: 1 }} 
                                animate={{ scale: 1.2 }} 
                                transition={{ duration: 0.2 }} 
                                key={player.lifeTotal} className="text-4xl md:text-5xl xsm:text-4xl text-base-content">{player.lifeTotal}</motion.h3>
                                <button className="btn btn-md btn-error xsm:w-3/4 md:w-auto md:mt-2 mb-2" onClick={() => openDrawer(player.id)}>More</button>
                            </div>
                            <button className="btn btn-lg btn-warning xsm:w-16 md:w-20 h-full text-3xl" onClick={() => dispatch(dispatchGameAction(gameActions.incrementLifeTotal({id: player.id})))}>+</button>
                        </div>
                    })
                }
            </div>
            {
                drawerOpen && selectedPlayer && (
                    <div className="fixed inset-0 flex items-end justify-center bg-black/50 z-50 pt-4 px-4" onClick={closeDrawer}>
                        <motion.div 
                        initial={{ opacity: 0, y: 400 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        exit={{ opacity: 0, y: 400 }} 
                        transition={{ duration: 0.15 }}
                        className="w-full max-w-lg bg-base-100 shadow-lg flex flex-col p-6 items-center" onClick={(e) => e.stopPropagation()} style={{ maxHeight: "80vh", overflowY: "auto", borderTopLeftRadius: "1rem", borderTopRightRadius: "1rem" }} >
                            <div className="w-full">
                                <div className="flex flex-row gap-4 justify-between align-center w-full">
                                    <button className="text-xl btn btn-md btn-error pb-1 font-bold" onClick={() => dispatch(dispatchGameAction(gameActions.decrementPoisonCounters({id: activePlayer})))}>-</button>
                                    <h4 className="xsm:text-xl md:text-3xl font-semibold mb-2 mt-1">Poison Counters :</h4>
                                    <span className="xsm:text-xl md:text-3xl font-bold mt-1">{selectedPlayer.poisonCounters}</span>
                                    <button className="text-xl btn btn-md btn-success pb-1 font-bold" onClick={() => dispatch(dispatchGameAction(gameActions.incrementPoisonCounters({id: activePlayer})))}>+</button>
                                </div>
                            </div>
                            <hr className="w-full my-4" />
                            <div className="flex flex-col mb-4 w-full items-center">
                                {
                                    availableOpponents.length > 0 && (
                                        <div className="flex flex-row gap-4 mb-4 justify-between items-center w-full">
                                                <select className="select select-lg select-bordered w-full" value={selectedOpponent|| ""} onChange={(e) => setSelectedOpponent(e.target.value)}>
                                                    <option disabled value="">Select an opponent</option>
                                                    {availableOpponents.map(opponent => <option key={opponent.id} value={opponent.id}>{opponent.name}</option>)}
                                                </select>
                                                <button className="btn btn-primary" onClick={() =>{
                                                    if (selectedOpponent) {
                                                        dispatch(dispatchGameAction(gameActions.incrementCommanderDamage({ attackerId: selectedOpponent, defenderId: activePlayer })));
                                                        setSelectedOpponent(null);
                                                    }
                                                }}>Add</button>
                                            </div>
                                    )
                                }
                                
                                
                                {
                                    Object.entries(selectedPlayer.commanderDamage).length > 0 ? (
                                        Object.entries(selectedPlayer.commanderDamage).map(([opponentId, damage]) => {
                                            const opponent = players.find(player => player.id === parseInt(opponentId));
                                            return (
                                                <motion.div 
                                                initial={{ opacity: 0, scale: 0.8 }} 
                                                animate={{ opacity: 1, scale: 1 }} 
                                                transition={{ duration: 0.2 }}
                                                key={opponentId} className="flex items-center justify-between w-full rounded mb-4">
                                                    <button className="btn btn-md btn-error text-xl font-bold" onClick={() => dispatch(dispatchGameAction(gameActions.decrementCommanderDamage({ attackerId: opponent.id, defenderId: activePlayer })))}>-</button>
                                                    <span className="font-semibold text-3xl">{opponent.name} :</span>
                                                    <span className="font-bold text-3xl">{damage}</span>
                                                    <button className="btn btn-md btn-success text-xl font-bold" onClick={() => dispatch(dispatchGameAction(gameActions.incrementCommanderDamage({ attackerId: opponent.id, defenderId: activePlayer })))}>+</button>
                                                </motion.div>
                                            )
                                        })
                                    ) : (
                                        <p>No commander damage</p>
                                    )
                                }
                            </div>
                            <button className="btn btn-warning w-full mb-4" onClick={closeDrawer}>Close</button>
                        </motion.div>
                    </div>
                )
            }
        </div>
    )
}

export default GameScreen;