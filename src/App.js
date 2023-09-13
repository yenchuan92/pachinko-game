import { useEffect, useState } from "react";
import "./App.css";
import pinBall from "./pinball.png";

function App() {
  // PARAMETERS to be changed
  const numberOfRows = 15;
  const animationDuration = 4000;
  const maxBallsPerSecond = 1;
  const scores = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

  const layers = [];
  const [score, setScore] = useState(0);
  const [canLaunch, setCanLaunch] = useState(true);

  function generatePath(num) {
    const path = [];
    let prevNum = 1;
    for (let i = 0; i < num; i++) {
      if (Math.random() <= 0.5) {
        path.push(prevNum);
      } else {
        prevNum++;
        path.push(prevNum);
      }
    }
    return path;
  }

  const handleClick = () => {
    // throttling implemented here
    if (canLaunch) {
      setCanLaunch(false);
      setTimeout(() => {
        setCanLaunch(true);
      }, 1000 / maxBallsPerSecond);

      let lastPos = null;
      let lastX = 0;
      // generate the random path
      const ballPath = generatePath(numberOfRows);
      console.log(
        "ball path",
        ballPath,
        "final hole:" + ballPath[numberOfRows - 1]
      );
      // creating a new ball img
      const ballId = Math.random();
      const newBall = document.createElement("img");
      newBall.id = ballId;
      newBall.src = pinBall;
      newBall.alt = "newBall";
      newBall.style.width = "20px";
      document.getElementById("start").appendChild(newBall);

      // set the initial keyframe for the original position
      const newKeyFrames = [
        {
          transform: "translate3d(0px, 0px, 0px)",
        },
      ];
      ballPath.forEach((position, index) => {
        if (lastPos === null) {
          if (position === 1) {
            newKeyFrames.push({
              transform: "translate3d(" + -30 * 1 + "px, 26px, 0px)",
            });
            lastX = -30;
          } else {
            newKeyFrames.push({
              transform: "translate3d(" + 30 * 1 + "px, 26px, 0px)",
            });
            lastX = 30;
          }
        } else if (position === lastPos) {
          lastX -= 30;
          newKeyFrames.push({
            transform:
              "translate3d(" + lastX + "px, " + 26 * (index + 1) + "px, 0px)",
          });
          // this will make the ball move downwards into the score box
          if (index === ballPath.length - 1) {
            newKeyFrames.push({
              transform:
                "translate3d(" + lastX + "px, " + 26 * (index + 2) + "px, 0px)",
            });
          }
        } else {
          lastX += 30;
          newKeyFrames.push({
            transform:
              "translate3d(" + lastX + "px, " + 26 * (index + 1) + "px, 0px)",
          });
          // this will make the ball move downwards into the score box
          if (index === ballPath.length - 1) {
            newKeyFrames.push({
              transform:
                "translate3d(" + lastX + "px, " + 26 * (index + 2) + "px, 0px)",
            });
          }
        }
        lastPos = position;
      });

      newBall.keyframes = newKeyFrames;
      newBall.animProps = {
        duration: animationDuration,
        easing: "ease-out",
        iterations: 1,
      };
      newBall.animate(newBall.keyframes, newBall.animProps).addEventListener(
        "finish",
        function (e) {
          e.preventDefault();
          newBall.remove();
          setScore((prevScore) => {
            return prevScore + ballPath[ballPath.length - 1];
          });
        },
        true
      );
    }
  };

  // creating the rows of pegs
  for (let i = 0; i < numberOfRows; i++) {
    let row = [];
    for (let j = 0; j <= i + 2; j++) {
      row.push("*");
      if (j !== i + 2) {
        row.push(" ");
      }
    }
    layers.push(row);
  }

  // calculating width of last row
  const scoresWidth = (2 * (numberOfRows + 2) - 1) * 30;

  useEffect(() => {
    document.getElementById("scores").style.maxWidth = scoresWidth + "px";
  }, [scoresWidth]);

  return (
    <div className="App-container">
      <div id="start" className="placeholder"></div>
      {layers.map((row, index) => {
        return (
          <div key={index} className="peg-row">
            {row.map((val, idx) => {
              return (
                <div key={idx} className="peg">
                  {val}
                </div>
              );
            })}
          </div>
        );
      })}
      <div className="score-row" id="scores">
        {scores.map((score, index) => {
          return (
            <div key={index} className="peg-score">
              {score}
            </div>
          );
        })}
      </div>
      <button
        className="launchButton"
        onClick={() => {
          handleClick();
        }}
      >
        Launch ball
      </button>
      <div id="score">Total Score: {score}</div>
    </div>
  );
}

export default App;
