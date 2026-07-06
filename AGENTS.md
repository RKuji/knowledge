<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Working rules

- Every implementation performed in this repo must be documented as Markdown files under `docs/spec/`, split into an overview and a detail doc with the same filename:
  - `docs/spec/overview/<name>.md`: 概要設計書（目的・画面構成など、何を実現するかの要点）
  - `docs/spec/detail/<name>.md`: 詳細設計書（データ構造・実装内容・動作確認など）
- Before executing a command or asking for approval to run one, first output the content of that command in Japanese (what it does), then proceed to the execution/approval step.
