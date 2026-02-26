#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const OUTPUT_FILE = path.join(ROOT_DIR, 'LICENSES.md');

// 라이센스 우선순위 (중요한 것부터)
const LICENSE_PRIORITY = {
  'AGPL-3.0-only': 1,
  'AGPL-3.0': 1,
  'GPL-3.0': 2,
  'GPL-2.0': 2,
  'LGPL-3.0': 3,
  'Apache-2.0': 4,
  'Apache 2.0': 4,
  'MPL-2.0': 5,
  'MIT': 6,
  'BSD-3-Clause': 7,
  'BSD-2-Clause': 8,
  'ISC': 9,
};

function getPriority(license) {
  return LICENSE_PRIORITY[license] || 99;
}

function getLicenseDescription(licenseType) {
  const descriptions = {
    'AGPL-3.0-only': '⚠️ 강력한 Copyleft 라이센스입니다. 네트워크를 통한 사용 시에도 소스 코드 공개가 필요합니다.',
    'AGPL-3.0': '⚠️ 강력한 Copyleft 라이센스입니다. 네트워크를 통한 사용 시에도 소스 코드 공개가 필요합니다.',
    'GPL-3.0': '⚠️ Copyleft 라이센스입니다. 수정하거나 배포 시 소스 코드 공개가 필요합니다.',
    'GPL-2.0': '⚠️ Copyleft 라이센스입니다. 수정하거나 배포 시 소스 코드 공개가 필요합니다.',
    'Apache-2.0': '특허권 보호 조항이 있는 허용적 라이센스입니다. 저작권 고지가 필요합니다.',
    'Apache 2.0': '특허권 보호 조항이 있는 허용적 라이센스입니다. 저작권 고지가 필요합니다.',
    'MIT': '매우 허용적인 라이센스입니다. 저작권 표시만 필요합니다.',
    'BSD-3-Clause': '허용적 라이센스입니다. 저작권 고지 및 면책 조항이 필요합니다.',
    'BSD-2-Clause': '허용적 라이센스입니다. 저작권 고지가 필요합니다.',
    'ISC': 'MIT와 유사한 매우 허용적인 라이센스입니다.',
    'MPL-2.0': '약한 Copyleft 라이센스입니다. 수정한 파일만 공개하면 됩니다.',
  };
  return descriptions[licenseType] || '';
}

try {
  console.log('🔍 Collecting license information...');

  // pnpm licenses list 실행
  const licensesJson = execSync('pnpm licenses list --json', {
    cwd: ROOT_DIR,
    encoding: 'utf-8',
    stdio: ['pipe', 'pipe', 'ignore'], // stderr 무시
  });

  const licensesData = JSON.parse(licensesJson);

  // 라이센스별로 패키지 정리
  const groupedLicenses = [];
  let totalPackages = 0;

  for (const [licenseType, packages] of Object.entries(licensesData)) {
    totalPackages += packages.length;
    const packageList = packages.map(pkg => ({
      name: pkg.name,
      version: pkg.versions[0],
      author: pkg.author || 'Unknown',
      homepage: pkg.homepage || '',
    }));

    groupedLicenses.push({
      type: licenseType,
      priority: getPriority(licenseType),
      count: packageList.length,
      packages: packageList,
    });
  }

  // 우선순위 순으로 정렬
  groupedLicenses.sort((a, b) => a.priority - b.priority);

  // Markdown 생성
  let markdown = `# Open Source Licenses

이 프로젝트는 ${totalPackages}개의 오픈소스 라이브러리를 사용하고 있으며, ${groupedLicenses.length}종류의 라이센스가 적용되어 있습니다.

**생성일:** ${new Date().toLocaleDateString('ko-KR')}

---

`;

  // AGPL 경고
  const hasAGPL = groupedLicenses.some(l => l.type.includes('AGPL'));
  if (hasAGPL) {
    markdown += `## ⚠️ 소스 코드 공개

이 프로젝트는 AGPL 라이센스 라이브러리를 사용합니다.

### 관련 소스 코드
- **저장소:** [https://github.com/macjjuni/af-frontend](https://github.com/macjjuni/af-frontend)
- **패치 파일:** [patches/@orrery__core@0.3.0.patch](https://github.com/macjjuni/af-frontend/blob/main/patches/@orrery__core@0.3.0.patch)

AGPL-3.0 라이센스에 따라 위 링크에서 관련 소스 코드를 확인할 수 있습니다.

---

`;
  }

  // 주요 라이센스 섹션
  markdown += `## 📋 라이센스별 패키지 목록

`;

  for (const group of groupedLicenses) {
    const description = getLicenseDescription(group.type);

    markdown += `### ${group.type} (${group.count}개)\n\n`;

    if (description) {
      markdown += `${description}\n\n`;
    }

    markdown += `<details>\n<summary>패키지 목록 보기</summary>\n\n`;

    for (const pkg of group.packages) {
      markdown += `- **${pkg.name}** v${pkg.version}`;
      if (pkg.author && pkg.author !== 'Unknown') {
        markdown += ` · ${pkg.author}`;
      }
      if (pkg.homepage) {
        markdown += ` · [homepage](${pkg.homepage})`;
      }
      markdown += '\n';
    }

    markdown += `\n</details>\n\n`;
  }

  // 푸터
  markdown += `---

## 📝 라이센스 고지

이 앱은 위에 나열된 오픈소스 라이브러리를 사용하고 있으며, 각 라이브러리는 해당 라이센스 조건에 따라 사용됩니다.

모든 오픈소스 기여자분들께 감사드립니다. 🙏

---

*이 파일은 자동으로 생성되었습니다. 직접 수정하지 마세요.*
`;

  // 파일 쓰기
  fs.writeFileSync(OUTPUT_FILE, markdown, 'utf-8');

  console.log('✅ LICENSES.md generated successfully!');
  console.log(`📦 Total packages: ${totalPackages}`);
  console.log(`📜 License types: ${groupedLicenses.length}`);

  // 주요 라이센스 경고
  if (hasAGPL) {
    console.log('⚠️  Warning: AGPL license detected! Source code disclosure is required.');
  }
} catch (error) {
  console.error('❌ Error generating LICENSES.md:', error.message);
  process.exit(1);
}
