import { useState, useEffect } from 'react';
import './App.css';
import { UnControlled as CodeMirror } from 'react-codemirror2'
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/clike/clike';

function App() {
  const [home, setHome] = useState(true);

  const handleSignIn = () => {
    let email = document.getElementsByTagName("input")[0].value;
    let password = document.getElementsByTagName("input")[1].value;

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    };

    fetch('http://localhost:8000/credentials', requestOptions)
      .then(response => response.json())
      .then(data => {
        if (data.status === 'success') {
          setHome(false);
        } else {
          alert("Try again");
        }
      });
  }

  const [startTime, setStartTime] = useState(false);
  const [endTime, setEndTime] = useState(false);

  const handleStartTest = () => {
    setStartTime(true);
    sendEmail("Test", "The test has started");
  }

  const handleEndTest = () => {
    let code = cm1 + "\n\n\n" + cm2;
    setEndTime(true);
    sendEmail("Test", "The test has ended.\n\n" + code);
  }

  const [cm1, setCm1] = useState('//Start coding here');
  const [cm2, setCm2] = useState('//Start coding here');

  const handleEditor1Change = (editor, data, code) => setCm1(code);
  const handleEditor2Change = (editor, data, code) => setCm2(code);

  function sendEmail(subject, message) {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject, message })
    };

    fetch('http://localhost:8000/access', requestOptions)
      .then(response => response.json())
      .then(data => {
        if (data.status === 'success') {
          alert("Email sent");
        } else if (data.status === 'fail') {
          alert("Email failed!");
        }
      });

    let myStorage = window.localStorage;
    myStorage.setItem(new Date().getTime(), message);
  }

  function SignIn() {
    return (
      <div>
        <div><img id="logo" src="logo.png"></img></div>
        <div className="sign-in">
          <div>
            <label>&nbsp;&nbsp;&nbsp;Enter your Email:</label>
            <input id="email" type="text" placeholder="Email" required></input>
          </div>
          <div>
            <label>Enter your Password:</label>
            <input id="password" type="password" placeholder="Password" required></input>
          </div>
          <button onClick={handleSignIn}>Sign In</button>
        </div>
      </div>
    );
  }

  function HomePage() {
    return (
      <div className="home-page">
        <div><img id="logo" src="logo.png"></img></div>
        <h3>Welcome to your Online test Saksham</h3>
        <h2>You have 60 minutes to complete this test.
          This time will start as soon as you hit the button below. The language is set to C++
          automatically and the code editor has dark theme. 
          <br/><b>Note:</b>You only need to write a function that will take appropriate input and returns the required results</h2>

        <button onClick={handleStartTest}>Start the test</button>
      </div>
    );
  }

  function Test() {
    useEffect(() => {
      let timeout = setTimeout(() => handleEndTest(), 3600000);
      return () => clearTimeout(timeout);
    },[]);

    return (
      <div className="test-container">
        <h3>Question 1</h3>
        <p>In Haje village there is a river that was almost dried up. But this year due to heavy rain, the river got over-flown by water.
           This led to a flood in the village. The village has kutcha houses that will be destroyed if the flood hits them and pukka houses
           that can stop the flow of water. The water can hit the adjacent areas in all directions(8 directions). <br/>
           Assume you have a Google Map where the whole area is divided into 1 sq meter in a 2-D plane.
           Each square can either have water or a kutcha house or a pakka house or open space (Water can easily flood the open space). 
           You job is to determine the total property damage to Haje Village. <br/>

           Example: Assume Haje village can be represented by a 3x3 2-d plane and initially the water is at location (0,0) and (0, 3) (marked by W, below).
           The kutcha houses and pakka houses can be seen as K, P respectively and Open space is marked by O
           <br/> [W, O, W] <br/> [P, P, O] <br/> [K, P, K] <br/> Here the total property damage will be 1 as only (3, 3) kutcha house can be destroyed.
        </p>
        <CodeMirror
          value={cm1}
          onChange={handleEditor1Change}
          options={{
            mode: 'text/x-c++src',
            theme: 'material',
            lineNumbers: true,
            indentUnit: 2,
            smartIndent: true,
            tabSize: 2,
            autofocus: true,
            spellcheck: true
          }}
        />
        <h3>Question 2</h3>
        <p>
          Check if a given tree is a Binary Search Tree. Assume the Node structure as
          <br/>Node.val as integer and Node.next as pointer;
        </p>
        <CodeMirror
          value={cm2}
          onChange={handleEditor2Change}
          options={{
            mode: 'text/x-c++src',
            theme: 'material',
            lineNumbers: true,
            indentUnit: 2,
            smartIndent: true,
            tabSize: 2,
            spellcheck: true
          }}
        />
        <button onClick={handleEndTest}>End the test</button>
      </div>
    );
  }

  function ThankYou() {
    return (
      <div className="thank-you">
        <div><img id="logo" src="logo.png"></img></div>
        <h1>Your Test has ended. Thank you!</h1>
      </div>
    )
  }

  if (home) return (<SignIn />)
  else if (!startTime) return (<HomePage />)
  else if (!endTime) return (<Test />)
  else return (<ThankYou />)
}

export default App;
