const fs = require('fs');
const path = require('path');

// 파일 경로 설정
const AI_NOTICE_MD = path.join(__dirname, '..', 'AI_NOTICE.md');
const OUTPUT_FILE = path.join(__dirname, '..', 'constants', 'aiNotice.ts');

try {
  // AI_NOTICE.md 파일 읽기
  const markdownContent = fs.readFileSync(AI_NOTICE_MD, 'utf8');

  // TypeScript 파일 생성
  const tsContent = `// 이 파일은 자동 생성됩니다. 직접 수정하지 마세요.
// AI_NOTICE.md를 수정하면 자동으로 업데이트됩니다.

export const AI_NOTICE_TEXT = \`${markdownContent}\`;
`;

  // constants 폴더가 없으면 생성
  const constantsDir = path.join(__dirname, '..', 'constants');
  if (!fs.existsSync(constantsDir)) {
    fs.mkdirSync(constantsDir, { recursive: true });
  }

  // 파일 쓰기
  fs.writeFileSync(OUTPUT_FILE, tsContent, 'utf8');

  console.log('✅ AI notice generated successfully!');
} catch (error) {
  console.error('❌ Error generating AI notice:', error.message);
  process.exit(1);
}
