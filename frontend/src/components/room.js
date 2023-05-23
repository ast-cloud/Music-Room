import React, { Component, useRef } from "react";
import { useSearchParams, useParams, useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Grid,
  Typography,
  ButtonGroup,
} from "@mui/material";
import CreateRoomPage from "./createroompage";
import MusicPlayer from "./musicplayer";

// export default class Room extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       votesToSkip: 2,
//       guestCanPause: false,
//       isHost: false,
//     };
//     //this.roomCode = this.props.match.params.roomCode;
//     const [searchParams, setSearchParams] = useSearchParams();
//     console.log('query param roomCode - '+searchParams.get('roomCode'));
//     this.getRoomDetails();
//   }
//   getRoomDetails() {
//     console.log('Inside Room component getRoomDetails');
//     fetch("/api/get-room" + "?code=" + this.roomCode)
//       .then((response) => response.json())
//       .then((data) => {
//         this.setState({
//           votesToSkip: data.votes_to_skip,
//           guestCanPause: data.guest_can_pause,
//           isHost: data.is_host,
//         });
//       });
//   }

//   render() {
//     console.log('Inside Room component render');
//     return (
//       <div>
//         <h3>{this.roomCode}</h3>
//         <p>Votes: {this.state.votesToSkip}</p>
//         <p>Guest Can Pause: {this.state.guestCanPause.toString()}</p>
//         <p>Host: {this.state.isHost.toString()}</p>
//       </div>
//     );
//   }
// }

import { useState, useEffect } from "react";

function Room(props) {
  const navigate = useNavigate();

  const { roomId } = useParams();
  const [roomCode, setRoomCode] = useState(roomId);
  const initialState = {
    votesToSkip: 2,
    guestCanPause: false,
    isHost: false,
    showSettings: false,
    spotifyAuthenticated: false,
    song: {}
  };
  const [roomData, setRoomData] = useState(initialState);

  useEffect(function () {
    console.log(
      "Inside useEffect [], JSON.stringify(roomData) - " +
        JSON.stringify(roomData)
    );
    getRoomDetails();
    const interval = setInterval(getCurrentSong, 1000);
    return () => {
      // componentwillunmount in functional component.
      // Anything in here is fired on component unmount.
      clearInterval(this.interval);
    }
  }, []);

  const isMounted = useRef(false);

  useEffect(
    function () {

      if (isMounted.current) {
        console.log("Inside useEffect [roomData, setRoomData], JSON.stringify(roomData) - " +JSON.stringify(roomData));
        if (roomData.isHost) {
          console.log("Going to call authenticateSpotify()")
          authenticateSpotify();
        }
        getCurrentSong();
      }
      else{
        isMounted.current=true;
      }
      
    },[roomData.isHost]);

  const leaveButtonPressed = () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    };
    fetch("/api/leave-room", requestOptions).then((_response) => {
      props.leaveRoomCallback();
      navigate("/");
    });
  };

  const updateShowSettings = (value) => {
    setRoomData({
      ...roomData,
      showSettings: value,
    });
  };

  const renderSettingsButton = () => {
    return (
      <Grid item xs={12} align="center">
        <Button
          variant="contained"
          color="primary"
          onClick={() => updateShowSettings(true)}
        >
          Settings
        </Button>
      </Grid>
    );
  };

  const getRoomDetails = () => {
    fetch("/api/get-room" + "?code=" + roomCode)
      .then((response) => {
        if (!response.ok) {
          props.leaveRoomCallback();
          navigate("/");
        }
        return response.json();
      })
      .then((data) => {
        setRoomData({
          ...roomData,
          votesToSkip: data.votes_to_skip,
          guestCanPause: data.guest_can_pause,
          isHost: data.is_host,
        });
        console.log("Inside getRoomDetails, data.is_host - " +data.is_host +", JSON.stringify(roomData) - " +JSON.stringify(roomData)
        );
      });
  };

  const getCurrentSong = () => {
    fetch("/spotify/current-song")
      .then((response) => {
        if (!response.ok) {
          return {};
        } 
        return response.json();
      })
      .then((data) => {
        setRoomData({
          ...roomData,
          song: data
        });
        console.log('Inside getCurrentSong, current song data - '+JSON.stringify(data));
      });
  }

  const renderSettings = () => {
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <CreateRoomPage
            update={true}
            votesToSkip={roomData.votesToSkip}
            guestCanPause={roomData.guestCanPause}
            roomCode={roomCode}
            updateCallback={getRoomDetails}
          />
        </Grid>
        <Grid item xs={12} align="center">
          <Button
            variant="contained"
            color="secondary"
            onClick={() => updateShowSettings(false)}
          >
            Close
          </Button>
        </Grid>
      </Grid>
    );
  };

  const authenticateSpotify = () => {
    fetch("/spotify/is-authenticated")
      .then((response) => response.json())
      .then((data) => {
        setRoomData({ ...roomData, spotifyAuthenticated: data.status });
        console.log("Inside authenticateSpotify, data.status - "+data.status);
        if (!data.status) {
          fetch("/spotify/get-auth-url")
            .then((response) => response.json())
            .then((data) => {
              window.location.replace(data.url);
            });
        }
      });
  };

  if (roomData.showSettings) {
    return renderSettings();
  }

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} align="center">
        <Typography variant="h4" component="h4">
          Code: {roomCode}
        </Typography>
      </Grid>
      <MusicPlayer {...roomData.song} />
      {roomData.isHost ? renderSettingsButton() : null}
      <Grid item xs={12} align="center">
        <Button
          variant="contained"
          color="secondary"
          onClick={leaveButtonPressed}
        >
          Leave Room
        </Button>
      </Grid>
    </Grid>
  );
}

export default Room;
