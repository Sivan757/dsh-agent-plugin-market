#!/usr/bin/env bash
# 创建带 bypass-2fa 的 granular token 并写入 ~/.npmrc（token 不打印、不离开本机）
set -euo pipefail

echo "==> 创建 Granular Access Token（会提示输入 npm 密码）..."
OUT=$(npm token create \
  --registry=https://registry.npmjs.org/ \
  --packages dsh-agent-plugins-market \
  --packages-and-scopes-permission read-write \
  --bypass-2fa \
  --token-description "cli publish for dsh-agent-plugins-market" 2>&1)

TOK=$(printf '%s\n' "$OUT" | grep -oE 'npm_[A-Za-z0-9]+' | head -1 || true)
if [ -z "$TOK" ]; then
  echo "!! 未能从输出中解析出 token，输出如下："
  printf '%s\n' "$OUT" | tail -15
  exit 1
fi

python3 - "$TOK" <<'EOF'
import re, pathlib, sys
p = pathlib.Path.home() / '.npmrc'
t = p.read_text()
new_line = '//registry.npmjs.org/:_authToken=' + sys.argv[1]
if re.search(r'(?m)^//registry\.npmjs\.org/:_authToken=', t):
    t = re.sub(r'(?m)^//registry\.npmjs\.org/:_authToken=.*$', new_line, t)
else:
    t = t.rstrip('\n') + '\n' + new_line + '\n'
p.write_text(t)
EOF

echo "==> 完成：~/.npmrc 已写入新 token（长度 $(echo -n "$TOK" | wc -c | tr -d ' ')）"
echo "    验证: npm whoami --registry=https://registry.npmjs.org/"
