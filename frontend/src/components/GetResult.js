import React, { useState, useEffect } from "react";
import { useUpdate, useNotify, useRedirect, useDataProvider, } from 'react-admin';
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

const GetResult = ({ record }) => {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };



    const handleOkButton = () => {
        setOpen(false);
        fetch('http://localhost:4000/api/custom')
            .then(response => response.json())
            .then(data => console.log(data));
            setLoading(true);
    }


    return (
        <div>
            <Button
                startIcon={<AssessmentIcon />}
                color="secondary"
                className={classes.button}
                onClick={handleClickOpen}
                disabled={loading}> Get Result
            </Button>
            <Dialog disableBackdropClick disableEscapeKeyDown open={open} onClose={handleClose}>
                <DialogTitle>Are you sure want results for this pending media?</DialogTitle>
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

export default GetResult;