// 모든 SettingItem에서 docKey 추출 (Node.js 버전)

const fs = require('fs');
const path = require('path');

// SettingItem의 getDocumentKey 로직과 동일
function sanitizeLabel(label) {
    return label
        .replace(/\s+/g, '_')
        .replace(/[^a-zA-Z0-9_가-힣]/g, '');
}

function getDocumentKey(docKey, menu, label) {
    if (docKey) return docKey;
    if (menu) return `${menu}_${sanitizeLabel(label)}`;
    return sanitizeLabel(label);
}

function extractSettingItems(content) {
    const items = [];
    const regex = /<SettingItem[^>]*>[\s\S]*?<\/SettingItem>/g;
    let match;
    
    while ((match = regex.exec(content)) !== null) {
        const itemContent = match[0];
        const docKeyMatch = itemContent.match(/docKey=["']([^"']+)["']/);
        const menuMatch = itemContent.match(/menu=["']([^"']+)["']/);
        const labelMatch = itemContent.match(/label=["']([^"']+)["']/);
        
        if (labelMatch) {
            const docKey = docKeyMatch ? docKeyMatch[1] : null;
            const menu = menuMatch ? menuMatch[1] : null;
            const label = labelMatch[1];
            const documentKey = getDocumentKey(docKey, menu, label);
            items.push({ label, menu, docKey, documentKey, file: match.input });
        }
    }
    
    return items;
}

function walkDir(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory() && !file.includes('node_modules')) {
            walkDir(filePath, fileList);
        } else if (file.endsWith('.jsx')) {
            fileList.push(filePath);
        }
    });
    
    return fileList;
}

// 실행
const srcDir = path.join(__dirname, 'ensm/ensm-main/src/main/resources/static/main/src');
const descriptionsDir = path.join(__dirname, 'ensm/ensm-main/src/main/resources/static/main/descriptions');

const allItems = [];
const jsxFiles = walkDir(srcDir);

jsxFiles.forEach(file => {
    try {
        const content = fs.readFileSync(file, 'utf8');
        const items = extractSettingItems(content);
        allItems.push(...items);
    } catch (err) {
        console.error(`파일 읽기 실패: ${file}`, err.message);
    }
});

// 기존 문서 파일 목록
const existingFiles = fs.readdirSync(descriptionsDir)
    .filter(f => f.endsWith('.md'))
    .map(f => f.replace('.md', ''));

// 고유한 documentKey 추출
const uniqueDocKeys = [...new Set(allItems.map(item => item.documentKey))];

console.log(`총 ${uniqueDocKeys.length} 개의 documentKey 발견\n`);
console.log(`기존 문서 파일: ${existingFiles.length} 개\n`);

// 누락된 문서 찾기
const missing = [];
uniqueDocKeys.forEach(dockey => {
    if (!existingFiles.includes(dockey)) {
        missing.push(dockey);
        console.log(`❌ 누락: ${dockey}.md`);
    }
});

console.log(`\n총 ${missing.length} 개의 문서가 누락되었습니다.`);

// 상세 정보를 JSON으로 저장
const detailedInfo = allItems.map(item => ({
    documentKey: item.documentKey,
    label: item.label,
    menu: item.menu,
    docKey: item.docKey,
    file: path.relative(srcDir, item.file)
}));

fs.writeFileSync('all_dockeys.json', JSON.stringify(detailedInfo, null, 2));
fs.writeFileSync('missing_dockeys.txt', missing.join('\n'));

