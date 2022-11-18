import { Box, Container, Paper, Button, FormControl, FormHelperText, Input, InputLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Grid } from '@mui/material';


interface TimeFragment {
    fragments: boolean[]
}

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
    }

    return (
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
                                ))
                            }
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    )
}

export default OrgPage