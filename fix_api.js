const fs = require('fs');

function replaceInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf-8');
    content = content.replace(/const GAME_REPO_URL = [^;]+;/g, '');
    content = content.replace(/\$\{GAME_REPO_URL\}\/api/g, '/api');
    content = content.replace(/GAME_REPO_URL \+ '\/api/g, "'/api");
    fs.writeFileSync(filePath, content);
    console.log('Fixed', filePath);
}

replaceInFile('D:/Project Pribadi/EduplayKids/Anak/hooks/useLevelController.js');
replaceInFile('D:/Project Pribadi/EduplayKids/Anak/components/homepage/HomepageMapDunia.jsx');
replaceInFile('D:/Project Pribadi/EduplayKids/Anak/components/homepage/ModuleMapPage.jsx');
