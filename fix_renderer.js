const fs = require('fs');
const file = 'D:/Project Pribadi/EduplayKids/Anak/components/games/GameRenderer.jsx';
let content = fs.readFileSync(file, 'utf-8');
content = content.replace(/game\.slug;/g, 'game.slug ||\n    game.id;');
fs.writeFileSync(file, content);
console.log('Fixed GameRenderer.jsx');
