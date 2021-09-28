import React, { useState, useEffect } from "react";
import { useUpdate, useNotify, useRedirect, useDataProvider,  } from 'react-admin';
import { makeStyles } from '@material-ui/core/styles';
import {
    Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Divider,
    InputLabel, Input, FormControl, Select, DialogContentText, MenuItem
} from '@material-ui/core';
import AssessmentIcon from '@material-ui/icons/Assessment';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


const useStyles = makeStyles((theme) => ({
    button: {
        margin: theme.spacing(0.5),
        fontSize: '13px'
    },
    startIcon: {
        fontSize: '21px'
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 320,
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 200,
    },
}));

const GetReport = ({ record }) => {
    const classes = useStyles();
    const dataProvider = useDataProvider();
    const notify = useNotify();
    const redirect = useRedirect();
    const [open, setOpen] = React.useState(false);
    const [status, setStatus] = React.useState('');
    const [tags, setTags] = useState([])
    const [startDate, setStartDate] = useState(new Date());
    const [loadingTag, setTagLoading] = useState(true);
    const [error, setError] = useState(false)


    const [approve, { loading }] = useUpdate(
        'medias',
        record.id,
        { tag_id: status, lecture_date: startDate  },
        record,
        {
            mutationMode: 'undoable',
            onSuccess: () => {
                redirect('/medias');
                notify('Media updated & Report request created successfully', 'info', {}, true);
            },
            onFailure: (err) => notify(`Error: ${err.message}`, 'warning'),
        }
    );


    const handleChange = (event) => {
        setStatus(event.target.value || '');
    };

    const handleClickOpen = () => {
        setOpen(true);
        if (!record.tag_id) {
            fetch('http://localhost:4000/api/tags/list')
                .then(res => res.json())
                .then((data) => {
                    console.log(data);
                    setTags(data);
                    setTagLoading(false);
                })
                .catch(err => {
                    setError(err);
                    setTagLoading(false);
                })
        }
    };

    const handleClose = () => {
        setOpen(false);
    };

    

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ media_id: record.id })
    };

    const handleOkButton = () => {
        setOpen(false);
        if (record.tag_id) {
            fetch('http://localhost:4000/api/pendingReports/', requestOptions)
                .then(response => response.json())
                .then(data => console.log(data));
        } else {
            approve();
            setTimeout(() => {
                fetch('http://localhost:4000/api/pendingReports/', requestOptions)
                    .then(response => response.json())
                    .then(data => console.log(data));
            }, 5000);
        }
    }

    console.log('startDate',startDate)

    return (
        <div>
            <Button
                startIcon={<AssessmentIcon />}
                color="secondary"
                className={classes.button}
                onClick={handleClickOpen}
                disabled={loading}> Report Request
            </Button>
            <Dialog disableBackdropClick disableEscapeKeyDown open={open} onClose={handleClose}>
                <DialogTitle>Are you sure want a report for this media?</DialogTitle>
                <DialogContent>

                    {record.tag_id ? (
                        null
                    ) : (


                            <FormControl variant="outlined" className={classes.formControl}>
                                <InputLabel id="demo-simple-select-outlined-label">Select Related Lesson</InputLabel>
                                <Select
                                    labelId="demo-simple-select-outlined-label"
                                    id="demo-simple-select-outlined"
                                    value={status}
                                    onChange={handleChange}
                                    label="Lesson"
                                >

                                    {tags.map(tag => (
                                        <MenuItem value={tag.id}>{tag.name}</MenuItem>
                                    ))}
                                </Select>
                                <Divider style={{ margin: '20px' }} />
                                <h5>Select Lecture date</h5>
                                <DatePicker selected={startDate} onChange={date => setStartDate(date)} />

                            </FormControl>


                        )}

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleOkButton} color="primary">
                        Ok
                    </Button>
                </DialogActions>
            </Dialog>
        </div>)
};

export default GetReport;