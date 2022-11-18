import { Box, Container, Paper, Button, FormControl, FormHelperText, Input, InputLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Grid, Skeleton, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import Loading from '../Items/Loading';
import TimeFragment from '../Items/TimeFragment';

const cellStyle = { border: "1px solid", padding: "0", height: "2rem" }

let OrgPage = () => {
    let { enqueueSnackbar } = useSnackbar()
    let { organization } = useParams()
    let navigate = useNavigate()

<<<<<<< HEAD

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

    if(error){
        let e: any = error
        enqueueSnackbar(
            e.response.status === 400  && e.response.data.detail ? (
                e.response.data.detail 
            ) : (
                "Something has gone wrong. Maybe the organization name is invalid! "
            ),
            { variant: 'error' }
        )
        navigate("/")
=======
let TimeFragment = (props: TimeFragment) => {
    let { fragments } = props
    return (
        <Grid container width="100%" height="100%">
            {
                fragments.map((i) => (
                    <Grid item xs={3} sx={{ bgcolor: i === true ? "darkgreen" : "darkred" }} width="25%" height="100%"/>
                ))
            }
        </Grid>
    )
}

let OrgPage = () => {
    const submit = (e: any) => {
        e && e.preventDefault();
        console.log(e)
>>>>>>> origin/may
    }

    

    return (
<<<<<<< HEAD
        <Container sx={{ height: "100%", width: "100%", display: "flex", justifyContent: "center" }}>
            {loading ? (
                <Loading />
            ) : (
                <TableContainer component={Paper} elevation={5} sx={{ padding: "2rem", margin: "1rem" }}>
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
                                                <TimeFragment fragments={[data[name][i * 4], data[name][i * 4 + 1], data[name][i * 4 + 2], data[name][i * 4 + 3]]} />
                                            </TableCell>
                                        ))}
                                    </TableRow>
=======
        <Container sx={{ height: "100%", width: "100%", display: "flex", justifyContent: "center", padding: "1rem" }}>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell></TableCell>
                            {
                                Array.from(Array(13).keys()).map((i) => (
                                    <TableCell padding="none" sx={{padding: "0"}}>{`${i + 8}: 00`}</TableCell>
                                ))
                            }
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell>Sample Name</TableCell>
                            {
                                Array.from(Array(13).keys()).map((i) => (
                                    <TableCell padding='none' sx={{border: "1px solid"}}>
                                        <TimeFragment fragments={[false, true, false, true]} />
                                    </TableCell>
>>>>>>> origin/may
                                ))
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Container>
    )
}

export default OrgPage