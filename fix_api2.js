const fs = require('fs');
let content = fs.readFileSync('D:/Project Pribadi/EduplayKids/Anak/app/page.js', 'utf-8');
content = content.replace(/const GAME_REPO_URL = [^;]+;/g, '');
fs.writeFileSync('D:/Project Pribadi/EduplayKids/Anak/app/page.js', content);
