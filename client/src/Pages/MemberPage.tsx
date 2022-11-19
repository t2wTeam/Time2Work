import { Label } from '@mui/icons-material';
import { Box, Container, Paper, TextField, Button, FormControl, FormHelperText, Input, InputLabel, FormControlLabel, FormLabel, Radio, RadioGroup, Checkbox, FormGroup, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Autocomplete } from '@mui/material';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { ReactNode, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import Loading from '../Items/Loading';
import { TimeFragmentVertical } from '../Items/TimeFragment';
import { allTime } from '../Utils/AllTime';

const cellStyle = { border: "1px solid", padding: "0", height: "3rem" }
const defaultDays = [false, false, false, false, false, false, false]
let MemberPage = () => {
    let { enqueueSnackbar } = useSnackbar()
    let { organization, name } = useParams()
    let navigate = useNavigate()
    const queryClient = useQueryClient()
    const [selectedDays, setSelectedDays] = useState(defaultDays)

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

    const days = ['M', 'TU', 'W', 'TH', 'F', 'SA', 'SU']
    const dayShort = ['M', 'TU', 'W', 'TH', 'F', 'SA', 'SU']

    const mutation = useMutation(async (data: any) => {
        return axios.post(`/api/${organization}/${name}`, {"data": data})
    },
        {
            onSuccess: () => {
                queryClient.invalidateQueries("get-member")
            },
            onError: (error: any, variables, context) => {
                enqueueSnackbar(
                    error.response.data.detail ? (
                        error.response.data.detail
                    ) : (
                        "Something has gone wrong. Maybe the organization/member name is invalid! "
                    ),
                    { variant: 'error' }
                )
            }
        })

    const addTime = (e: any) => {
        e.preventDefault()
        const data = {
            available: e.target.availablegroup.value,
            days: selectedDays,
            start: e.target.start.value,
            end: e.target.end.value,
        }

        if (e.target.start.value === "" || e.target.end.value === ""){
            enqueueSnackbar(
                "Name cannot be empty",
                { variant: 'error' }
            )
            return
        }
        mutation.mutate(data)
        e.target.start.value = "12:00"
        e.target.end.value = "12:15"
    }



    return (
        <Container sx={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Button onClick={() => { navigate(`/${organization}`) }} sx={{ position: "absolute", left: "3rem", top: "2rem" }}>Back</Button>
            {loading ? (
                <Loading />
            ) : (
                <>
                    <TableContainer >
                        <Table size="small" sx={{ border: "1px solid" }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ borderBottom: "1px solid", paddingX: "1rem" }} width="16%" />
                                    {
                                        days.map(d => (
                                            <TableCell sx={{ borderBottom: "1px solid" }} key={d} width="12%" align="center">
                                                {d}
                                            </TableCell>
                                        ))
                                    }
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    Array.from(Array(12).keys()).map((i, index) => (
                                        <TableRow key={index}>
                                            <TableCell sx={{ borderBottom: "1px solid" }} align='center' width="16%">{`${i + 8}: 00`}</TableCell>
                                            {
                                                days.map((d, di) => (
                                                    <TableCell sx={cellStyle} key={d} width="12%">
                                                        <TimeFragmentVertical
                                                            fragments={[
                                                                data[di * 48 + 4 * i],
                                                                data[di * 48 + 4 * i + 1],
                                                                data[di * 48 + 4 * i + 2],
                                                                data[di * 48 + 4 * i + 3]
                                                            ]}
                                                        />
                                                    </TableCell>
                                                ))
                                            }
                                        </TableRow>
                                    ))
                                }

                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Paper sx={{ ml: "2rem" }}>
                        <Box
                            padding="2rem"
                            component="form"
                            onSubmit={addTime}
                            noValidate
                            autoComplete="off"
                            display="flex"
                            flexWrap="wrap"
                            alignItems="flex-end"
                        >
                            <Box width="100%" display="flex"  pb="2rem">
                                <Typography variant="h5">
                                    {organization}: {name}
                                </Typography>
                            </Box>
                            <FormControl>
                                <FormLabel id="available-label">Availability</FormLabel>
                                <RadioGroup
                                    row={true}
                                    aria-labelledby="available-label"
                                    defaultValue={true}
                                    name="availablegroup"
                                >
                                    <FormControlLabel value={true} control={<Radio/>} label="Available" />
                                    <FormControlLabel value={false} control={<Radio />} label="Unavailable" />
                                </RadioGroup>
                            </FormControl>
                            <FormControl component="fieldset" variant="standard">
                                <FormLabel component="legend">Day(s)</FormLabel>
                                <FormGroup row={true}>
                                    {dayShort.map((day, index) => (
                                        <FormControlLabel
                                            key={day}
                                            control={
                                                <Checkbox name={day} onChange={(e) => {
                                                    selectedDays[index] = e.target.checked
                                                    setSelectedDays(selectedDays)
                                                }} />
                                            }
                                            label={day}
                                        />
                                    ))}
                                </FormGroup>
                            </FormControl>
                            <FormControl>
                                <Autocomplete
                                    disablePortal
                                    options={allTime.slice(0, 48)}
                                    sx={{ width: "10rem", padding: "0" }}
                                    renderInput={(params) => <TextField name="start" {...params} label="Start" variant="standard" />}
                                />
                            </FormControl>
                            <Typography component="span" sx={{ mx: "1rem" }}>
                                {"—"}
                            </Typography>
                            <FormControl>
                                <Autocomplete
                                    disablePortal
                                    options={allTime.slice(0, 49)}
                                    sx={{ width: "10rem", padding: "0" }}
                                    renderInput={(params) => <TextField name="end" {...params} label="End" variant="standard" />}
                                />
                            </FormControl>
                            <FormControl>
                                <Button sx={{ ml: "1rem" }} type="submit" variant="contained">Add</Button>
                            </FormControl>
                        </Box>
                    </Paper>
                </>
            )}
        </Container>
    )
}

export default MemberPage