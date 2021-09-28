import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';

import { CardMedia, Avatar, IconButton, Typography, CardContent, Card } from '@material-ui/core';

import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import ImportContactsIcon from '@material-ui/icons/ImportContacts';
import AssessmentIcon from '@material-ui/icons/Assessment';
import HourglassFullIcon from '@material-ui/icons/HourglassFull';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',

        margin: 'auto',
        justifyContent: 'space-around'
    },
    details: {
        display: 'flex',


    },
    content: {
        flex: '1 0 auto',
    },
    cover: {
        width: 151,
    },
    controls: {
        display: 'flex',
        alignItems: 'center',
        paddingLeft: theme.spacing(1),
        paddingBottom: theme.spacing(1),
    },
    playIcon: {
        height: 38,
        width: 38,
    },
    avatar: {
        color: '#fcfcfe',
        backgroundColor: '#bdbdbd',
        marginTop: '20px',
        padding: '10px'
    }
}));

export default function CardComponent(props) {
    const { title, count, name } = props
    const classes = useStyles();

    const Icon = () => {
        if (name === 'users'){
            return <PeopleAltIcon className={classes.icon} />
        }
        else if (name === 'lessons'){
            return <ImportContactsIcon className={classes.icon} />
        }
        else if (name === 'reports'){
            return <AssessmentIcon className={classes.icon} />
        }
        else {
            return <HourglassFullIcon className={classes.icon} />
        }
    }


    return (
        <Card className={classes.root}>
            <div className={classes.details}>
                <CardContent className={classes.content}>
                    <Typography component="h5" variant="h5">
                        {title}
                    </Typography>
                    <Typography variant="h4" color="textSecondary">
                        {count}
                    </Typography>
                </CardContent>

            </div>
            <Avatar className={classes.avatar}>
                {Icon()}
                
            </Avatar>
        </Card>
    );
}
