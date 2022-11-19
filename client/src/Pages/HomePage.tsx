import { Box, Container, Paper, TextField, Button, FormControl, FormHelperText, Input, InputLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';

let HomePage = () => {
    const navigate = useNavigate()

    const submit = (e: any) => {
        if (e.target.orgName.value === "") { alert("Please entre your organization name to continue"); }
        else {
            e && e.preventDefault();
            navigate(`/${e.target.orgName.value}`)
        }
    }


    return (

        <Container sx={{ height: "100%", width: "100%", display: "flex", justifyContent: "center" }}>
            <Box className ="content" display="flex" justifyContent="center">
                <h2>Time2Work</h2>
                <h2>Time2Work</h2>
            </Box>
            <Box
                component="form"
                onSubmit={submit}
                noValidate
                autoComplete="off"
                display="flex"
                alignItems="center"
            >
                <FormControl>
                    <InputLabel>Organization Name:</InputLabel>
                    <Input name="orgName" aria-describedby="help-text" />
                    <FormHelperText id="help-text">Please Input Organization Name</FormHelperText>
                </FormControl>
                <FormControl>
                    <Button sx={{ ml: "1rem" }} type="submit" variant="contained">GO</Button>
                </FormControl>
            </Box>
        </Container>
    )
}

export default HomePage