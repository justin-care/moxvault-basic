import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { decrementLifeTotal, incrementLifeTotal, decrementPoisonCounters,incrementPoisonCounters, incrementCommanderDamage, decrementCommanderDamage } from "../store/gameSlice";
import { useState, useEffect } from "react";

import {motion} from "framer-motion";

const GameScreen = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const players = useSelector(state => state.game.players);
    const gameActive = useSelector(state => state.game.gameActive);
    const [activePlayer, setActivePlayer] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedOpponent, setSelectedOpponent] = useState(null);

    const selectedPlayer = players.find(player => player.id === activePlayer);
    const availableOpponents = players.filter(player =>  !selectedPlayer?.commanderDamage[player.id]);

    useEffect(() => {
        if(!gameActive) {
            navigate("/");
        }
    },[])
    useEffect(() => {
        console.log(selectedOpponent);
    },[selectedOpponent])

    const openDrawer = (id) => {
        setActivePlayer(id);
        setDrawerOpen(true);
    }

    const closeDrawer = () => {
        setActivePlayer(null);
        setDrawerOpen(false);
    }

    return (
        <div className="h-[100dvh] flex flex-col justify-center items-center bg-base-200 rounded-lg pb-4">
            <div className="h-full w-full max-w-8xl 
                flex flex-wrap justify-center gap-2 md:gap-4">
            {players.map((player) => (
                <div key={player.id} className="flex flex-row items-center justify-between bg-base-100 px-4 py-3 rounded-lg shadow-md 
                        xsm:p-2 md:p-4 w-full sm:w-[48%] lg:w-[30%] h-10" style={{
                            minHeight: `calc(100dvh / ${players.length})`, // 🔹 Distributes height evenly across the viewport
                          }}>
                <button className="btn btn-lg btn-error xsm:w-16 md:w-20 h-full text-3xl" onClick={() => dispatch(decrementLifeTotal({ id: player.id }))}>-</button>
                
                <div className="flex flex-col items-center justify-center w-full xsm:gap-6 md:gap-10">
                    <h2 className="text-lg md:text-2xl font-bold">{player.name}</h2>
                    <motion.h3 initial={{ scale: 1 }} 
                    animate={{ scale: 1.2 }} 
                    transition={{ duration: 0.2 }} 
                    key={player.lifeTotal} className="text-4xl md:text-5xl">{player.lifeTotal}
                    </motion.h3>
                    <button className="btn btn-md btn-info xsm:w-3/4 md:w-auto mt-2" onClick={() => openDrawer(player.id)}>More</button>
                </div>

                <button className="btn btn-lg btn-success xsm:w-16 md:w-20 h-full text-3xl" onClick={() => dispatch(incrementLifeTotal({ id: player.id }))}>+</button>
                </div>
            ))}
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
                                    <button className="text-xl btn btn-md btn-error pb-1 font-bold" onClick={() => dispatch(decrementPoisonCounters({id: activePlayer}))}>-</button>
                                    <h4 className="xsm:text-xl md:text-3xl font-semibold mb-2 mt-1">Poison Counters :</h4>
                                    <span className="xsm:text-xl md:text-3xl font-bold mt-1">{selectedPlayer.poisonCounters}</span>
                                    <button className="text-xl btn btn-md btn-success pb-1 font-bold" onClick={() => dispatch(incrementPoisonCounters({id: activePlayer}))}>+</button>
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
                                                        dispatch(incrementCommanderDamage({attackerId: parseInt(selectedOpponent), defenderId: activePlayer}));
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
                                                    <button className="btn btn-md btn-error text-xl font-bold" onClick={() => dispatch(decrementCommanderDamage({ attackerId: opponent.id, defenderId: activePlayer }))}>-</button>
                                                    <span className="font-semibold text-3xl">{opponent.name} :</span>
                                                    <span className="font-bold text-3xl">{damage}</span>
                                                    <button className="btn btn-md btn-success text-xl font-bold" onClick={() => dispatch(incrementCommanderDamage({ attackerId: opponent.id, defenderId: activePlayer }))}>+</button>
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