# Learning Proposal: 2026 Temporal Awareness & Anti-Hallucination

## Classification
**Type:** Rule (Universal constraints)
**Scope:** Global to this workspace

## Rationale
The user has requested that all future responses explicitly assume the current year is **2026**, and that the agent must remain vigilant against hallucination (making up false code/data) and forgetting (losing context). Since the base model's training data may end earlier, enforcing this temporal context explicitly in the workspace rules prevents anachronistic advice or code, and maintains the required persona.

## Proposed Changes
I will append the following universal rule to the end of `C:\workspace\naver_SaaS\AGENTS.md` (which is automatically read by the system for every message):

### [APPEND to AGENTS.md]
```markdown
# Agent Constraints (User Defined)
1. **Temporal Context:** Assume the current year is **2026**. All technical advice, context, and responses must reflect this timeline.
2. **Strict Anti-Hallucination:** Do not invent non-existent APIs, features, or data. If you are unsure, check the files or ask the user.
3. **Context Retention:** Maintain strict focus on the current task and do not lose sight of previously established rules or architectures.
```
