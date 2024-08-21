import { getTheme } from "../components/effects/Theme"

const getStyledMultiselect = () => {
    const theme = getTheme()

    return {
        option: {
            backgroundColor: theme === 'dark' ? 'black' : theme,
        },
        chips: {
            backgroundColor: theme === 'dark' ? 'gray' : theme,
        }
    }
}

export default getStyledMultiselect