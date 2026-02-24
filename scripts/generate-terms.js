#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const SOURCE_FILE = path.join(ROOT_DIR, 'TERMS.md');
const OUTPUT_FILE = path.join(ROOT_DIR, 'constants', 'terms.ts');

try {
  // TERMS.md 읽기
  let markdownContent = fs.readFileSync(SOURCE_FILE, 'utf-8');

  // 첫 번째 # 제목 라인 제거 (헤더에 제목이 있으므로 중복 방지)
  markdownContent = markdownContent.replace(/^#\s+.*\n\n/, '');

  // TypeScript 파일 생성
  const tsContent = `// 이 파일은 자동 생성됩니다. 직접 수정하지 마세요.
// TERMS.md를 수정하면 자동으로 업데이트됩니다.

export const TERMS_TEXT = \`${markdownContent}\`
`;

  // constants 디렉토리가 없으면 생성
  const constantsDir = path.join(ROOT_DIR, 'constants');
  if (!fs.existsSync(constantsDir)) {
    fs.mkdirSync(constantsDir, { recursive: true });
  }

  // 파일 쓰기
  fs.writeFileSync(OUTPUT_FILE, tsContent, 'utf-8');

  console.log('✅ Terms generated successfully!');
} catch (error) {
  console.error('❌ Error generating terms:', error.message);
  process.exit(1);
}
