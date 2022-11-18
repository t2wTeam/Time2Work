import { Box, Container, Paper, Button, FormControl, FormHelperText, Input, InputLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Grid, Skeleton, CircularProgress, Alert, Typography, Link } from '@mui/material';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import Loading from '../Items/Loading';
import TimeFragment from '../Items/TimeFragment';

const cellStyle = { border: "1px solid", padding: "0", height: "2rem" }

let OrgPage = () => {
    let { enqueueSnackbar } = useSnackbar()
    let { organization } = useParams()
    let navigate = useNavigate()
    const dayText = ['Monday', "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const [day, setDay] = useState(0); // 0-6
    const [newMember, setNewMember] = useState("");
    const queryClient = useQueryClient()

    let { isLoading: loading, error: error, data: data, } = useQuery(
        ["get-organization-times", organization],
        async () => {
            let r = await axios.get(`/api/${organization}`)
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

    const mutation = useMutation(async (member: string) => {
        return axios.put(`/api/${organization}/${member}`)
    },
        {
            onSuccess: () => {
                queryClient.invalidateQueries("get-organization-times")
            }
        })

    const addMember = () => {
        mutation.mutate(newMember)
    }



    return (
        <Container sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
            {loading ? (
                <Loading />
            ) : (
                <>
                    <Grid container component={Paper} elevation={5} sx={{ padding: "2rem", margin: "1rem" }}>
                        <Grid item xs={1}>
                            <Button onClick={() => setDay(day - 1)} disabled={day === 0}>Prev</Button>
                        </Grid>
                        <Grid item xs={10}>
                            <Typography align="center" variant="h4">{dayText[day]}</Typography>
                        </Grid>
                        <Grid item xs={1}>
                            <Button onClick={() => setDay(day + 1)} disabled={day === 6}>Next</Button>
                        </Grid>
                        <Grid xs={12} sx={{ my: "1rem" }}>
                            <FormControl>
                                <InputLabel>New Member Name</InputLabel>
                                <Input name="member" onChange={(e) => setNewMember(e.target.value)} />
                            </FormControl>
                            <FormControl>
                                <Button sx={{ ml: "1rem" }} type="submit" variant="outlined" onClick={addMember}>Add!</Button>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
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
                                                    <TableCell align="center" sx={cellStyle}>
                                                        <Link href={`/${organization}/${name}`}>
                                                            {name}
                                                        </Link>
                                                    </TableCell>
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
                        </Grid>
                    </Grid>
                </>
            )}
        </Container>
    )
}

export default OrgPage