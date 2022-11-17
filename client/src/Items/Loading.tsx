import { Box, CircularProgress } from "@mui/material"


let Loading = () => {
    return (
        <Box
            left="0"
            top="0"
            width="100%"
            height="100%"
            display="flex"
            justifyContent="center"
            alignItems="center"
            position="absolute"
            zIndex={999}
            bgcolor="rgba(255, 255, 255, 0.1)"
        >
            <CircularProgress size={50} />
        </Box>
    )
}

export default Loading