
import './App.css';
import { useState } from 'react';
import { Button, Alert, Col, Row, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Box from '@material-ui/core/Box';


function App() {

  const [displayTime, setDisplayTime] = useState(25*60);
  const [breakTime , setBreakTime] = useState(5 * 60);
  const [session, setSession] = useState(25*60);
  const [timerOn, setTimerOn] = useState(false);
  const[onBreak, setBreak] = useState(false);
  const[breakAudio, setBreakAudio] = useState(
    new Audio("./Censor Beep Sound Effect.mp3")
  );

  const playBreakSound = () => {
    breakAudio.currentTime = 0;
    breakAudio.play();
  }
  const formatTime = (time) =>{

 
    let minutes = Math.floor(time/60);
    let seconds = time % 60;
    return (
      (minutes < 10 ? "0" + minutes : minutes) + 
      ":" +
      (seconds < 10 ? "0" + seconds : seconds)
    )
  }
  const changeTime = (amount, type) => {
    if(type == "break"){
      if(breakTime <= 60 && amount < 0){
        return;
      }
      setBreakTime((prev) => prev + amount)
    }
    else{
      if(session <= 60 && amount < 0){
        return;
      }
      setSession((prev) => prev + amount)
    if(!timerOn){
      setDisplayTime(session + amount);
    }
    }

  }
   const controlTime = () => {
     let second = 1000;
     let date = new Date().getTime();
     let nextDate = new Date().getTime() + second;
     let onBreakVariable = onBreak;
     if(!timerOn){
      let interval = setInterval(() => {
        date = new Date().getTime();
        if(date > nextDate){
          setDisplayTime(prev => {
            if(prev <= 0 && !onBreakVariable){
              playBreakSound();
              onBreakVariable = true;
              setBreak(true)
              return breakTime;
            }else if (prev <= 0 && onBreakVariable && !onBreakVariable){
              playBreakSound();
              onBreakVariable = false;
              setBreak(false)
              return session;
            }
            return prev - 1;
          });
          nextDate += second;
        }
      }, 30);
      localStorage.clear();
      localStorage.setItem('interval-id', interval)
    }

    if(timerOn){
      clearInterval(localStorage.getItem("interval-id"));
    }
    setTimerOn(!timerOn)
   };
   const resetTime = () => {
     setDisplayTime(25 * 60);
     setBreakTime(5*60);
     setSession(25*60);
   };

  return (
    <div>
      <Container>
        <Col>
        <Row>
        <div>
        <h1>{onBreak ? "break" : "session"}</h1>
        </div>
    
        </Row>

        <Row>

     <Length
        title = {"break"}
        changeTime = {changeTime}
        type = {"break"}
        time = {breakTime}
        formatTime = {formatTime}
        />
        <div className="display" >
          {formatTime(displayTime)}
        </div>
        <Length
        title = {"timer"}
        changeTime = {changeTime}
        type = {"session"}
        time = {session}
        formatTime = {formatTime}
        />
        </Row>
     <Row>
     <Button onClick = {controlTime}>
               {timerOn ? (
                 <h1>pause</h1>
               ):(<h1>play</h1>)}
          </Button>
          <Button onClick={() => {resetTime()}}>
            <h1>reset</h1>
          </Button>

     </Row>
    </Col>
    </Container>
    </div>
             

  );
}

function Length({ title, changeTime, type, time, formatTime }){
    return(
      <div className="heading">
        <h3>{title}</h3>
        <div className="time-sets">
          <Button variant = "secondary"
          onClick = {() => {
            changeTime(-60, type)
          }}
          >
            ↓
          </Button>
          <h3>
               {formatTime(time)}
          </h3>
          <Button onClick = {() => {
            changeTime(60, type)
          }}>
          ↑
          </Button>
        </div>
            
      </div>
    )
}


export default App;