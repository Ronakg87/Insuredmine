const os = require('os');
const { exec } = require('child_process');
let isRestarting = false;
// Check CPU utilization every second
setInterval(() => {
    const cpuUsage = getCpuUsage(); // Assume you have this function.
    if (cpuUsage > 70 && !isRestarting) {
        isRestarting = true;
        restartServer();
    }
}, 10000); 

// Function to calculate CPU utilization
function getCpuUsage() {
    const cpus = os.cpus();

    let totalIdle = 0;
    let totalTick = 0;

    cpus.forEach((cpu) => {
        for (let type in cpu.times) {
            totalTick += cpu.times[type];
        }
        totalIdle += cpu.times.idle;
    });

    const idle = totalIdle / cpus.length;
    const total = totalTick / cpus.length;

    return (100 * (1 - idle / total));
}

// Function to restart the server
function restartServer() {
    // Assuming the app is running via PM2
    exec('pm2 restart all', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error restarting server: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });
}
