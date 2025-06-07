
import { pre } from "framer-motion/client";
import { removeToast, updateToasts } from "../slices/uiSlice";

const toastMiddleware = store => next => action => {
    const prevState = store.getState();
    const result = next(action);
    const nextState = store.getState();

    // Toast on player life hitting 0
    if (action.payload.type === 'game/decrementLifeTotal') {
        const { id } = action.payload.payload;
        const prevPlayer = prevState.game.present.players.find(p => p.id === id);
        const nextPlayer = nextState.game.present.players.find(p => p.id === id);
        console.log(action.payload);

        if (prevPlayer && nextPlayer && prevPlayer.lifeTotal > 0 && nextPlayer.lifeTotal <= 0) {
            store.dispatch(updateToasts({
                message: `${nextPlayer.name} has been defeated!`,
                type: "alert-error",
            }));
            setTimeout(() => {
                try {
                    store.dispatch(removeToast());
                } catch (err) {
                    console.warn("Toast removal error:", err);
                }
            }, 3000);
        }
    }

    // Extend with other game triggers as needed

    return result;
};

export default toastMiddleware;
