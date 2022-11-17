import { Box, Container, Paper, TextField, Button, FormControl, FormHelperText, Input, InputLabel } from '@mui/material';

let HomePage = () => {
    const submit = (e: any) => {
        e && e.preventDefault();
        console.log(e)
    }


    return (
        <Container style={{ height: "90vh", minWidth: "90%", marginTop: "2rem" }} >
            <Box
                component="form"
                onSubmit={submit}
                // sx={{
                //     '& > :not(style)': { m: 1, width: '25ch' },
                // }}
                noValidate
                autoComplete="off"
            >
                <FormControl>
                    <InputLabel htmlFor="my-input">Email address</InputLabel>
                    <Input name="blabla" aria-describedby="my-helper-text" />
                    <FormHelperText id="my-helper-text">We'll never share your email.</FormHelperText>
                </FormControl>
                <FormControl>
                    <Button type="submit" variant="contained">Log In</Button>
                </FormControl>
            </Box>
        </Container>
    )
}

export default HomePage