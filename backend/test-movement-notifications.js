
const { io } = require("socket.io-client");

const SERVER_URL = "http://localhost:3000";

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function runTest() {
  const userA = io(SERVER_URL);
  const userB = io(SERVER_URL);
  const userC = io(SERVER_URL);

  // Wait until all users connect
  await wait(1000);

  console.log("All users connected");

  // Set positions of User B and User C
  userB.emit("player:move", { x: 150, y: 200 });
  userC.emit("player:move", { x: 250, y: 200 });

  await wait(500);

  let receivedByB = false;
  let receivedByC = false;

  // Check whether User B receives User A's movement
  userB.on("player:moved", (data) => {
    if (data.socketId === userA.id) {
      receivedByB = true;
    }
  });

  // Check whether User C receives User A's movement
  userC.on("player:moved", (data) => {
    if (data.socketId === userA.id) {
      receivedByC = true;
    }
  });

  // Move User A
  userA.emit("player:move", { x: 110, y: 200 });

  await wait(700);

  // Show test results
  if (receivedByB) {
    console.log("PASS: Nearby user received update");
  } else {
    console.log("FAIL: Nearby user did not receive update");
  }

  if (!receivedByC) {
    console.log("PASS: Far user did not receive update");
  } else {
    console.log("FAIL: Far user received update");
  }

  // Send the same position again
  userA.emit("player:move", { x: 110, y: 200 });

  await wait(300);

  console.log("Check server logs for unchanged position");

  // Disconnect all users
  userA.disconnect();
  userB.disconnect();
  userC.disconnect();
}

runTest();
