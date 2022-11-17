import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import { blue, red, green } from "@mui/material/colors"
import { CssBaseline, useMediaQuery } from "@mui/material"
import { QueryClient, QueryClientProvider } from "react-query"
import { ReactQueryDevtools } from "react-query/devtools"
import HomePage from './Pages/HomePage';
import OrgPage from './Pages/OrgPage';
import { SnackbarProvider } from 'notistack';


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
                        <SnackbarProvider>
                            <CssBaseline />
                            <Routes>
                                <Route path="/" element={<HomePage />} />
                                <Route path="/:organization" element={<OrgPage />} />
                            </Routes>
                            <ReactQueryDevtools />
                        </SnackbarProvider>
                    </ThemeProvider>
                </QueryClientProvider>
            </BrowserRouter>
        </React.StrictMode>
    )
}

export default App;
