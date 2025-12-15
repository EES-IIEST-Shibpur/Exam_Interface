# Exam Interface — Core Design Philosophy

## Purpose
This frontend exists only to conduct exams. No profiles, analytics, or exploration.

## Principles
- Minimal visual noise
- Predictable layout (never changes during exam)
- Keyboard-friendly
- Fail-safe (network, refresh, tab switch)
- Time always visible

## 1. High-Level Screen Flow
Exam Entry → Instructions → Exam Interface → Submit Confirmation → Auto Submit

Only one real working screen: the Exam Interface.

## A. Top Bar (Fixed, Always Visible)
Contents
- Exam Name
- Countdown Timer (HH:MM:SS)
- Warning icons (network / tab switch)
- Submit button (disabled until conditions met)

Behavior
- Timer color changes:
  - Normal: neutral
  - < 10 minutes: amber
  - < 2 minutes: red
- Timer is server-synced, not client-only

## B. Main Content Area
Split into two vertical sections

Left: Question Panel (Primary Focus)
- Question number + marks
- Question text (supports math / images)
- Options (radio / checkbox / numeric input)
- Clear Answer button (if allowed)

Rules
- One question at a time
- No scrolling across questions
- Font size optimized for long reading
- Option click area is large (touch-safe)

Right: Question Palette + Navigation

Question Palette
- Grid of question numbers
- Color coded:
  - Not visited
  - Visited
  - Answered
  - Marked for review
  - Answered + Review

Navigation Buttons
- Previous
- Next
- Mark for Review
- Save & Next

Palette remains visible at all times.

## 4. Interaction & State Rules
Question State Machine
- Each question has: `{ visited, answered, markedForReview }`
- Transitions must be explicit: Visiting ≠ answering; Marking ≠ clearing answer
- State updates are immediately persisted.

Autosave Strategy
- Save answer on:
  - Option select
  - Navigation
  - Every N seconds (heartbeat)
- Backend acknowledgement required
- UI shows subtle “Saved” indicator (non-intrusive)

## 5. Timer & Submission Logic
Timer
- Server time authoritative
- Client displays synced countdown
- Drift correction every 30–60 seconds

Submission
- Manual submit → confirmation modal
- Auto submit at 00:00
- Partial answers allowed
- Submission is idempotent (safe to retry)

## 6. Anti-Cheating UX Signals (Frontend Only)
Frontend does not enforce, but signals events:
- Tab switch
- Window blur
- Fullscreen exit
- Refresh attempt
- Copy / right click (optional)

Signals sent silently; UI shows warning only if policy demands.

## 7. Error & Edge-Case Handling
Network Loss
- Banner: “Connection lost, answers are safe”
- Disable navigation if necessary
- Resume automatically

Refresh / Reopen
- Resume from last saved state
- Timer recalculated from server

---

Notes / Next Steps
- Implement `TopBar`, `QuestionPanel`, `QuestionPalette` components.
- Implement server-synced timer service with periodic drift correction.
- Design API for autosave with acknowledgement and idempotent submit endpoint.

