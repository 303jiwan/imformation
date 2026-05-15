const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

const inject = `        <div class="modal-social" id="modal-social" style="margin-top: 15px; display: flex; flex-direction: column; gap: 8px;">
          <div style="display: flex; align-items: center; text-align: center; color: #888; font-size: 12px; margin: 10px 0;">
            <div style="flex: 1; height: 1px; background: #333;"></div>
            <span style="padding: 0 10px;">또는</span>
            <div style="flex: 1; height: 1px; background: #333;"></div>
          </div>
          <button type="button" class="ghost" style="border: 1px solid #444; color: #fff;" onclick="alert('구글 로그인 연동은 준비중입니다.')">
            Google 계정으로 계속하기
          </button>
          <button type="button" class="ghost" style="border: 1px solid #03c75a; background: #03c75a; color: #fff;" onclick="alert('네이버 로그인 연동은 준비중입니다.')">
            Naver 계정으로 계속하기
          </button>
        </div>
`;

for (let file of files) {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('modal-social')) continue; // already injected
  content = content.replace('        <div class="modal-actions">', inject + '        <div class="modal-actions">');
  fs.writeFileSync(file, content);
  console.log('Updated', file);
}
