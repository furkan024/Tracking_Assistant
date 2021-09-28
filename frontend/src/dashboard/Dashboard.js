import React, { useState, useEffect } from 'react';

import { useDataProvider, Loading, Error, useGetOne } from 'react-admin';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import {
    Tabs, Card, CardHeader, Divider, FormControl, InputLabel,
    Select, MenuItem, Tab, Typography, Box, Button,
} from '@material-ui/core';

//Chart
import PieChart from '../components/Charts/PieChart';
import ApexChart from '../components/Charts/ApexChart';
//Components
import CardComponent from '../components/Card';





const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    cardRoot: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
        display: 'flex',

    },
    card: {
        overflow: 'hidden',
        height: '100%',
        width: '100%'
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 150,
        maxWidth: '100%',
    },
    chips: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    chip: {
        margin: 2,
    },
    noLabel: {
        marginTop: theme.spacing(3),
    },

}));

const Demo = () => {
    const classes = useStyles();
    const dataProvider = useDataProvider();
    const [report, setReport] = useState();
    const [loading, setLoading] = useState(true);
    const [lesson, setLesson] = useState();
    const [lectures, setLectures] = useState();
    const [users, setUsers] = useState(0);
    const [usersList, setUsersList] = useState();
    const [pendingReports, setPendingReports] = useState(0)
    const [lectureCount, setLectureCount] = useState(0)
    const [reportCount, setReportCount] = useState(0)
    const [selectedReport, setSelectedReport] = useState()
    const [reports, setReports] = useState([])
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [error, setError] = useState();
    const [reportLoding, setReportLoading] = useState(true)
    const [userLoding, setUserLoading] = useState(true)
    const [lectureLoading, setLectureLoading] = useState(true)
    const [selectedLecture, setSelectedLecture] = useState();
    const [selectedPersonelLecture, setSelectedPersonelLecture] = useState();
    const [lectureDateList, setLectureDateList] = useState();
    const [selectedLectureDate, setSelectedLectureDate] = useState();
    const [selectedPersonelUser, setSelectedPersonelUser] = useState();
    const [userReportList, setUserReportList] = useState();
    const [personelReport, setPersonelReport] = useState();
    





    useEffect(() => {
        dataProvider.getList('reports', {
            pagination: { page: 1, perPage: 1 },
            sort: { field: 'createdAt', order: 'DESC' },
            filter: {},
        })
            .then(({ data }) => {
                console.log(data)
                setReport(data[0]);
                setPersonelReport(data[0])
                setSelectedReport(data[0])
                setReportLoading(false);
                setLoading(false);
            })
            .catch(error => {
                setError(error);
                setLoading(false);
            })
    }, []);

    useEffect(() => {
        dataProvider.getList('tags', {
            pagination: { page: 1, perPage: 10 },
            sort: { field: 'name', order: 'ASC' },
            filter: {},
        })
            .then(({ data }) => {
                setLectures(data);
                if (data.length === undefined) {
                    setLectureCount(0);
                }
                setLectureCount(data.length);
                setLectureLoading(false);
            })
            .catch(error => {
                setError(error);
                setLoading(false);
                setLectureLoading(true)
            })
    }, []);

    useEffect(() => {
        dataProvider.getList('users', {
            pagination: { page: 1, perPage: 10 },
            sort: { field: 'name', order: 'ASC' },
            filter: {},
        })
            .then(({ data }) => {
                if (data.length === undefined) {
                    setUsers(0);
                }
                setUsers(data.length);
                setUsersList(data);
                setUserLoading(false);
            })
            .catch(error => {
                setError(error);
                setLoading(false);
            })
    }, []);

    useEffect(() => {
        dataProvider.getList('pendingReports', {
            pagination: { page: 1, perPage: 10 },
            sort: { field: 'createdAt', order: 'ASC' },
            filter: {},
        })
            .then(({ data }) => {
                if (data.length === undefined) {
                    setPendingReports(0);
                }
                setPendingReports(data.length);
            })
            .catch(error => {
                setError(error);
                setLoading(false);
            })
    }, []);

    useEffect(() => {
        dataProvider.getList('reports', {
            pagination: { page: 1, perPage: 10 },
            sort: { field: 'createdAt', order: 'DESC' },
            filter: {},
        })
            .then(({ data }) => {
                if (data.length === undefined) {
                    setReportCount(0);
                }
                setReports(data)
                setReportCount(data.length);
            })
            .catch(error => {
                setError(error);
                setLoading(false);
            })
    }, []);




    const handleListItemClick = (event, index, ctx) => {
        setSelectedIndex(ctx);
        setSelectedReport(index)
    };

    const handleChangeLecture = (event) => {
        setSelectedLecture(event.target.value);
        fetch(`http://localhost:4000/api/custom/${event.target.value.id}`)
            .then(res => res.json())
            .then((data) => {
                console.log(data);
                setSelectedReport(data)
                setReportLoading(false);
            })
            .catch(err => {
                setError(err);
                setReportLoading(false);
            })
        console.log('event.target.value', event.target.value)
    };

    const handleChangePersonelLecture = (event) => {
        setSelectedPersonelLecture(event.target.value);
        fetch(`http://localhost:4000/api/custom/lectureDate/${event.target.value.id}`)
            .then(res => res.json())
            .then((data) => {
                console.log(data);
                setLectureDateList(data)
            })
            .catch(err => {
                setError(err);
            })
        console.log('event.target.value', event.target.value)
    };

    const handleChangePersonelLectureDate = (event) => {
        setSelectedLectureDate(event.target.value)
        fetch(`http://localhost:4000/api/custom/user/${selectedPersonelLecture.id}+${event.target.value}`)
            .then(res => res.json())
            .then((data) => {
                console.log(data);
                setUserReportList(data)
            })
            .catch(err => {
                setError(err);
            })
        console.log('event.target.value', event.target.value)
    };

    const handleChangeUser = (event) => {
        setSelectedPersonelUser(event.target.value);
        console.log('asdasdasdasd',event.target.value)
        fetch(`http://localhost:4000/api/custom/report/${selectedPersonelLecture.id}+${selectedLectureDate}+${event.target.value.id}`)
            .then(res => res.json())
            .then((data) => {
                console.log(data);
                setPersonelReport(data);
            })
            .catch(err => {
                setError(err);
            })
    };


    return (
        <div className={classes.root}>
            <Grid container spacing={2}>
                <Grid item xs={3}>
                    <CardComponent count={users} title="Total Users" name="users" />
                </Grid>
                <Grid item xs={3}>
                    <CardComponent count={lectureCount} title="Total Lessons" name="lessons" />
                </Grid>
                <Grid item xs={3}>
                    <CardComponent count={pendingReports} title="Total Pending Reports" name="pendingReports" />
                </Grid>
                <Grid item xs={3}>
                    <CardComponent count={reportCount} title="Total Reports" name="reports" />
                </Grid>

                <Grid item xs={12} sm={12} md={6} lg={6} >
                    {lectureLoading ? null : (
                        <Paper square className={classes.root}>
                            <FormControl variant="outlined" className={classes.formControl}>
                                <InputLabel id="demo-simple-select-outlined-label">Select Lesson</InputLabel>
                                <Select
                                    labelId="demo-simple-select-outlined-label"
                                    id="demo-simple-select-outlined"
                                    value={selectedLecture}
                                    onChange={handleChangeLecture}
                                    label="Select Lesson"
                                >
                                    {lectures.map(i => (
                                        <MenuItem value={i}>{i.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Paper>
                    )}
                </Grid>

                <Grid item xs={12} sm={12} md={6} lg={6} >
                    {userLoding ? null : (
                        <Paper square className={classes.root}>
                            <FormControl variant="outlined" className={classes.formControl}>
                                <InputLabel id="demo-simple-select-outlined-label">Select Lesson</InputLabel>
                                <Select
                                    labelId="demo-simple-select-outlined-label"
                                    id="demo-simple-select-outlined"
                                    value={selectedLecture}
                                    onChange={handleChangePersonelLecture}
                                    label="Select Lesson"
                                >
                                    {lectures.map(i => (
                                        <MenuItem value={i}>{i.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            {lectureDateList ? (
                                <FormControl variant="outlined" className={classes.formControl}>
                                    <InputLabel id="demo-simple-select-outlined-label">Lecture Date</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-outlined-label"
                                        id="demo-simple-select-outlined"
                                        value={selectedLectureDate}
                                        onChange={handleChangePersonelLectureDate}
                                        label="Lecture Date"
                                    >
                                        {lectureDateList.map(i => (
                                            <MenuItem value={i}>{i.split('T')[0]}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            ) : null}
                            { userReportList ? (
                                <FormControl variant="outlined" className={classes.formControl}>
                                    <InputLabel id="demo-simple-select-outlined-label">Select User</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-outlined-label"
                                        id="demo-simple-select-outlined"
                                        value={selectedPersonelUser}
                                        onChange={handleChangeUser}
                                        label="Select User"
                                    >
                                        {userReportList.map(i => (
                                            <MenuItem value={i}>{i.name}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            ) : null}
                        </Paper>
                    )}
                </Grid>

                <Grid item xs={12} sm={12} md={6} lg={6} >
                    {reportLoding ? null : (
                        <Card className={classes.card}>
                            <PieChart report={selectedReport} />
                        </Card>
                    )}
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6} >
                    {reportLoding ? null : (
                        <Card className={classes.card}>
                            <PieChart report={personelReport} />
                        </Card>
                    )}

                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                    {reportLoding ? null : (
                        <Card className={classes.card}>
                            <ApexChart report={personelReport} />
                        </Card>
                    )}
                </Grid>
            </Grid>
        </div>
    );
}

/*
{loading ? null : (
                        <Card className={classes.card}>
                            <CardHeader
                                style={{ padding: '6px', textAlign: 'center' }}
                                title="Report List"
                            />
                            <Divider />
                            <div className={classes.cardRoot}>
                                <Divider style={{ margin: '20px' }} />
                                <div className={classes.root}>
                                    <List component="nav" aria-label="main mailbox folders">
                                        {reports.map((i, ctx) => (
                                            <div key={ctx}>
                                                <ListItem
                                                    button
                                                    selected={selectedIndex === ctx}
                                                    onClick={(event) => handleListItemClick(event, i, ctx)}
                                                >
                                                    <ListItemIcon>
                                                        <ImportContactsIcon />
                                                    </ListItemIcon>
                                                    <ListItemText 
                                                        primary={i.tagName} 
                                                        secondary={i.lecture_date.split('T')[0] + ' ' +  i.userName.toUpperCase()} 
                                                    />
                                
                                                </ListItem>
                                                <Divider />
                                            </div>
                                        ))}
                                    </List>


                                </div>

                            </div>
                        </Card>
                    )}
                    */

export default Demo;


