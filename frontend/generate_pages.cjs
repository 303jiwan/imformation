const fs = require('fs');

const template = fs.readFileSync('survey.html', 'utf8');

function createPage(filename, title, htmlContent) {
  let content = template.replace(/<title>.*<\/title>/, '<title>Codenergy — ' + title + '</title>');
  content = content.replace(/<section class=\"survey-section\">[\s\S]*<\/section>/, htmlContent);
  fs.writeFileSync(filename, content);
  console.log('Created ' + filename);
}

const mypageHtml = `
    <section class="survey-section">
      <div class="survey-header">
        <h1 class="survey-title">마이페이지</h1>
        <p class="survey-subtitle">내 학습 진행도와 프로필을 확인하세요.</p>
      </div>
      <div style="padding: 20px; background: #fff; border-radius: 8px; border: 1px solid #ddd; color: #333;">
        <h2>내 정보</h2>
        <p><strong>이름:</strong> <span id="mypage-name">로딩 중...</span></p>
        <p><strong>이메일:</strong> <span id="mypage-email">로딩 중...</span></p>
        <hr style="margin: 20px 0;">
        <h2>프리미엄 구독</h2>
        <p>현재 무료 베이직 요금제를 사용 중입니다.</p>
        <a href="pricing.html" style="color: #16a34a; font-weight: bold;">프리미엄 업그레이드 알아보기 →</a>
      </div>
    </section>
`;

const historyHtml = `
    <section class="survey-section">
      <div class="survey-header">
        <h1 class="survey-title">학습 기록</h1>
        <p class="survey-subtitle">지금까지 해결한 문제와 테스트 결과를 확인하세요.</p>
      </div>
      <div style="padding: 20px; background: #fff; border-radius: 8px; border: 1px solid #ddd; color: #333;">
        <h2>최근 학습 내역</h2>
        <ul style="list-style: none; padding: 0;">
          <li style="padding: 10px; border-bottom: 1px solid #eee;">
            <strong>코드테스트 결과</strong> - 정답률 80% <span style="color: #888; font-size: 0.9em;">(오늘)</span>
          </li>
          <li style="padding: 10px; border-bottom: 1px solid #eee;">
            <strong>실력 진단</strong> - 70점 <span style="color: #888; font-size: 0.9em;">(어제)</span>
          </li>
          <li style="padding: 10px;">
            <span style="color: #888;">더 많은 기록은 곧 제공됩니다.</span>
          </li>
        </ul>
      </div>
    </section>
`;

const settingsHtml = `
    <section class="survey-section">
      <div class="survey-header">
        <h1 class="survey-title">설정</h1>
        <p class="survey-subtitle">알림 및 계정 환경을 설정하세요.</p>
      </div>
      <div style="padding: 20px; background: #fff; border-radius: 8px; border: 1px solid #ddd; color: #333;">
        <h2>환경 설정</h2>
        <div style="margin-top: 15px;">
          <label style="display: block; margin-bottom: 10px;">
            <input type="checkbox" checked> 이메일 알림 받기
          </label>
          <label style="display: block; margin-bottom: 10px;">
            <input type="checkbox" checked> 마케팅 정보 수신 동의
          </label>
          <button type="button" style="margin-top: 15px; padding: 10px 20px; background: #111; color: #fff; border: none; border-radius: 4px; cursor: pointer;">설정 저장</button>
        </div>
      </div>
    </section>
`;

createPage('mypage.html', '마이페이지', mypageHtml);
createPage('history.html', '학습 기록', historyHtml);
createPage('settings.html', '설정', settingsHtml);
