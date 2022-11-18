import { Box, Container, Paper, TextField, Button, FormControl, FormHelperText, Input, InputLabel, FormControlLabel, FormLabel, Radio, RadioGroup, Checkbox, FormGroup } from '@mui/material';
import { ReactNode } from 'react';

let MemberPage = () => {
    const submit = (e: any) => {
        e && e.preventDefault();
        console.log(e)
    }

    const days = ['MON', 'TU', 'WED', 'THUR', 'FRI', 'SAT', 'SUN']



    return (
        <Container style={{ height: "90vh", minWidth: "90%", marginTop: "2rem" }} >
          <Box
                component="form"
                onSubmit={submit}
                noValidate
                autoComplete="off"
            >
                <FormControl>
                    <FormLabel id="available-label">Availability</FormLabel>
                    <RadioGroup
                        row = {true}
                        aria-labelledby="available-label"
                        defaultValue="available"
                        name="available-group"
                    >
                        <FormControlLabel value="available" control={<Radio />} label="Available" />
                        <FormControlLabel value="unavailable" control={<Radio />} label="Unavailable" />
                    </RadioGroup>
                </FormControl>
              <br/>
                <FormControl component="fieldset" variant="standard">
                    <FormLabel component="legend">Day(s)</FormLabel>
                    <FormGroup row = {true}>
                    {days.map(day => (
                        <FormControlLabel
                            control={
                                <Checkbox name={day} />
                            }
                            label={day}
                        />
                    ))}
                    </FormGroup>
                </FormControl>
              <br/>
                <FormControl>
                    {/*<InputLabel htmlFor="start">Start Time: </InputLabel>*/}
                    <Input name="start" type = "time"/>
                </FormControl>
              {"    ——    "}
                <FormControl>
                    {/*<InputLabel htmlFor="start">Start Time: </InputLabel>*/}
                    <Input name="start" type = "time"/>
                </FormControl>

                <FormControl>
                    <Button sx={{ml: "1rem"}} type="submit" variant="contained">Add</Button>
                </FormControl>
            </Box>
        </Container>
    )
}

export default MemberPage