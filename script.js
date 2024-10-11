let hour = 0;
let minute = 0;
let seconds = 0;
let millisecond = 0;
let timer = false;
let lapCounter = 0; // Counter to keep track of lap numbers
let lapRecords = [];
let isRunning = false; // Track if stopwatch is running

// Get the button elements
const startButton = document.getElementById('play');
const refresh = document.getElementById('refresh');
const lapsButton = document.getElementById('laps');
const lapsList = document.getElementById('lapsList');

// Get the time elements
const minutesDisplay = document.getElementById('min');
const secsDisplay = document.getElementById('sec');
const msDisplay = document.getElementById('ms');
const hourDisplay = document.getElementById('hr');
const hourSeparator = document.getElementById('hr-separator');

hourDisplay.classList.add('hidden');
hourSeparator.classList.add('hidden');

// Hide laps initially
document.querySelector('.laps-container').style.display = 'none';

// Function to handle the start/pause button click
startButton.addEventListener('click', function () {
  if (isRunning) {
    timer = false;
    // Pause state
    startButton.innerHTML = '<i class="fa-solid fa-play"></i>'; // Change back to "Start" icon
    console.log('Paused');
    // Change the right button to "Share"
    lapsButton.innerHTML = '<i class="fa-solid fa-share-nodes"></i>'; // New icon for the share button
    refresh.classList.remove('hidden'); // Keep the refresh button visible
    lapsButton.classList.remove('hidden'); // Show the share button
  } else {
    timer = true;
    stopWatch();
    // Start state
    startButton.innerHTML = '<i class="fa-solid fa-pause"></i>'; // Change to "Pause" icon
    console.log('Started');
    // Show the original right button (for laps)
    lapsButton.innerHTML = '<i class="fa-solid fa-flag"></i>'; // Icon for the laps button
    refresh.classList.remove('hidden'); // Show refresh button
    lapsButton.classList.remove('hidden'); // Show laps button
  }
  // Toggle the state
  isRunning = !isRunning;
});

// Event listener for the refresh button to reset to initial state
refresh.addEventListener('click', function () {
  timer = false;
  isRunning = false; // Reset state to not running
  hour = 0;
  minute = 0;
  seconds = 0;
  millisecond = 0;

  updateDisplay();
  lapCounter = 0;
  lapRecords = [];
  lapsList.innerHTML = '';
  document.querySelector('.laps-container').style.display = 'none';

  // Reset to initial state: Only show the "Start" button
  startButton.innerHTML = '<i class="fa-solid fa-play"></i>'; // Set the "Start" icon
  refresh.classList.add('hidden'); // Hide the refresh button
  lapsButton.classList.add('hidden'); // Hide the laps button

  console.log('Reset to Start');
});

// Function to share via Gmail
function shareViaGmail() {
  const lapData = lapRecords.join('\n'); // Combine lap records

  // Construct the mailto URL for Gmail with pre-filled subject and body
  const gmailComposeUrl = `https://mail.google.com/mail/u/0/?view=cm&fs=1&to=&su=Lap%20Records&body=${encodeURIComponent(lapData)}`;

  // Open Gmail compose window with lap records pre-filled
  window.open(gmailComposeUrl, '_blank');
}
function copyLapRecords() {
  const lapData = lapRecords.join('\n'); // Combine lap records
  navigator.clipboard.writeText(lapData)
      .then(() => {
          alert('Lap records copied to clipboard! You can paste them anywhere.');
      })
      .catch(err => {
          console.error('Could not copy text: ', err);
      });
}

// Function to show share options
function showShareOptions() {
// Generate the share URLs dynamically
const whatsappWebShareUrl = `https://web.whatsapp.com/send?text=${encodeURIComponent(lapRecords.join('\n'))}`;


// Create a share options modal
const shareModalContent = `
  <div>
    <h3>Share Lap Records</h3>
    <ul>
      <li><a href="${whatsappWebShareUrl}" target="_blank">Share on WhatsApp</a></li>
      <li><a href="#" onclick="shareViaGmail()">Share via Gmail</a></li>
      <li><a href="#" onclick="copyLapRecords()">Copy to Clipboard</a></li>
    </ul>
    <button id="closeShareModal">Close</button>
  </div>
`;

// Create a modal element
const modal = document.createElement('div');
modal.id = 'shareModal';
modal.className = 'modal'; // Add class for styling if needed
modal.innerHTML = shareModalContent;

// Append the modal to the body
document.body.appendChild(modal);

// Event listener to close the share modal
document.getElementById('closeShareModal').addEventListener('click', function () {
  document.body.removeChild(modal); // Remove modal from the DOM
});
}



// Event listener for the laps/share button
lapsButton.addEventListener('click', function () {
  if (isRunning) {
    // Add lap functionality
    lapCounter++;
    const lapTime = `${minute < 10 ? '0' + minute : minute}:${seconds < 10 ? '0' + seconds : seconds}.${millisecond < 10 ? '0' + millisecond : millisecond}`;
    
    lapRecords.push(`Lap ${lapCounter}: ${lapTime}`);
    
    const lapItem = document.createElement('li');
    const lapCounterSpan = document.createElement('span');
    lapCounterSpan.innerText = `Lap ${lapCounter}`; // Add lap count
    lapCounterSpan.classList.add('lap-counter');

    const lapTimeSpan = document.createElement('span');
    lapTimeSpan.innerText = lapTime; // Add lap time
    lapTimeSpan.classList.add('lap-time');
    
    lapItem.appendChild(lapCounterSpan);
    lapItem.appendChild(lapTimeSpan);
    lapsList.appendChild(lapItem);
    lapsList.scrollTop = lapsList.scrollHeight;

    document.querySelector('.laps-container').style.display = 'block';

    console.log(`Lap ${lapCounter} added: ${lapTime}`); // Action for the laps button
  } else {
    // Show the share options when paused
    showShareOptions();
  }
});

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    console.log('Copied to clipboard');
  }).catch((error) => {
    console.error('Could not copy text: ', error);
  });
}

// Function to update the time display
function updateDisplay() {
  if (hour > 0) {
    hourDisplay.classList.remove('hidden');
    hourSeparator.classList.remove('hidden');
    hourDisplay.innerHTML = hour < 10 ? "0" + hour : hour;
  } else {
    hourDisplay.classList.add('hidden');
    hourSeparator.classList.add('hidden');
  }
  minutesDisplay.innerHTML = (minute < 10 ? "0" + minute : minute) + ':';
  secsDisplay.innerHTML = (seconds < 10 ? "0" + seconds : seconds);
  msDisplay.innerHTML = '.' + (millisecond < 10 ? "0" + millisecond : millisecond);
}

// Function to start the stopwatch
function stopWatch() {
  if (timer) {
    millisecond++;

    if (millisecond === 100) {
      seconds++;
      millisecond = 0;
    }
    if (seconds === 60) {
      minute++;
      seconds = 0;
    }
    if (minute === 60) {
      hour++;
      minute = 0;
      seconds = 0;
    }
    updateDisplay();
    setTimeout(stopWatch, 10);
  }
}
