#!/usr/bin/env bash
# Bootstrap das skills globais (~/.agents/skills) — versionado, rode 1x por máquina.
# Regras aprendidas: 1 skill por invocação (batch cancela), sem -g (global não
# suportado pelo CLI), output visível (suprimir o output também cancela).
set -e
cd "$HOME"

npx -y skills add anthropics/skills -s webapp-testing -y
npx -y skills add anthropics/skills -s frontend-design -y
npx -y skills add helderberto/agent-skills -s commit -y
npx -y skills add vercel-labs/agent-skills -s web-design-guidelines -y
npx -y skills add vercel-labs/agent-skills -s vercel-react-best-practices -y
npx -y skills add mattpocock/skills -s code-review -y
npx -y skills add jiatastic/open-python-skills -s error-handling -y
npx -y skills add rmyndharis/antigravity-skills -s nodejs-backend-patterns -y
npx -y skills add supabase/agent-skills -s supabase-postgres-best-practices -y
npx -y skills add https://github.com/wshobson/agents -s python-testing-patterns -y
npx -y skills add https://github.com/wshobson/agents -s e2e-testing-patterns -y
npx -y skills add https://github.com/wshobson/agents -s architecture-patterns -y
npx -y skills add https://github.com/wshobson/agents -s git-advanced-workflows -y
npx -y skills add github/awesome-copilot -s sql-optimization -y
npx -y skills add mongodb/agent-skills -s mongodb-query-optimizer -y
npx -y skills add github/awesome-copilot -s java-springboot -y
npx -y skills add amplicode/spring-skills -s spring-data-jpa -y
npx -y skills add amplicode/spring-skills -s spring-security-configuration -y
npx -y skills add TerminalSkills/skills -s testcontainers -y

# Cópias manuais (sem suporte no CLI) — sparse checkout preserva references/
# (re-runs reutilizam os clones; sem rm para respeitar o damage-control)
[ -d /tmp/sk-ac ] || git clone --filter=blob:none --sparse https://github.com/github/awesome-copilot.git /tmp/sk-ac
git -C /tmp/sk-ac sparse-checkout set skills/security-review
cp -r /tmp/sk-ac/skills/security-review ~/.agents/skills/
[ -d /tmp/sk-ao ] || git clone --filter=blob:none --sparse https://github.com/addyosmani/agent-skills.git /tmp/sk-ao
git -C /tmp/sk-ao sparse-checkout set skills/observability-and-instrumentation
cp -r /tmp/sk-ao/skills/observability-and-instrumentation ~/.agents/skills/

echo "OK — confira com: ls ~/.agents/skills/"
