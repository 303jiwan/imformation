기본 개념 설명 부족함. 
1. 컴파일러 설치 필요 -->

상태: WSL 미설치, Docker 미설치. 처음부터 진행.

  단계 1: WSL2 설치 (관리자 권한 필요 — 직접 실행)

  PowerShell 관리자로 열어 실행:
  wsl --install
  설치 끝나면 재부팅 필요. 재부팅 후 Ubuntu 창 자동으로 뜸 — 사용자명/비밀번호 입력 (아무거나 OK, 채점기 동작과 무관).

  단계 2: Docker Desktop 설치

  옵션 A — winget (관리자 PowerShell):
  winget install -e --id Docker.DockerDesktop

  옵션 B — 수동: https://www.docker.com/products/docker-desktop/ → "Download for Windows" → installer 실행.

  설치 끝나면 Docker Desktop 실행 → 첫 기동 시 WSL2 백엔드 자동 사용 (Settings → General → "Use WSL 2 based engine" 체크 확인). 시스템 트레이 고래 아이콘 안정될 때까지 대기 (1~2분).

  단계 3: 가동 확인 + gcc 이미지 풀

  새 PowerShell 창 (관리자 아님):
  docker info
  docker pull gcc:9
  docker pull 약 1GB, 네트워크 따라 2~10분. 끝나면:
  docker run --rm gcc:9 gcc --version
  gcc (GCC) 9.x.x 출력되면 준비 완료.

  단계 4: 백엔드 설정 변경 + 재시작

  여기는 내가 처리. 3단계까지 완료되면 알려주세요. backend/.env의 GRADER_UNSAFE_NOCONTAINER=1 → 0 변경 + GRADER_MAX_CASES=200ㄴ 오타 수정도 함께 처리.

  단계 5: 검증

  백엔드 재시작 후 로그 확인:
  [grader] Docker 가용 — 이미지: gcc:9
  이 줄 떠야 정상. 안 뜨면 다음 줄에 원인 표시됨.

  ---
  지금 1단계부터 진행해주세요. wsl --install 실행 후 재부팅 완료되면 알려주세요 — 그 시점에 2단계 명령 준비.

✻ Churned for 28s