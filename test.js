const fs = require('fs')
const path = require('path');
const admZip = require('adm-zip');
const { getTimestringForZip } = require("./functions/timefunctions");
const env = require('dotenv')

env.config();

process.stdin.resume();

// I've never considered overriding this before lol
process.on('SIGINT', () => {
  console.log('Received SIGINT (Ctrl+C). Performing graceful shutdown...');
  console.log(`DO ALL THE THINGS`)
  console.log(process.pid)
  process.exit(0); 
});