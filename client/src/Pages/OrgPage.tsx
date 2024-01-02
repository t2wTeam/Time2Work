import { Box, Container, Paper, Button, FormControl, FormHelperText, Input, InputLabel, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Grid, Skeleton, CircularProgress, Alert, Typography, Link, Slide, TextField, TextFieldProps,  Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions} from '@mui/material';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { useState, useRef } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import Loading from '../Items/Loading';
import { TimeFragment } from '../Items/TimeFragment';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import AddIcon from '@mui/icons-material/Add';
import React from 'react';
const cellStyle = { border: "1px solid", padding: "0", height: "2rem" }

let OrgPage = () => {
    let { enqueueSnackbar } = useSnackbar()
    let { organization } = useParams()
    let navigate = useNavigate()
    const days = ['Monday', "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const [day, setDay] = useState((new Date().getDay() + 6) % 7); // 0-6
    // const [newMember, setNewMember] = useState("");
    const newMember = useRef<TextFieldProps>(null)
    const queryClient = useQueryClient()
    const [selectedRows, setSelectedRows] = useState<number[]>([]);
    const [deleteConfirmation, setDeleteConfirmation] = useState<{ open: boolean, member: string | null }>({ open: false, member: null });

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
            },
            onError: (error: any, variables, context) => {
                enqueueSnackbar(
                    error.response.data.detail ? (
                        error.response.data.detail
                    ) : (
                        "Something has gone wrong."
                    ),
                    { variant: 'error' }
                )
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

    const addMember = (e:any) => {
        e.preventDefault()
        if (e.target.member.value === ""){
            enqueueSnackbar(
                "Name cannot be empty",
                { variant: 'error' }
            )
            return
        }
        addmutation.mutate(e.target.member.value)
        e.target.member.value = ""
        // addmutation.mutate(newMember.current?.value)
    }

    const delMember = (name: string) => {
        delmutation.mutate(name)
    }

    const openDeleteConfirmation = (member: string) => {
        setDeleteConfirmation({ open: true, member });
    };

    const closeDeleteConfirmation = () => {
        setDeleteConfirmation({ open: false, member: null });
    };

    const handleDeleteConfirmation = () => {
        if (deleteConfirmation.member) {
            delMember(deleteConfirmation.member);
        }
        closeDeleteConfirmation();
    };

    const formatTime = (hourIndex: number) => {
        const hour = hourIndex + 8; // Convert index to hour (8 AM to 5 PM)
        const amPm = hour < 12 || hour === 24 ? "AM" : "PM";
        const formattedHour = hour <= 12 ? hour : hour - 12;
        return `${formattedHour}:00${amPm}`;
    };
    const handleCellClick = (rowIndex: number) => {
        if (selectedRows.includes(rowIndex)) {
            // If the row is already selected, remove it
            setSelectedRows(selectedRows.filter((row) => row !== rowIndex));
        } else {
            // If the row is not selected, add it and keep only the last two selected rows
            setSelectedRows((prevSelectedRows) => [...prevSelectedRows.slice(-1), rowIndex]);
        }
    };
    const isCellSelected = (rowIndex: number) => {
        return selectedRows.includes(rowIndex);
    };

    const renderVerticalLines = (rowIndex: number) => {
        if (selectedRows.includes(rowIndex)) {
            return (
                <React.Fragment>
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            borderLeft: '2px solid red', // Customize the line style/color
                            height: '100%',
                            zIndex: 1,
                            //left: `${6 * rowIndex}%`, // Adjust position based on your cell width
                        }}
                    ></div>
                </React.Fragment>
            );
        }
        return null;
    };

    return (
        <Container sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
            <Button onClick={() => { navigate(`/`) }} sx={{ position: "absolute", left: "3rem", top: "1rem" }}>Back</Button>
            <div style={{marginTop: "3rem" }}>
            {loading ? (
                <Loading />
            ) : (
                <form onSubmit={addMember}>
                    <Grid container component={Paper} elevation={5} sx={{ padding: "2rem", margin: "1rem" }}>
                        <Grid item xs={1}>
                            <Button onClick={() => setDay(day - 1)} disabled={day === 0}>Prev</Button>
                        </Grid>
                        <Grid item xs={10} mb="1rem">
                            <Typography align="center" variant="h4">{days[day]}</Typography>
                        </Grid>
                        <Grid item xs={1}>
                            <Button onClick={() => setDay(day + 1)} disabled={day === 6}>Next</Button>
                        </Grid>
                        <Grid item xs={12}>
                            <TableContainer>
                                <div style={{ overflow: 'auto', maxHeight: '500px' }}>
                                <Table size="medium">
                                    <TableHead>
                                    <TableRow style={{ position: 'sticky', top: 0, background: "white", height: "3rem", userSelect: 'none', zIndex: 1}}>
                                        <TableCell sx={{ ...cellStyle}} colSpan={2} width="16%" align="center">
                                            Member
                                        </TableCell >{
                                                Array.from(Array(12).keys()).map((i, index) => (
                                                    <TableCell key={index} sx={{ ...cellStyle}} width="6%" align="center">
                                                        {formatTime(i)}
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
                                                        <IconButton aria-label="Delete" onClick={() => openDeleteConfirmation(name)}>
                                                            <DeleteOutlinedIcon />
                                                        </IconButton>
                                                    </TableCell>
                                                    <TableCell align="center" sx={cellStyle}>
                                                        <Link href={`/${organization}/${name}`}>
                                                            {name}
                                                        </Link>
                                                    </TableCell>
                                                    {
                                                        Array.from(Array(12).keys()).map((_, i) => (
                                                            <TableCell key={i} sx={cellStyle} onClick={() => handleCellClick(i)}
                                                                       style={{
                                                                           background: isCellSelected(i) ? 'lightred' : 'transparent',
                                                                           position: 'relative',
                                                                       }}>
                                                                <TimeFragment fragments={[
                                                                    data[name][day * 48 + i * 4],
                                                                    data[name][day * 48 + i * 4 + 1],
                                                                    data[name][day * 48 + i * 4 + 2],
                                                                    data[name][day * 48 + i * 4 + 3]]} />
                                                                {renderVerticalLines(i)}
                                                            </TableCell>
                                                        ))
                                                    }
                                                </TableRow>
                                            ))
                                        }

                                        <TableRow >
                                            <TableCell align="center" sx={cellStyle}>
                                                <FormControl>
                                                    <IconButton aria-label="Create" type="submit">
                                                        <AddIcon />
                                                    </IconButton>
                                                </FormControl>
                                            </TableCell>
                                            <TableCell align="center" sx={cellStyle}>
                                                <FormControl>
                                                    <TextField hiddenLabel name="member" variant="filled" size="small" />
                                                </FormControl>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                                </div>
                            </TableContainer>
                        </Grid>
                    </Grid>
                </form>
            )}
        </div>
            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteConfirmation.open} onClose={closeDeleteConfirmation}>
                <DialogTitle>Delete Confirmation</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete the member: {deleteConfirmation.member}?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDeleteConfirmation} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteConfirmation} color="primary">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    )
}

export default OrgPage