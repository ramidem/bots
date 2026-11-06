#!/usr/bin/env python3
# Commit-message filter for de-claude: reads one commit message on stdin, writes it back without
# lines that name Claude as a co-author, session links, or the generated-with footer.
import re
import sys

DROP = re.compile(
    r"(?i)^\W*(co-authored-by:\s*claude\b.*|claude-session:.*|.*generated with.*claude.*|.*claude\.ai/code.*)$"
)

text = sys.stdin.read()
lines = [line for line in text.split("\n") if not DROP.match(line.strip())]
while lines and lines[-1].strip() == "":
    lines.pop()
sys.stdout.write("\n".join(lines) + "\n")
