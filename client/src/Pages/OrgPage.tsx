import React from 'react';
import {
    Box,
    Container,
    Paper,
    Button,
    FormControl,
    Typography,
    Link,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Grid,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    TextFieldProps,
    ThemeProvider,
} from '@mui/material';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { useState, useRef } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import Loading from '../Items/Loading';
import { TimeFragment } from '../Items/TimeFragment';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import AddIcon from '@mui/icons-material/Add';
import WarningIcon from '@mui/icons-material/Warning';
import { createTheme } from '@mui/material/styles';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

const cellStyle = { border: '1px solid', padding: '0', height: '2rem' };

// const theme = createTheme({
//     typography: {
//         fontFamily: ['Optima', 'sans-serif'].join(','),
//     }
// });

const OrgPage = () => {
    const { enqueueSnackbar } = useSnackbar();
    const { organization } = useParams();
    const navigate = useNavigate();
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const [day, setDay] = useState((new Date().getDay() + 6) % 7);
    const newMember = useRef<TextFieldProps>(null);
    const queryClient = useQueryClient();
    const [selectedRows, setSelectedRows] = useState<number[]>([]);
    const [deleteConfirmation, setDeleteConfirmation] = useState<{ open: boolean; member: string | null }>({
        open: false,
        member: null,
    });
    const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

    const { isLoading: loading, error: error, data: data } = useQuery(
        ['get-organization-times', organization],
        async () => {
            let r = await axios.get(`/api/${organization}`);
            return r.data;
        },
        {
            retry: false,
        }
    );

    if (error) {
        let e: any = error;
        enqueueSnackbar(
            e.response.status === 400 && e.response.data.detail ? e.response.data.detail : 'Something has gone wrong.',
            { variant: 'error' }
        );
        navigate('/');
    }

    const addmutation = useMutation(
        async (member: string) => {
            return axios.put(`/api/${organization}/${member}`);
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries('get-organization-times');
            },
            onError: (error: any, variables, context) => {
                enqueueSnackbar(error.response.data.detail ? error.response.data.detail : 'Something has gone wrong.', {
                    variant: 'error',
                });
            },
        }
    );

    const delmutation = useMutation(
        async (member: string) => {
            return axios.delete(`/api/${organization}/${member}`);
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries('get-organization-times');
            },
        }
    );

    const addMember = (e: any) => {
        e.preventDefault();
        if (e.target.member.value === '') {
            enqueueSnackbar('Name cannot be empty', { variant: 'error' });
            return;
        }
        addmutation.mutate(e.target.member.value);
        e.target.member.value = '';
    };

    const delMember = (name: string) => {
        delmutation.mutate(name);
    };

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
        const hour = hourIndex + 8;
        const amPm = hour < 12 || hour === 24 ? 'AM' : 'PM';
        const formattedHour = hour <= 12 ? hour : hour - 12;
        return `${formattedHour}:00${amPm}`;
    };

    const handleCellClick = (rowIndex: number) => {
        if (selectedRows.includes(rowIndex)) {
            setSelectedRows(selectedRows.filter((row) => row !== rowIndex));
        } else {
            setSelectedRows((prevSelectedRows) => [...prevSelectedRows.slice(-1), rowIndex]);
        }
    };

    const renderVerticalLines = (rowIndex: number) => {
        if (selectedRows.includes(rowIndex)) {
            return (
                <React.Fragment>
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            borderLeft: '2px solid red',
                            height: '100%',
                            zIndex: 1,
                        }}
                    ></div>
                </React.Fragment>
            );
        }
        return null;
    };

    const handleMemberSelect = (member: string) => {
        setSelectedMembers((prevSelectedMembers) => {
            if (prevSelectedMembers.includes(member)) {
                return prevSelectedMembers.filter((selectedMember) => selectedMember !== member);
            } else {
                return [...prevSelectedMembers, member];
            }
        });
    };

    return (
        // <ThemeProvider theme={theme}>
            <Container sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                <Button onClick={() => navigate('/')} sx={{ position: 'absolute', left: '3rem', top: '1rem' }}>
                    Back
                </Button>
                <div style={{ marginTop: '3rem' }}>
                    {loading ? (
                        <Loading />
                    ) : (
                        <form onSubmit={addMember}>
                            <Grid container component={Paper} elevation={5} sx={{ padding: '2rem', margin: '1rem' }}>
                                <Grid item xs={1}>
                                    <Button onClick={() => setDay(day - 1)} disabled={day === 0}>
                                        Prev
                                    </Button>
                                </Grid>
                                <Grid item xs={10} mb="1rem">
                                    <Typography align="center" variant="h4">
                                        {days[day]}
                                    </Typography>
                                </Grid>
                                <Grid item xs={1}>
                                    <Button onClick={() => setDay(day + 1)} disabled={day === 6}>
                                        Next
                                    </Button>
                                </Grid>
                                <Grid item xs={12}>
                                    <TableContainer>
                                        <div style={{ overflow: 'auto', maxHeight: '500px' }}>
                                            <Table size="medium">
                                                <TableHead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                                                    <TableRow style={{ background: 'white', height: '3rem' }}>
                                                        <TableCell sx={{ ...cellStyle }} colSpan={3} width="16%" align="center">
                                                            Member
                                                        </TableCell>
                                                        {Array.from(Array(12).keys()).map((i, index) => (
                                                            <TableCell key={index} sx={{ ...cellStyle }} width="6%" align="center">
                                                                {formatTime(i)}
                                                            </TableCell>
                                                        ))}
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {selectedMembers.map((name) => (
                                                        <React.Fragment key={name}>
                                                            <TableRow style={{ background: 'lightgray' }}>
                                                                <TableCell align="center" sx={cellStyle}>
                                                                    <IconButton aria-label="Delete" onClick={() => openDeleteConfirmation(name)}>
                                                                        <DeleteOutlinedIcon />
                                                                    </IconButton>
                                                                </TableCell>
                                                                <TableCell align="center" sx={cellStyle} width="3%">
                                                                    <IconButton aria-label="Pin" onClick={() => handleMemberSelect(name)}>
                                                                        <ArrowDownwardIcon />
                                                                    </IconButton>
                                                                </TableCell>
                                                                <TableCell align="center" sx={{
                                                                    ...cellStyle,
                                                                    '&:hover': {
                                                                        backgroundColor: '#E0E0E0',
                                                                    },
                                                                }}>
                                                                    <Link href={`/${organization}/${name}`} sx={{ textDecoration: 'none', color: '#2954D0', '&:hover': { fontWeight: 'bold' } }}>
                                                                        <div>
                                                                            {name}
                                                                        </div>
                                                                    </Link>
                                                                </TableCell>
                                                                {Array.from(Array(12).keys()).map((_, i) => (
                                                                    <TableCell
                                                                        key={i}
                                                                        sx={cellStyle}
                                                                        onClick={() => handleCellClick(i)}
                                                                        style={{
                                                                            position: 'relative',
                                                                        }}
                                                                    >
                                                                        <TimeFragment
                                                                            fragments={[
                                                                                data[name][day * 48 + i * 4],
                                                                                data[name][day * 48 + i * 4 + 1],
                                                                                data[name][day * 48 + i * 4 + 2],
                                                                                data[name][day * 48 + i * 4 + 3],
                                                                            ]}
                                                                        />
                                                                        {renderVerticalLines(i)}
                                                                    </TableCell>
                                                                ))}
                                                            </TableRow>
                                                        </React.Fragment>
                                                    ))}
                                                    {Object.keys(data)
                                                        .filter((member) => !selectedMembers.includes(member))
                                                        .map((name) => (
                                                            <TableRow key={name} style={{ background: selectedMembers.includes(name) ? 'lightgray' : 'transparent' }}>
                                                                <TableCell align="center" sx={cellStyle}>
                                                                    <IconButton aria-label="Delete" onClick={() => openDeleteConfirmation(name)}>
                                                                        <DeleteOutlinedIcon />
                                                                    </IconButton>
                                                                </TableCell>
                                                                <TableCell align="center" sx={cellStyle}>
                                                                    <IconButton aria-label="Pin" onClick={() => handleMemberSelect(name)}>
                                                                        <ArrowUpwardIcon />
                                                                    </IconButton>
                                                                </TableCell>
                                                                <TableCell align="center" sx={{
                                                                    ...cellStyle,
                                                                    '&:hover': {
                                                                        backgroundColor: '#F2F1F1',
                                                                    },
                                                                }}>
                                                                    <Link href={`/${organization}/${name}`} sx={{ textDecoration: 'none', color: '#2954D0', '&:hover': { fontWeight: 'bold' } }}>
                                                                        <div>
                                                                            {name}
                                                                        </div>
                                                                    </Link>
                                                                </TableCell>
                                                                {Array.from(Array(12).keys()).map((_, i) => (
                                                                    <TableCell
                                                                        key={i}
                                                                        sx={cellStyle}
                                                                        onClick={() => handleCellClick(i)}
                                                                        style={{
                                                                            position: 'relative',
                                                                        }}
                                                                    >
                                                                        <TimeFragment
                                                                            fragments={[
                                                                                data[name][day * 48 + i * 4],
                                                                                data[name][day * 48 + i * 4 + 1],
                                                                                data[name][day * 48 + i * 4 + 2],
                                                                                data[name][day * 48 + i * 4 + 3],
                                                                            ]}
                                                                        />
                                                                        {renderVerticalLines(i)}
                                                                    </TableCell>
                                                                ))}
                                                            </TableRow>
                                                        ))}
                                                    <TableRow>
                                                        <TableCell align="center" sx={cellStyle} colSpan={2}>
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
                <Dialog open={deleteConfirmation.open} onClose={closeDeleteConfirmation}>
                    <DialogTitle>Delete Confirmation</DialogTitle>
                    <DialogContent>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                            <WarningIcon style={{ color: 'red', marginRight: '8px' }} />
                            <Typography variant="body1">
                                Warning: Deleting the member <strong>{deleteConfirmation.member}</strong> is irreversible.
                            </Typography>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={closeDeleteConfirmation} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleDeleteConfirmation} color="primary">
                            Delete Anyway
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        // </ThemeProvider>
    );
};

export default OrgPage;
