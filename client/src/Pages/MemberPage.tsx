import { Box, Container, Paper, TextField, Button, FormControl, FormHelperText, Input, InputLabel, FormControlLabel, FormLabel, Radio, RadioGroup, Checkbox, FormGroup } from '@mui/material';
import { ReactNode } from 'react';

let MemberPage = () => {
    const submit = (e: any) => {
        e && e.preventDefault();
        console.log(e)
    }

    const days = ['M', 'Tu', 'W', 'Th', 'F', 'Sa', 'Su']



    return (
        <Container style={{ height: "90vh", minWidth: "90%", marginTop: "2rem" }} >
          <Box
                component="form"
                onSubmit={submit}
                noValidate
                autoComplete="off"
            >
                <FormControl>
                    <FormLabel id="available-label">Available?</FormLabel>
                    <RadioGroup
                        aria-labelledby="available-label"
                        defaultValue="available"
                        name="available-group"
                    >
                        <FormControlLabel value="available" control={<Radio />} label="available" />
                        <FormControlLabel value="unavailable" control={<Radio />} label="available" />
                    </RadioGroup>
                </FormControl>
                <FormControl component="fieldset" variant="standard">
                    <FormLabel component="legend">Day(s)</FormLabel>
                    <FormGroup>
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
                <FormControl>
                    <InputLabel htmlFor="start">Start Time: </InputLabel>
                    <Input name="start" />
                </FormControl>
                <FormControl>
                    <InputLabel htmlFor="end">End Time: </InputLabel>
                    <Input name="end" />
                </FormControl>
                <FormControl>
                    <Button type="submit" variant="contained">Add</Button>
                </FormControl>
            </Box>
        </Container>
    )
}

export default MemberPage