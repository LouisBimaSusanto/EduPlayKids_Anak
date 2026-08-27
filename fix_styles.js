const fs = require('fs');
const path = require('path');

const GAME_DIR = 'D:/Project Pribadi/EduplayKids/Anak/game';

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if (file.endsWith('.jsx') || file.endsWith('.js')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk(GAME_DIR);

for (const file of files) {
    let content = fs.readFileSync(file, 'utf-8');
    let changed = false;

    // Fix bg-linear-to -> bg-gradient-to
    if (content.includes('bg-linear-to-')) {
        content = content.replace(/bg-linear-to-/g, 'bg-gradient-to-');
        changed = true;
    }

    // Fix extreme text sizes: text-[16rem] -> text-8xl md:text-[14rem] etc (basic heuristic)
    const textSizeRegex = /text-\[(1[0-9])rem\]/g;
    if (textSizeRegex.test(content)) {
        content = content.replace(textSizeRegex, (match, p1) => {
            const num = parseInt(p1);
            return `text-7xl md:text-[${num}rem]`;
        });
        changed = true;
    }

    const largeTextSizeRegex = /text-\[([789])rem\]/g;
    if (largeTextSizeRegex.test(content)) {
        content = content.replace(largeTextSizeRegex, (match, p1) => {
            const num = parseInt(p1);
            return `text-6xl md:text-[${num}rem]`;
        });
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(file, content);
        console.log('Fixed styles in', path.basename(file));
    }
}
console.log('Style fixes complete.');
