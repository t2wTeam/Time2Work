import React from 'react';
import { BrowserRouter } from "react-router-dom"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import { blue, red, green } from "@mui/material/colors"
import { CssBaseline, useMediaQuery } from "@mui/material"
import { QueryClient, QueryClientProvider } from "react-query"
import { ReactQueryDevtools } from "react-query/devtools"


const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            staleTime: 60 * 1000, // 1 minute
        },
    },
})


let App = () => {
    const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)")
    let [darkMode, setDarkMode] = React.useState(prefersDarkMode)

    const theme = createTheme({
        palette: {
            primary: blue,
            secondary: green,
            error: red,
            mode: darkMode ? "dark" : "light",
        },
        typography: {
            fontFamily: "Nunito, Arial",
            fontSize: 16,
            fontWeightLight: 300,
            fontWeightRegular: 400,
            fontWeightMedium: 700,
            fontWeightBold: 900,
        },
    })

    let toggleDarkMode = () => {
        setDarkMode((dark) => !dark)
    }
    
    return (
        <React.StrictMode>
            <BrowserRouter>
                <QueryClientProvider client={queryClient}>
                    <ThemeProvider theme={theme}>
                        <CssBaseline />
                        <ReactQueryDevtools />
                    </ThemeProvider>
                </QueryClientProvider>
            </BrowserRouter>
        </React.StrictMode>
    )
}

export default App;
