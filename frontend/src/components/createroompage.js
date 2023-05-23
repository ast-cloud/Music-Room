import React, { useState, Component } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Grid,
  Typography,
  TextField,
  FormHelperText,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  Collapse,
  Alert
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function CreateRoomPage(props) {
  const navigate = useNavigate();

  const defaultProps = {
    votesToSkip: 2,
    guestCanPause: true,
    update: false,
    roomCode: null,
    updateCallback: () => {},
  };

  const [defaultVotes, setdefaultVotes] = useState(props.votesToSkip);
  const [guestCanPause, setguestCanPause] = useState(props.guestCanPause);
  const [votesToSkip, setvotesToSkip] = useState(defaultVotes);
  const [successMsg, setsuccessMsg] = useState("");
  const [errorMsg, seterrorMsg] = useState("");

  const handleVotesChange = (event) => {
    setvotesToSkip(event.target.value);
  };

  const handleGuestCanPauseChange = (event) => {
    setguestCanPause(event.target.value === "true" ? true : false);
  };

  const handleRoomButtonPressed = () => {
    console.log("Inside handleRoomButtonPressed");
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        votes_to_skip: votesToSkip,
        guest_can_pause: guestCanPause,
      }),
    };
    console.log("TEST2");
    fetch("/api/create-room", requestOptions)
      .then((response) => response.json())
      .then((data) => navigate("/room/" + data.code));
  };

  const handleUpdateButtonPressed = () => {
    const requestOptions = {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        votes_to_skip: votesToSkip,
        guest_can_pause: guestCanPause,
        code: props.roomCode,
      }),
    };
    fetch("/api/update-room", requestOptions).then((response) => {
      if (response.ok) {
        setsuccessMsg("Room updated successfully!");
      } else {
        seterrorMsg("Error updating room...");
      }
      props.updateCallback();
    });
  };

  const renderCreateButtons = () => {
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <Button
            color="primary"
            variant="contained"
            onClick={handleRoomButtonPressed}
          >
            Create A Room
          </Button>
        </Grid>
        <Grid item xs={12} align="center">
          <Button color="secondary" variant="contained" to="/" component={Link}>
            Back
          </Button>
        </Grid>
      </Grid>
    );
  };

  const renderUpdateButtons = () => {
    return (
      <Grid item xs={12} align="center">
        <Button
          color="primary"
          variant="contained"
          onClick={handleUpdateButtonPressed}
        >
          Update Room
        </Button>
      </Grid>
    );
  };

  const title = props.update ? "Update Room" : "Create a Room";

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} align="center">
        <Collapse in={errorMsg != "" || successMsg != ""}>
          {successMsg != "" ? (
            <Alert
              severity="success"
              onClose={() => {
                setsuccessMsg("");
              }}
            >
              {successMsg}
            </Alert>
          ) : (
            <Alert
              severity="error"
              onClose={() => {
                seterrorMsg("");
              }}
            >
              {errorMsg}
            </Alert>
          )}
        </Collapse>
      </Grid>
      <Grid item xs={12} align="center">
        <Typography component="h4" variant="h4">
          {title}
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <FormControl component="fieldset">
          <FormHelperText>
            <span align="center">Guest Control of Playback State</span>
          </FormHelperText>
          <RadioGroup
            row
            defaultValue={props.guestCanPause.toString()}
            onChange={handleGuestCanPauseChange}
          >
            <FormControlLabel
              value="true"
              control={<Radio color="primary" />}
              label="Play/Pause"
              labelPlacement="bottom"
            />
            <FormControlLabel
              value="false"
              control={<Radio color="secondary" />}
              label="No Control"
              labelPlacement="bottom"
            />
          </RadioGroup>
        </FormControl>
      </Grid>
      <Grid item xs={12} align="center">
        <FormControl>
          <TextField
            required={true}
            type="number"
            onChange={handleVotesChange}
            defaultValue={votesToSkip}
            inputProps={{
              min: 1,
              style: { textAlign: "center" },
            }}
          />
          <FormHelperText>
            <span align="center">Votes Required To Skip Song</span>
          </FormHelperText>
        </FormControl>
      </Grid>
      {props.update ? renderUpdateButtons() : renderCreateButtons()}
    </Grid>
    //blablabla
    //onChange={handleVotesChange}
    //defaultValue={defaultVotes}
    //blablabla
  );
}

// import React, { Component } from "react";
// import Button from "@mui/material/Button";
// import Grid from "@mui/material/Grid";
// import Typography from "@mui/material/Typography";
// import TextField from "@mui/material/TextField";
// import FormHelperText from "@mui/material/FormHelperText";
// import FormControl from "@mui/material/FormControl";
// import { Link, Navigate, useLocation, useHistory } from "react-router-dom";
// import {hashHistory} from "react-router-dom";
// import Radio from "@mui/material/Radio";
// import RadioGroup from "@mui/material/RadioGroup";
// import FormControlLabel from "@mui/material/FormControlLabel";

// function withRouter (Child) {
//   return function withRouter (props) {
//        const location = useLocation();
//        const history = useHistory();
//        // other relevant props

//        return <Child {...props} history={history} location={location} />;
//  }
// }
// class CreateRoomPage extends Component {
//   default_votes = 2;
//   constructor(props) {
//     super(props);
//     this.state = {
//       guestCanPause: true,
//       votesToSkip: this.defaultVotes,
//     };

//     this.handleRoomButtonPressed = this.handleRoomButtonPressed.bind(this);
//     this.handleVotesChange = this.handleVotesChange.bind(this);
//     this.handleGuestCanPauseChange = this.handleGuestCanPauseChange.bind(this);
//   }

//   handleVotesChange(e) {
//     this.setState({
//       votesToSkip: e.target.value,
//     });
//   }

//   handleGuestCanPauseChange(e) {
//     console.log('Inside handleGuestCanPauseChange, this -=-=- '+this);
//     this.setState({
//       guestCanPause: e.target.value === "true" ? true : false,
//     });
//   }
//   getCookie(name) {
//     var cookieValue = null;
//     if (document.cookie && document.cookie !== "") {
//       var cookies = document.cookie.split(";");
//       for (var i = 0; i < cookies.length; i++) {
//         var cookie = jQuery.trim(cookies[i]);
//         if (cookie.substring(0, name.length + 1) === name + "=") {
//           cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
//           break;
//         }
//       }
//     }
//     return cookieValue;
//   }
//   handleRoomButtonPressed() {
//     console.log('Inside handleRoomButtonPressed, this.props.history -=-=- '+this.props.history);
//     var csrftoken = this.getCookie('csrftoken');
//     const requestOptions = {
//       method: "POST",
//       headers: { "Content-Type": "application/json", 'X-CSRFToken': csrftoken },
//       body: JSON.stringify({
//         votes_to_skip: this.state.votesToSkip,
//         guest_can_pause: this.state.guestCanPause,
//       }),
//     };
//     fetch("/api/create-room", requestOptions)
//       .then((response) => response.json())
//       .then(function(data) {
//         console.log('About to navigate, data -- '+data+'    this.props.history -=-=------ '+this.props.history);
//         return this.props.history.push("/room/" + data.code);
//     }.bind(this));
//   }

//   render() {
//     return (
//       <Grid container spacing={1}>
//         <Grid item xs={12} align="center">
//           <Typography component="h4" variant="h4">
//             Create A Room
//           </Typography>
//         </Grid>
//         <Grid item xs={12} align="center">
//           <FormControl component="fieldset">
//             <FormHelperText>
//               <span align="center">Guest Control of Playback State</span>
//             </FormHelperText>
//             <RadioGroup
//               row
//               defaultValue="true"
//               onChange={this.handleGuestCanPauseChange}
//             >
//               <FormControlLabel
//                 value="true"
//                 control={<Radio color="primary" />}
//                 label="Play/Pause"
//                 labelPlacement="bottom"
//               />
//               <FormControlLabel
//                 value="false"
//                 control={<Radio color="secondary" />}
//                 label="No Control"
//                 labelPlacement="bottom"
//               />
//             </RadioGroup>
//           </FormControl>
//         </Grid>
//         <Grid item xs={12} align="center">
//           <FormControl>
//             <TextField
//               required={true}
//               type="number"
//               onChange={this.handleVotesChange}
//               defaultValue={this.defaultVotes}
//               inputProps={{
//                 min: 1,
//                 style: { textAlign: "center" },
//               }}
//             />
//             <FormHelperText>
//               <span align="center">Votes Required To Skip Song</span>
//             </FormHelperText>
//           </FormControl>
//         </Grid>
//         <Grid item xs={12} align="center">
//           <Button
//             color="primary"
//             variant="contained"
//             onClick={this.handleRoomButtonPressed}
//           >
//             Create A Room
//           </Button>
//         </Grid>
//         <Grid item xs={12} align="center">
//           <Button color="secondary" variant="contained" to="/" component={Link}>
//             Back
//           </Button>
//         </Grid>
//       </Grid>
//     );
//   }
// }

// export default withRouter(CreateRoomPage);
