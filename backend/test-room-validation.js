const roomService = require("./src/services/room.service");

let passed = 0;
let failed = 0;

const test = (name, obstacles, width, height, shouldFail = false) => {
    try {
        roomService.validateObstacles(obstacles, width, height);

        if (shouldFail) {
            console.log("FAIL:", name);
            failed++;
        } else {
            console.log("PASS:", name);
            passed++;
        }

    } catch (error) {
        if (shouldFail) {
            console.log("PASS:", name);
            passed++;
        } else {
            console.log("FAIL:", name);
            failed++;
        }
    }
};

const width = 1000;
const height = 800;

// Valid obstacle
test("Valid obstacle",
    [{ x: 100, y: 100, width: 200, height: 100 }],
    width, height
);

// Negative coordinates
test("Negative X",
    [{ x: -10, y: 100, width: 100, height: 100 }],
    width, height, true
);

// Zero width
test("Zero width",
    [{ x: 100, y: 100, width: 0, height: 100 }],
    width, height, true
);

// Crosses room width
test("Exceeds room width",
    [{ x: 900, y: 100, width: 200, height: 100 }],
    width, height, true
);

// Crosses room height
test("Exceeds room height",
    [{ x: 100, y: 750, width: 100, height: 100 }],
    width, height, true
);

// Exactly touches boundary
test("Touches boundary",
    [{ x: 900, y: 100, width: 100, height: 100 }],
    width, height
);

// Empty obstacles
test("Empty obstacles", [], width, height);

// Invalid room dimensions
test("Invalid room dimensions", [], 0, height, true);

// Final result
console.log("\nTotal:", passed + failed);
console.log("Passed:", passed);
console.log("Failed:", failed);
