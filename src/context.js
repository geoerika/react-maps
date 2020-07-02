import { createContext } from 'react'


export const AppContext = createContext({ isLightTheme: !(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) })