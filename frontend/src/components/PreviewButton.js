import React, { Component } from 'react';
import { showNotification,Button } from 'react-admin';

import { withStyles } from '@material-ui/core/styles';
import 'react-html5video/dist/styles.css';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import Backdrop from '@material-ui/core/Backdrop';
import { useSpring, animated } from 'react-spring';
import "video-react/dist/video-react.css";
import { Player } from 'video-react';


const styles = theme => ({
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      width:'80%',
      boxShadow: theme.shadows[5]
    },
  });

const Fade = React.forwardRef(function Fade(props, ref) {
    const { in: open, children, onEnter, onExited, ...other } = props;
    const style = useSpring({
      from: { opacity: 0 },
      to: { opacity: open ? 1 : 0 },
      onStart: () => {
        if (open && onEnter) {
          onEnter();
        }
      },
      onRest: () => {
        if (!open && onExited) {
          onExited();
        }
      },
    });
  
    return (
      <animated.div ref={ref} style={style} {...other}>
        {children}
      </animated.div>
    );
  });
class PreviewButton extends Component {
    constructor(props) {
        super(props);
        this.state = { open:false, id:0, setOpen:false, isOpen: false };
      }

      componentDidMount() {
        
      }
    
    handleClick = () => {
        const { push, record, showNotification } = this.props;
       
        
    }
     handleOpen = () => {
      const { record } = this.props;

        this.setState({
            open : true
        });
      };
    
      handleClose = () => {
        this.setState({
            open : false
        });     
     };
    
    toggleModal = () => {
        this.setState({
          isOpen: !this.state.isOpen
        });
      }
    
    render() {
        const { classes,record } = this.props;
        return    (
          <div className="App">
            <Button label="Preview" onClick={this.handleOpen} />
            <Modal
            open={this.state.open}
            onClose={this.handleClose}
            className={classes.modal}
            >
              <div className={classes.paper}>
                <Player
                  autoPlay={true}
                  fluid
                  src={`http://localhost:4000/api/${record.path}`}
                />
              </div>
          </Modal>
        </div>)
    }
}
export default withStyles(styles)(PreviewButton);