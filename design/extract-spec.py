#!/usr/bin/env python3
"""펜슬 export_html → 화면별 명세.

Claude Design 프롬프트의 입력이다. 목적은 **배치를 옮기는 것**이지 픽셀을 옮기는 게
아니다 — 색·간격 토큰은 디자인시스템이 이미 갖고 있다.

단 텍스트 계층만으로는 부족하다. "점 + 한 줄"과 "배경 박스 안의 한 줄"이 같은 텍스트로
나오는데 둘은 다른 물건이다 (실제로 이 차이 때문에 홈 자동기록 줄과 내역 무지출 배너가
어긋났다). 그래서 각 요소의 **배경·라운드·정렬·글자 크기/굵기**를 함께 뽑는다.

사용:
  python3 design/extract-spec.py design/pencil-core.html
"""
import re
import sys
from html.parser import HTMLParser

# 팔레트 역인덱스 — hex 를 토큰 이름으로 되돌린다. 프롬프트에 #EFEAFF 대신
# violetSoft 라고 적어야 디자인시스템 쪽에서 같은 것을 집는다.
TOKEN = {
    '#7C5CFF': 'violet', '#6A4AEE': 'violetFill', '#5947C2': 'violetDeep',
    '#EFEAFF': 'violetSoft', '#00C896': 'mint', '#00785C': 'mintText',
    '#E4F9F1': 'mintSoft', '#FF8A66': 'peach', '#FFEDE6': 'peachSoft',
    '#E5484D': 'red', '#C93A3F': 'redFill', '#FDECEC': 'redSoft',
    '#191F28': 'ink', '#4E5968': 'inkSoft', '#626C77': 'smoke', '#B0B8C1': 'mist',
    '#FFFFFF': 'surface', '#F2F4F6': 'bg', '#EEF1F4': 'surface2', '#E5E8EB': 'hairStrong',
    '#FEE500': 'kakao',
}


def tok(v):
    v = v.strip()
    m = re.match(r'#([0-9a-fA-F]{6})', v)
    if m:
        return TOKEN.get('#' + m.group(1).upper(), '#' + m.group(1).upper())
    return v


def shape(style):
    """요소의 생김새를 한 줄로. 텍스트만으로는 안 보이는 것만 남긴다."""
    s = {}
    for p in style.split(';'):
        if ':' in p:
            k, v = p.split(':', 1)
            s[k.strip()] = v.strip()
    bits = []
    bg = s.get('background-color') or s.get('background')
    if bg and bg not in ('transparent', 'none'):
        bits.append('bg=' + tok(bg))
    r = s.get('border-radius')
    if r and r not in ('0px', '0'):
        bits.append('r=' + r.replace('px', ''))
    if s.get('border') and 'none' not in s['border']:
        bits.append('border')
    w, h = s.get('width'), s.get('height')
    if w and h and w == h and w.endswith('px') and float(w[:-2]) <= 24:
        bits.append('dot' + w[:-2].split('.')[0])
    fs, fw = s.get('font-size'), s.get('font-weight')
    if fs or fw:
        bits.append((fs or '').replace('px', '') + '/' + (fw or ''))
    if s.get('color'):
        bits.append(tok(s['color']))
    if s.get('text-align') == 'center':
        bits.append('center')
    return ' '.join(bits)


class Screens(HTMLParser):
    def __init__(self):
        super().__init__()
        self.depth = 0
        self.stack = []
        self.cur = None
        self.pending = []
        self.out = []

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        name = a.get('data-pencil-name', '')
        if name.startswith('Screen/'):
            self.cur = {'name': name[7:], 'rows': []}
            self.out.append(self.cur)
            self.stack.append(self.depth)
        if self.cur is not None:
            sh = shape(a.get('style', ''))
            self.pending.append((self.depth, sh))
            # 텍스트 없는 순수 도형(점·바·색면)도 남긴다 — 이게 시안의 절반이다
            if sh and ('dot' in sh or 'bg=' in sh):
                self.cur['rows'].append((self.depth - self.stack[-1], None, sh))
        self.depth += 1

    def handle_endtag(self, tag):
        self.depth -= 1
        while self.pending and self.pending[-1][0] >= self.depth:
            self.pending.pop()
        if self.stack and self.depth == self.stack[-1]:
            self.stack.pop()
            self.cur = None

    def handle_data(self, data):
        t = data.strip()
        if t and self.cur is not None:
            sh = self.pending[-1][1] if self.pending else ''
            rows = self.cur['rows']
            # 직전에 도형으로 적은 것이 사실 이 텍스트의 컨테이너면 합친다
            if rows and rows[-1][1] is None and rows[-1][2] == sh:
                rows.pop()
            rows.append((self.depth - self.stack[-1], t, sh))


def main(path):
    src = open(path).read()
    p = Screens()
    p.feed(src[src.find('<body'):])

    for s in p.out:
        if s['name'].endswith('-Dark'):
            continue
        print('\n### ' + s['name'])
        for d, t, sh in s['rows']:
            if t == '9:41':
                continue
            ind = '  ' * min(d, 8)
            if t is None:
                print(ind + '▪ [' + sh + ']')
            elif sh:
                print(ind + t + '  [' + sh + ']')
            else:
                print(ind + t)


if __name__ == '__main__':
    main(sys.argv[1])
