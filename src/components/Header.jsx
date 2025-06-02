
import { PiDotsThreeOutlineVerticalFill, PiDotsThreeOutlineVerticalDuotone } from "react-icons/pi"
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import * as uiActions  from "../slices/uiSlice";
import useThemeColors from "../hooks/useThemeColors";
const Header = () => {
    const settingsMenuOpen = useSelector(state => state.ui.settingsMenuOpen);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const handleSettingsToggle = () => {
        dispatch(uiActions.setSettingsMenuState(settingsMenuOpen ? false : true));
        window.navigator.vibrate(100);
    }

    const {bg, text, btn} = useThemeColors();

    return (
        <header className={`w-full flex justify-between items-center px-4 py-2 ${bg} ${text} shadow-lg`}>
            <button className={`text-2xl font-bold cursor-pointer btn ${btn}`} onClick={() => navigate("/")}>MoxVault</button>
            <div>
                <button  className={`text-2xl font-bold cursor-pointer ${btn} btn-primary`} onClick={handleSettingsToggle}>
                    {settingsMenuOpen ? <PiDotsThreeOutlineVerticalDuotone />:<PiDotsThreeOutlineVerticalFill />}
                </button>
            </div>
        </header>
        
    )
}

export default Header