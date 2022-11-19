import { Box, Container, Paper, Button, FormControl, FormHelperText, Input, InputLabel, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Grid, Skeleton, CircularProgress, Alert, Typography, Link, Slide, TextField, TextFieldProps } from '@mui/material';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { useState, useRef } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import Loading from '../Items/Loading';
import { TimeFragment } from '../Items/TimeFragment';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import AddIcon from '@mui/icons-material/Add';

const cellStyle = { border: "1px solid", padding: "0", height: "2rem" }

let OrgPage = () => {
    let { enqueueSnackbar } = useSnackbar()
    let { organization } = useParams()
    let navigate = useNavigate()
    const days = ['Monday', "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const [day, setDay] = useState(0); // 0-6
    // const [newMember, setNewMember] = useState("");
    const newMember = useRef<TextFieldProps>(null)
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

    const addmutation = useMutation(async (member: string) => {
        return axios.put(`/api/${organization}/${member}`)
    },
    {
        onSuccess: () => {
            queryClient.invalidateQueries("get-organization-times")
        }
    })

    const delmutation = useMutation(async (member: string) => {
        return axios.delete(`/api/${organization}/${member}`)
    },
    {
        onSuccess: () => {
            queryClient.invalidateQueries("get-organization-times")
        }
    })

    const addMember = () => {
        // addmutation.mutate(newMember.current?.value)
    }

    const delMember = (name: string) => {
        delmutation.mutate(name)
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
                            <Typography align="center" variant="h4">{days[day]}</Typography>
                        </Grid>
                        <Grid item xs={1}>
                            <Button onClick={() => setDay(day + 1)} disabled={day === 6}>Next</Button>
                        </Grid>
                        <Grid item xs={12}>
                            <TableContainer>
                                <Table size="medium">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={cellStyle} width="4%" />
                                            <TableCell sx={cellStyle} width="18%" />
                                            {
                                                Array.from(Array(12).keys()).map((i, index) => (
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
                                                        <IconButton aria-label="Delete" onClick={() => delMember(name)}>
                                                          <DeleteOutlinedIcon/>
                                                        </IconButton>
                                                    </TableCell>
                                                    <TableCell align="center" sx={cellStyle}>
                                                        <Link href={`/${organization}/${name}`}>
                                                        
                                                            {name}
                                                        </Link>
                                                    </TableCell>
                                                    {
                                                        Array.from(Array(12).keys()).map((_, i) => (
                                                            <TableCell key={i} sx={cellStyle}>
                                                                <TimeFragment fragments={[
                                                                    data[name][day * 48 + i * 4],
                                                                    data[name][day * 48 + i * 4 + 1],
                                                                    data[name][day * 48 + i * 4 + 2],
                                                                    data[name][day * 48 + i * 4 + 3]]} />
                                                            </TableCell>
                                                        ))
                                                    }
                                                </TableRow>
                                            ))
                                        }
                                        <TableRow>
                                            <TableCell align="center" sx={cellStyle}>
                                                <IconButton aria-label="Create" onClick={addMember}>
                                                    <AddIcon/>
                                                </IconButton>
                                            </TableCell>
                                            <TableCell align="center" sx={cellStyle}>
                                                <FormControl>
                                                    <TextField hiddenLabel id="standard-basic" variant="filled" size="small"/>
                                                </FormControl>
                                            </TableCell>
                                        </TableRow>
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