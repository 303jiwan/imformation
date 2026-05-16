---
description: prompt.md를 읽어 자세한 plan을 짜고, codex adversarial review/review로 검증한 뒤 코드로 구현한다
---

다음 절차를 정확히 따라줘. **사용자가 단계마다 승인하기 전까지 절대 `prompt.md`를 수정하거나 코드를 작성하지 마.**

## 모델 할당

- **2~5단계 (plan 작성 / codex 리뷰 결과 분석 / 리뷰 반영)** — 메인 Claude(Opus)가 직접 수행.
- **7단계 (실제 코드 구현)** — **Sonnet 서브에이전트에 위임**한다. 메인 Opus는 코드를 직접 쓰지 말 것.
- **8단계 (codex review 검증 결과 해석·보고)** — 다시 메인 Opus.

## 1. 읽기

프로젝트 루트의 `prompt.md`를 Read 툴로 읽어. 비어있거나 공백만 있으면 "prompt.md가 비어있어요. 내용을 작성한 뒤 다시 `/claude_move`를 호출해주세요."라고 한 줄로 알리고 종료.

## 2. plan 작성

읽은 내용을 분석해서 **자세한 implementation plan**을 짜. 단순한 프롬프트 정제가 아니라 진짜 plan이어야 함:

- **목표 (Goal)**: 한두 줄로 무엇을 달성하려는지
- **변경할 파일 (Files)**: 구체 경로와 어떤 변경이 들어가는지
- **단계 (Steps)**: 1, 2, 3… 순서대로 어떤 작업을 어떤 순서로 할지
- **데이터/스키마/API 변경**: 있으면 schema·endpoint·sessionStorage 키 등 명시
- **리스크 / 가정**: 깨질 수 있는 부분, 미해결 가정, 호환성 영향
- **검증 방법**: 빌드·e2e·UI 수동 확인 등 어떻게 끝났음을 알지

원본 입력의 언어/고유명사/파일명은 그대로 보존. 누락된 정보가 있으면 합리적으로 추론하고 `[?]`로 표시.

plan을 fenced code block(```markdown)으로 사용자에게 보여줘.

## 3. adversarial review 결정

`AskUserQuestion`을 호출해서:
- 질문: "이 plan을 codex adversarial review로 검토할까요?"
- 헤더: "AR 검토"
- 옵션:
  1. **"예, adversarial review 돌려줘"** — 4단계로 진행
  2. **"아니오, 그냥 plan대로 진행"** — 6단계로 직행

## 4. adversarial review 실행

"예"를 받았으면:

1. plan을 임시 파일 `.claude/tmp/claude-move-plan.md`에 저장 (디렉토리가 없으면 만들어). 헤더로 "# Implementation Plan (review target)"을 붙이고 plan 본문을 그대로.
2. codex companion을 백그라운드로 실행:
   ```bash
   node "C:/Users/seok/.claude/plugins/cache/openai-codex/codex/1.0.4/scripts/codex-companion.mjs" adversarial-review "Review the implementation plan at .claude/tmp/claude-move-plan.md (treat it as a design proposal, not as code). Challenge the chosen approach, surface hidden tradeoffs, missing edge cases, and risky assumptions. The plan has not been implemented yet."
   ```
   `Bash` 툴의 `run_in_background: true`로 띄워. timeout은 600000ms.
3. 백그라운드 시작 직후 사용자에게 한 줄로 "Codex adversarial review 백그라운드로 시작했어요. 끝나면 결과 보여드릴게요." 라고 알리고, **그 자리에서 더 진행하지 말고 알림을 기다려.**
4. 백그라운드 명령 완료 알림이 오면 결과를 Read해서 사용자에게 fenced code block으로 보여줘 (verbatim, 요약 금지).

## 5. 리뷰 반영 결정

리뷰 결과를 보여준 뒤 `AskUserQuestion` 호출:
- 질문: "이 리뷰를 plan에 반영할까요?"
- 헤더: "리뷰 반영"
- 옵션:
  1. **"예, plan 업데이트해줘"** — 리뷰 지적사항을 plan에 녹여서 다시 fenced code block으로 보여주고, 6단계로
  2. **"아니오, 원래 plan대로"** — 6단계로
  3. **"부분만 반영" — 직접 어떤 부분 반영할지 알려줄게** — 사용자에게 어떤 항목을 반영할지 받고 plan 업데이트 후 6단계로

업데이트한 plan은 `.claude/tmp/claude-move-plan.md`에도 덮어써.

## 6. prompt.md 비우기

- Write 툴로 `prompt.md`를 빈 문자열(`""`)로 덮어써 (파일 자체는 남겨둠).
- 한 줄로 "prompt.md 비웠고 plan대로 구현 시작합니다." 라고 알려.

## 7. 구현 (Sonnet 서브에이전트에 위임)

확정된 plan을 **Sonnet 서브에이전트**에 통째로 넘겨 코드 작성을 위임해. 메인 Opus는 이 단계에서 직접 Edit/Write로 코드를 수정하지 말 것.

`Agent` 툴을 호출:
- `subagent_type`: `"general-purpose"`
- `model`: `"sonnet"`
- `description`: `"claude_move 구현"` (3~5단어)
- `prompt`: **self-contained**로 작성. 다음을 모두 포함:
  1. 확정된 plan 전문 (5단계까지 마무리된 최종본)
  2. 작업 디렉토리: `c:\Users\USER\imformation` (윈도우 환경, PowerShell)
  3. 관련 파일 경로/제약/검증 방법을 plan에서 그대로 발췌
  4. 명시적 지시: "plan을 그대로 구현해라. 필요한 파일은 Read로 읽고 Edit/Write로 변경, 빌드/테스트가 plan에 명시돼 있으면 실행해 검증. 작업이 끝나면 변경한 파일 목록과 수행한 검증 결과를 200자 내로 보고."
  5. 임의로 scope 확장(리팩터링, 추가 기능)하지 말라는 제약
- 백그라운드 실행은 하지 말고(`run_in_background` 미설정), 결과를 받아서 처리.

Sonnet 에이전트가 끝나면:
1. 에이전트 보고를 사용자에게 짧게 요약해 알린다.
2. **에이전트의 보고는 의도일 뿐**이라, 실제 변경된 파일들을 `git status` / Read / Grep으로 검증해 plan과 일치하는지 확인.
3. 명백한 누락/오류가 보이면 같은 Sonnet 에이전트에 `SendMessage`(또는 새 Agent 호출)로 수정 지시. 사소한 불일치만 남았으면 메인 Opus가 직접 Edit로 마무리해도 됨(예외 상황).
4. 검증이 끝나면 8단계로.

## 8. codex review 검증

구현이 끝났으면 codex companion review를 백그라운드로 실행:

```bash
node "C:/Users/seok/.claude/plugins/cache/openai-codex/codex/1.0.4/scripts/codex-companion.mjs" review ""
```

`Bash` 툴의 `run_in_background: true`, timeout 600000ms. 시작 직후 한 줄로 "Codex review 백그라운드로 시작했어요. 끝나면 검증 결과 알려드릴게요." 라고 알리고 **알림을 기다려.**

알림이 오면 결과를 Read해서 사용자에게 보고:
- verdict (ship-ready / needs-attention 등)
- 발견된 이슈 요점
- 권장 후속 조치
- 원본 출력은 fenced code block으로 보여줘 (요약하더라도 원본도 같이)

## 제약

- 단계 사이마다 사용자 응답을 기다려. 2 → 3 → 4 → 5 → 6 → 7 → 8 순서를 건너뛰지 마.
- 사용자가 "아니오"를 고른 단계는 다음으로 넘어가는 게 아니라 명령 자체가 그 분기로 흘러야 함.
- 5단계의 plan 업데이트나 7단계의 구현 도중에 새로운 의사결정이 필요해지면 기존대로 사용자에게 묻고 진행해 (codex 리뷰는 다시 안 돌려도 됨).
- 6단계의 prompt.md 비우기는 plan이 확정된 직후, 구현 시작 직전에만 함. 그 이전에는 절대 prompt.md 건드리지 마.
- 임시 plan 파일 `.claude/tmp/claude-move-plan.md`는 8단계 검증까지 끝난 뒤 정리해도 되고, 다음 호출에서 덮어써도 OK.
- adversarial review / review가 실패(connection closed 등)하면 사용자에게 사실대로 보고하고 그 단계만 건너뛰는 옵션을 제시해.
