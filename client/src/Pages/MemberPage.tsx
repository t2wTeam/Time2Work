import { Box, Container, Paper, TextField, Button, FormControl, FormHelperText, Input, InputLabel, FormControlLabel, FormLabel, Radio, RadioGroup, Checkbox, FormGroup, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { ReactNode } from 'react';
import { useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import TimeFragment from '../Items/TimeFragment';

const cellStyle = { border: "1px solid", padding: "0", height: "2rem" }

let MemberPage = () => {
    let { enqueueSnackbar } = useSnackbar()
    let { organization, name } = useParams()
    let navigate = useNavigate()

    let { isLoading: loading, error: error, data: data, } = useQuery(
        ["get-member", name],
        async () => {
            let r = await axios.get(`/api/${organization}/${name}`)
            return r.data
        },
        {
            retry: false
        }
    )

    if (error) {
        let e: any = error
        enqueueSnackbar(
            e.response.status === 400 && e.response.data.detail ? (
                e.response.data.detail
            ) : (
                "Something has gone wrong. Maybe the organization/member name is invalid! "
            ),
            { variant: 'error' }
        )
        navigate("/")
    }

    const days = ['MON', 'TU', 'WED', 'THUR', 'FRI', 'SAT', 'SUN']

    const addTime = () => {
        // WIP
    }


    return (
        <>
        <TableContainer>
            <Table size="medium">
                <TableHead>
                    <TableRow>
                        {
                            days.map(d => (
                                <TableCell key={d} sx={cellStyle} width="6%" align="center">
                                    {d}
                                </TableCell>
                            ))
                        }
                    </TableRow>
                </TableHead>
                <TableBody>
                    {/* {//Maybe object should be array cuz if not, dictionary is unordered :(
                        Object.keys(data).map((name) => (
                            <TableRow key={name}>
                                <TableCell align="center" sx={cellStyle}>{name}</TableCell>
                                
                            </TableRow>
                        ))
                    } */}
                </TableBody>
            </Table>
        </TableContainer>
        <Container style={{ height: "90vh", minWidth: "90%", marginTop: "2rem" }} >
          <Box
                component="form"
                onSubmit={addTime}
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
        </>
    )
}

export default MemberPage