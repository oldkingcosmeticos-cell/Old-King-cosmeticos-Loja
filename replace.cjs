const fs = require('fs'); 
const file = 'src/App.tsx'; 
let code = fs.readFileSync(file, 'utf8'); 
code = code.replace(/'http:\/\/localhost:3001([^']*)'/g, 'import.meta.env.VITE_API_URL + \'$1\''); 
code = code.replace(/`http:\/\/localhost:3001([^`]*)`/g, '`${import.meta.env.VITE_API_URL}$1`'); 
fs.writeFileSync(file, code);
