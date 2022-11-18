import { Box, Container, Paper, TextField, Button, FormControl, FormHelperText, Input, InputLabel, FormControlLabel, FormLabel, Radio, RadioGroup, Checkbox, FormGroup, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { ReactNode } from 'react';
import { useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import TimeFragment from '../Items/TimeFragment';

let MemberPage = () => {
    let { enqueueSnackbar } = useSnackbar()
    let { organization, name } = useParams()
    let navigate = useNavigate()

    let { isLoading: loading, error: error, data: data, } = useQuery(
        ["get-organization-times", organization],
        async () => {
            let r = await axios.get(`/api/${organization}/${}`)
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
                "Something has gone wrong. Maybe the organization name is invalid! "
            ),
            { variant: 'error' }
        )
        navigate("/")
    }

    const days = ['MON', 'TU', 'WED', 'THUR', 'FRI', 'SAT', 'SUN']



    return (
        <>
        <TableContainer>
            <Table size="medium">
                <TableHead>
                    <TableRow>
                        <TableCell sx={cellStyle} width="22%" />
                        {
                            Array.from(Array(13).keys()).map((i, index) => (
                                <TableCell key={index} sx={cellStyle} width="6%" align="center">
                                    {`${i + 8}: 00`}
                                </TableCell>
                            ))
                        }
                    </TableRow>
                </TableHead>
                <TableBody>
                    {//Maybe object should be array cuz if not, dictionary is unordered :(
                        Object.keys(data).map((name) => (
                            <TableRow key={name}>
                                <TableCell align="center" sx={cellStyle}>{name}</TableCell>
                                {Array.from(Array(13).keys()).map((i, index) => (
                                    <TableCell key={index} sx={cellStyle}>
                                        <TimeFragment fragments={[
                                            data[name][day][i * 4],
                                            data[name][day][i * 4 + 1],
                                            data[name][day][i * 4 + 2],
                                            data[name][day][i * 4 + 3]]} />
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </TableContainer>
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
        </>
    )
}

export default MemberPage