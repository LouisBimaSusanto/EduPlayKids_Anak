const fs = require('fs');

function replaceInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Remove GAME_REPO_URL completely (handling multiline)
    content = content.replace(/const\s+GAME_REPO_URL\s*=\s*[\s\S]*?;/g, '');
    
    // Replace the usages
    content = content.replace(/\$\{GAME_REPO_URL\}\/api/g, '/api');
    content = content.replace(/GAME_REPO_URL\s*\+\s*['"]\/api/g, "'/api");
    
    fs.writeFileSync(filePath, content);
    console.log('Fixed', filePath);
}

replaceInFile('D:/Project Pribadi/EduplayKids/Anak/hooks/useLevelController.js');
replaceInFile('D:/Project Pribadi/EduplayKids/Anak/components/homepage/HomepageMapDunia.jsx');
replaceInFile('D:/Project Pribadi/EduplayKids/Anak/components/homepage/ModuleMapPage.jsx');
