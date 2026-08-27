const fs = require('fs');
const path = require('path');

const GAME_DIR = 'D:/Project Pribadi/EduplayKids/Anak/game';
let imports = [];
let registryEntries = [];

function toKebabCase(str) {
    return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

const moduls = ['modul1', 'modul2'];
for (const modul of moduls) {
    const modulPath = path.join(GAME_DIR, modul);
    if (!fs.existsSync(modulPath)) continue;

    const levels = fs.readdirSync(modulPath);
    for (const level of levels) {
        const levelPath = path.join(modulPath, level);
        if (fs.statSync(levelPath).isDirectory()) {
            const games = fs.readdirSync(levelPath);
            for (const gameName of games) {
                const gamePath = path.join(levelPath, gameName);
                if (fs.statSync(gamePath).isDirectory() && fs.existsSync(path.join(gamePath, 'Game.jsx'))) {
                    const kebab = toKebabCase(gameName);
                    imports.push(`import Game${gameName} from './${modul}/${level}/${gameName}/Game';`);
                    registryEntries.push(`    '${kebab}': Game${gameName},`);
                }
            }
        }
    }
}

const newIndexContent = `${imports.join('\n')}

// ============================================================
// GAME REGISTRY
// ============================================================

const GAME_REGISTRY = {
${registryEntries.join('\n')}
};

// ============================================================
// GET GAME COMPONENT
// ============================================================

export function getGameComponent(gameType) {
    if (!gameType) return null;
    const normalizedType = String(gameType).trim().toLowerCase();
    console.log('[GAME REGISTRY] requested:', gameType);
    console.log('[GAME REGISTRY] normalized:', normalizedType);
    
    const GameComponent = GAME_REGISTRY[normalizedType];
    
    if (!GameComponent) {
        console.warn('[GAME REGISTRY] Game tidak ditemukan:', normalizedType);
        console.log('[GAME REGISTRY] Available:', Object.keys(GAME_REGISTRY));
        return null;
    }
    return GameComponent;
}

export default GAME_REGISTRY;
`;

fs.writeFileSync(path.join(GAME_DIR, 'index.js'), newIndexContent);
console.log('Updated index.js');
