const fs = require('fs');
const path = require('path');

const OLD_GAMES_DIR = 'D:/Project Pribadi/EduplayKids/games/components/games';
const NEW_GAMES_DIR = 'D:/Project Pribadi/EduplayKids/Anak/game';

// 1. Process Modul 1
const modul1Levels = ['level1', 'level2', 'level3', 'level4', 'level5', 'level6'];

for (const level of modul1Levels) {
    const oldLevelDir = path.join(OLD_GAMES_DIR, 'modul1', level);
    if (!fs.existsSync(oldLevelDir)) continue;

    const newLevelDir = path.join(NEW_GAMES_DIR, 'modul1', level);
    if (!fs.existsSync(newLevelDir)) {
        fs.mkdirSync(newLevelDir, { recursive: true });
    }

    // Copy data.js if exists
    const dataFile = path.join(oldLevelDir, 'data.js');
    if (fs.existsSync(dataFile)) {
        fs.copyFileSync(dataFile, path.join(newLevelDir, 'data.js'));
    }

    const files = fs.readdirSync(oldLevelDir);
    for (const file of files) {
        if (file.startsWith('Game') && file.endsWith('.jsx')) {
            const gameName = file.replace('Game', '').replace('.jsx', '');
            if (gameName === 'BatuLoncatan') continue; // Already exists

            const gameDir = path.join(newLevelDir, gameName);
            if (!fs.existsSync(gameDir)) {
                fs.mkdirSync(gameDir, { recursive: true });
            }

            let content = fs.readFileSync(path.join(oldLevelDir, file), 'utf-8');

            // Transformations
            content = content.replace(/export\s+function\s+Game[a-zA-Z0-9]+\s*\(\s*\{\s*onComplete\s*\}\s*\)/g, 'export default function Game({ game, onComplete, onClose })');
            content = content.replace(/from\s+['"]\.\/data['"]/g, "from '../data'");
            content = content.replace(/onComplete\(\)/g, 'onComplete({ completed: true, score: 100 })');

            fs.writeFileSync(path.join(gameDir, 'Game.jsx'), content);
            console.log(`Migrated ${gameName} to modul1/${level}`);
        }
    }
}

// 2. Process Modul 2
const oldModul2Dir = path.join(OLD_GAMES_DIR, 'modul2');
const modul2Mapping = {
    'JejakWarna': 'level1',
    'AngkaTerbalik': 'level1',
    'Bintangku': 'level2',
    'DetektifGanda': 'level2',
    'DetektorMatriks': 'level3',
    'DokterAngka': 'level3',
    'KodeRahasia': 'level3',
    'KokiAjaib': 'level4',
    'MelodiHutan': 'level4',
    'OrkestraIngatan': 'level4',
    'PetaBajakLaut': 'level4',
    'RotasiBintang': 'level4'
};

if (fs.existsSync(oldModul2Dir)) {
    const files = fs.readdirSync(oldModul2Dir);
    for (const file of files) {
        if (file.startsWith('Game') && file.endsWith('.jsx')) {
            const gameName = file.replace('Game', '').replace('.jsx', '');
            const targetLevel = modul2Mapping[gameName] || 'level1';
            
            const newLevelDir = path.join(NEW_GAMES_DIR, 'modul2', targetLevel);
            const gameDir = path.join(newLevelDir, gameName);
            
            if (!fs.existsSync(gameDir)) {
                fs.mkdirSync(gameDir, { recursive: true });
            }

            let content = fs.readFileSync(path.join(oldModul2Dir, file), 'utf-8');

            content = content.replace(/export\s+function\s+Game[a-zA-Z0-9]+\s*\(\s*\{\s*onComplete(?:,\s*onClose)?\s*\}\s*\)/g, 'export default function Game({ game, onComplete, onClose })');
            content = content.replace(/onComplete\(\)/g, 'onComplete({ completed: true, score: 100 })');

            fs.writeFileSync(path.join(gameDir, 'Game.jsx'), content);
            console.log(`Migrated ${gameName} to modul2/${targetLevel}`);
        }
    }
}

console.log('Migration script finished.');
