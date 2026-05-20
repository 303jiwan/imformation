-- battle.sql
-- Run this in Supabase Dashboard → SQL Editor (or psql).
-- Safe to re-run (all statements use IF NOT EXISTS / ON CONFLICT DO NOTHING).
-- No ALTER on users needed: wallet balance already lives in user_wallet.balance.

-- ---------------------------------------------------------------------------
-- 1. 매칭 대기 큐
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS battle_queue (
  user_id    BIGINT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  joined_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- 2. 배틀 문제 풀
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS battle_problems (
  id              SERIAL PRIMARY KEY,
  title           TEXT NOT NULL,
  description     TEXT NOT NULL,
  input_desc      TEXT,
  output_desc     TEXT,
  constraints     JSONB NOT NULL DEFAULT '[]'::JSONB,
  examples        JSONB NOT NULL DEFAULT '[]'::JSONB,
  testcases       JSONB NOT NULL DEFAULT '[]'::JSONB,
  starter_code    TEXT NOT NULL DEFAULT '',
  time_limit_ms   INT  NOT NULL DEFAULT 1000,
  memory_kb       INT  NOT NULL DEFAULT 65536
);

-- ---------------------------------------------------------------------------
-- 3. 배틀 매치
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS battle_matches (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  started_at       TIMESTAMPTZ NOT NULL,
  last_activity_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  problem_ids      INT[]       NOT NULL,
  state            TEXT        NOT NULL DEFAULT 'in_progress',
  winner_user_id   BIGINT      REFERENCES users(id),
  ended_at         TIMESTAMPTZ
);

-- ---------------------------------------------------------------------------
-- 4. 매치 참가자
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS battle_match_players (
  match_id            UUID   REFERENCES battle_matches(id) ON DELETE CASCADE,
  user_id             BIGINT REFERENCES users(id) ON DELETE CASCADE,
  score               INT    NOT NULL DEFAULT 0,
  current_problem_idx INT    NOT NULL DEFAULT 0,
  PRIMARY KEY (match_id, user_id)
);

-- ---------------------------------------------------------------------------
-- 5. 방 (초대 코드 방식)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS battle_rooms (
  id           UUID   PRIMARY KEY DEFAULT gen_random_uuid(),
  code         TEXT   UNIQUE NOT NULL,
  host_user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  state        TEXT   NOT NULL DEFAULT 'waiting',
  match_id     UUID   REFERENCES battle_matches(id)
);

-- ---------------------------------------------------------------------------
-- 시드 문제 5개 (test-problems.js 에서 이식)
-- ON CONFLICT DO NOTHING — 재실행 안전
-- ---------------------------------------------------------------------------

-- 문제 1: 두 수의 합 (A + (A+1))
INSERT INTO battle_problems
  (title, description, input_desc, output_desc, constraints, examples, testcases, starter_code)
VALUES (
  '두 수의 합',
  '정수 A가 입력으로 주어집니다. A와 A+1의 합을 한 줄에 출력하는 프로그램을 작성하세요.',
  '첫 줄에 정수 A가 주어집니다.',
  '첫 줄에 A + (A + 1)의 값을 출력합니다.',
  '["1 ≤ A ≤ 10"]'::JSONB,
  '[{"input":"3","output":"7"},{"input":"5","output":"11"}]'::JSONB,
  '[{"input":"1\n","expected":"3\n"},{"input":"3\n","expected":"7\n"},{"input":"5\n","expected":"11\n"},{"input":"7\n","expected":"15\n"},{"input":"10\n","expected":"21\n"}]'::JSONB,
  '#include <stdio.h>

int main(void) {
    int A;
    scanf("%d", &A);

    // TODO: A와 A+1의 합을 출력하세요

    return 0;
}
'
) ON CONFLICT DO NOTHING;

-- 문제 2: 짝수 / 홀수 판정
INSERT INTO battle_problems
  (title, description, input_desc, output_desc, constraints, examples, testcases, starter_code)
VALUES (
  '짝수 / 홀수 판정',
  '양의 정수 A가 주어집니다. A가 짝수면 even, 홀수면 odd를 출력하세요.',
  '첫 줄에 정수 A가 주어집니다.',
  'A가 짝수면 even, 홀수면 odd를 출력합니다.',
  '["1 ≤ A ≤ 20"]'::JSONB,
  '[{"input":"4","output":"even"},{"input":"7","output":"odd"}]'::JSONB,
  '[{"input":"2\n","expected":"even\n"},{"input":"3\n","expected":"odd\n"},{"input":"4\n","expected":"even\n"},{"input":"7\n","expected":"odd\n"},{"input":"15\n","expected":"odd\n"}]'::JSONB,
  '#include <stdio.h>

int main(void) {
    int A;
    scanf("%d", &A);

    // TODO: 짝수면 even, 홀수면 odd를 출력하세요

    return 0;
}
'
) ON CONFLICT DO NOTHING;

-- 문제 3: 절댓값 출력
INSERT INTO battle_problems
  (title, description, input_desc, output_desc, constraints, examples, testcases, starter_code)
VALUES (
  '절댓값 출력',
  '정수 A가 주어집니다. A의 절댓값을 출력하세요.',
  '첫 줄에 정수 A가 주어집니다.',
  '첫 줄에 A의 절댓값을 출력합니다.',
  '["-100 ≤ A ≤ 100"]'::JSONB,
  '[{"input":"-5","output":"5"},{"input":"3","output":"3"}]'::JSONB,
  '[{"input":"-5\n","expected":"5\n"},{"input":"0\n","expected":"0\n"},{"input":"3\n","expected":"3\n"},{"input":"-100\n","expected":"100\n"},{"input":"7\n","expected":"7\n"}]'::JSONB,
  '#include <stdio.h>

int main(void) {
    int A;
    scanf("%d", &A);

    // TODO: A의 절댓값을 출력하세요

    return 0;
}
'
) ON CONFLICT DO NOTHING;

-- 문제 4: A의 2배 출력
INSERT INTO battle_problems
  (title, description, input_desc, output_desc, constraints, examples, testcases, starter_code)
VALUES (
  'A의 2배 출력',
  '정수 A가 주어집니다. A의 2배를 출력하세요.',
  '첫 줄에 정수 A가 주어집니다.',
  '첫 줄에 A * 2를 출력합니다.',
  '["1 ≤ A ≤ 100"]'::JSONB,
  '[{"input":"5","output":"10"},{"input":"7","output":"14"}]'::JSONB,
  '[{"input":"1\n","expected":"2\n"},{"input":"5\n","expected":"10\n"},{"input":"7\n","expected":"14\n"},{"input":"10\n","expected":"20\n"},{"input":"50\n","expected":"100\n"}]'::JSONB,
  '#include <stdio.h>

int main(void) {
    int A;
    scanf("%d", &A);

    // TODO: A의 2배를 출력하세요

    return 0;
}
'
) ON CONFLICT DO NOTHING;

-- 문제 5: A부터 1까지 카운트다운
INSERT INTO battle_problems
  (title, description, input_desc, output_desc, constraints, examples, testcases, starter_code)
VALUES (
  'A부터 1까지 카운트다운',
  '양의 정수 A가 주어집니다. A부터 1까지 한 줄에 하나씩 출력하세요.',
  '첫 줄에 정수 A가 주어집니다.',
  'A부터 1까지 각 수를 한 줄에 하나씩 출력합니다.',
  '["1 ≤ A ≤ 10"]'::JSONB,
  '[{"input":"3","output":"3\n2\n1"},{"input":"5","output":"5\n4\n3\n2\n1"}]'::JSONB,
  '[{"input":"1\n","expected":"1\n"},{"input":"3\n","expected":"3\n2\n1\n"},{"input":"5\n","expected":"5\n4\n3\n2\n1\n"},{"input":"7\n","expected":"7\n6\n5\n4\n3\n2\n1\n"},{"input":"10\n","expected":"10\n9\n8\n7\n6\n5\n4\n3\n2\n1\n"}]'::JSONB,
  '#include <stdio.h>

int main(void) {
    int A;
    scanf("%d", &A);

    // TODO: A부터 1까지 한 줄에 하나씩 출력하세요

    return 0;
}
'
) ON CONFLICT DO NOTHING;
