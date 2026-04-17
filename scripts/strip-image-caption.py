"""Strip '*** בתמונה' trailing image caption from dira-hilufit body."""
import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

p = r'e:\Claude Code\Challenge\alex-rysin-website\content\posts.ts'
c = open(p, 'r', encoding='utf-8').read()

marker = '\\n\\n*** בתמונה'
print('marker len:', len(marker))
idx = c.find(marker)
print('idx:', idx)
if idx > 0:
    end = c.find('"', idx)
    print('removed:', end - idx, 'chars')
    c = c[:idx] + c[end:]
    open(p, 'w', encoding='utf-8').write(c)
    print('written')