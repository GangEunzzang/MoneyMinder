#!/usr/bin/env python3
"""
펜슬 → 프로토타입 브리지.

펜슬이 SSoT 이므로 프로토타입은 **손으로 고치지 않는다.** 펜슬을 바꾸고 이 스크립트를
다시 돌린다. 손으로 만들면 반드시 낡는다 — 기존 prototype.html 이 그렇게 이틀 만에
펜슬과 어긋났다.

입력:  pencil MCP `export_html(format='html-css')` 결과 (외부 폰트 링크 포함)
출력:  외부 의존 0 인 단일 HTML. Artifact 로 바로 올릴 수 있다.

  1. 구글폰트 <link> 제거
  2. Noto Sans KR 4굵기를 **실제 쓰인 글자만** 서브셋해 base64 로 심는다
  3. 화면들을 좌측 목록 + 우측 뷰어 셸로 감싼다

사용:
  python3 design/build-prototype.py <export.html> <out.html>
"""

import base64
import io
import re
import sys
from pathlib import Path

NOTO = Path(__file__).resolve().parents[1] / "mobile/node_modules/@expo-google-fonts/noto-sans-kr"
WEIGHTS = {"500": "500Medium", "600": "600SemiBold", "700": "700Bold", "800": "800ExtraBold"}


def used_chars(html: str) -> str:
    """태그를 걷어낸 실제 표시 문자만. 전체 한글을 실으면 굵기당 2MB 가 넘는다."""
    text = re.sub(r"<[^>]+>", " ", html)
    text = re.sub(r"&[a-zA-Z#0-9]+;", " ", text)
    return "".join(sorted(set(text) - set("\n\r\t")))


def subset(ttf: Path, chars: str) -> bytes:
    from fontTools import subset as fs

    font = fs.load_font(str(ttf), fs.Options(flavor="woff2", desubroutinize=True))
    options = fs.Options(flavor="woff2", desubroutinize=True)
    options.drop_tables += ["GSUB", "GPOS"]
    subsetter = fs.Subsetter(options=options)
    subsetter.populate(text=chars)
    subsetter.subset(font)
    buf = io.BytesIO()
    font.flavor = "woff2"
    font.save(buf)
    return buf.getvalue()


def font_css(chars: str) -> str:
    faces = []
    for weight, folder in WEIGHTS.items():
        ttf = NOTO / folder / f"NotoSansKR_{folder}.ttf"
        if not ttf.exists():
            print(f"  ! 없음 {ttf}", file=sys.stderr)
            continue
        b64 = base64.b64encode(subset(ttf, chars)).decode()
        faces.append(
            "@font-face{font-family:'Noto Sans KR';font-style:normal;"
            f"font-weight:{weight};font-display:block;"
            f"src:url(data:font/woff2;base64,{b64}) format('woff2')}}"
        )
        print(f"  · {weight} {len(b64) // 1024}KB")
    return "".join(faces)


SHELL = """
/* 팔레트는 발명하지 않는다 — 앱 토큰 그대로다 (mobile/src/shared/theme/tokens.ts).
   기기 화면이 주인공이므로 껍데기는 뒤로 물러난다. */
:root{
  --ground:#F2F4F6; --panel:#FFFFFF; --rule:#E5E8EB;
  --ink:#191F28; --muted:#626C77; --accent:#6A4AEE; --on-accent:#FFFFFF;
  --shadow:0 18px 50px #191F2826;
}
@media (prefers-color-scheme:dark){
  :root{ --ground:#17151D; --panel:#1E1C26; --rule:#2F2C3D;
         --ink:#EDECF2; --muted:#9C99AC; --accent:#6A4AEE; --shadow:0 18px 50px #0009; }
}
:root[data-theme="dark"]{ --ground:#17151D; --panel:#1E1C26; --rule:#2F2C3D;
  --ink:#EDECF2; --muted:#9C99AC; --shadow:0 18px 50px #0009; }
:root[data-theme="light"]{ --ground:#F2F4F6; --panel:#FFFFFF; --rule:#E5E8EB;
  --ink:#191F28; --muted:#626C77; --shadow:0 18px 50px #191F2826; }

*{box-sizing:border-box}
body{margin:0;background:var(--ground);color:var(--ink);
  font-family:'Noto Sans KR',system-ui,sans-serif;font-weight:600}
#app{display:grid;grid-template-columns:220px 1fr;height:100vh}

#rail{display:flex;flex-direction:column;gap:2px;overflow-y:auto;padding:18px 12px;
  background:var(--panel);border-right:1px solid var(--rule)}
#rail h1{margin:2px 8px 4px;font-size:15px;font-weight:800;letter-spacing:-.3px}
#rail p{margin:0 8px 14px;font-size:11px;font-weight:600;color:var(--muted)}
#rail button{display:flex;justify-content:space-between;align-items:center;gap:8px;
  padding:8px 10px;border:0;border-radius:8px;background:transparent;color:var(--muted);
  font:700 12px/1.3 inherit;text-align:left;cursor:pointer}
#rail button:hover{background:var(--ground);color:var(--ink)}
#rail button[aria-current="true"]{background:var(--accent);color:var(--on-accent)}
#rail button span{font-size:10px;font-weight:700;opacity:.6;font-variant-numeric:tabular-nums}
#rail button:focus-visible,.tgl:focus-visible{outline:2px solid var(--accent);outline-offset:2px}

#stage{display:grid;place-items:center;overflow:auto;padding:32px}
#frame{border-radius:24px;overflow:hidden;box-shadow:var(--shadow);flex:0 0 auto}
#frame>*{position:relative!important;left:0!important;top:0!important}

#bar{position:fixed;top:14px;right:18px;display:flex;align-items:center;gap:10px}
#bar #now{font-size:11px;font-weight:700;color:var(--muted);font-variant-numeric:tabular-nums}
.tgl{display:flex;padding:3px;gap:3px;border-radius:999px;background:var(--panel);
  border:1px solid var(--rule)}
.tgl button{border:0;border-radius:999px;padding:5px 11px;background:transparent;
  color:var(--muted);font:700 11px/1 inherit;cursor:pointer}
.tgl button[aria-pressed="true"]{background:var(--accent);color:var(--on-accent)}
.tgl button:disabled{opacity:.35;cursor:not-allowed}
@media (prefers-reduced-motion:no-preference){#frame{transition:box-shadow .2s}}
"""

SCRIPT = """
const all=[...document.querySelectorAll('[data-pencil-name^="Screen/"]')];
const byName=n=>all.find(e=>e.dataset.pencilName==='Screen/'+n);
const names=[...new Set(all.map(e=>e.dataset.pencilName.replace('Screen/','').replace(/-Dark$/,'')))];
const screens=names.map(n=>({name:n,light:byName(n),dark:byName(n+'-Dark')}));

const rail=document.getElementById('rail'),frame=document.getElementById('frame'),
      now=document.getElementById('now'),bL=document.getElementById('bL'),bD=document.getElementById('bD');
let idx=0,dark=false;

rail.insertAdjacentHTML('afterbegin',
  '<h1>MoneyMinder</h1><p>펜슬 '+screens.length+'화면 · 다크 '+screens.filter(s=>s.dark).length+'</p>');
screens.forEach((s,i)=>{
  const b=document.createElement('button');
  b.innerHTML=s.name+(s.dark?'<span>L/D</span>':'');
  b.onclick=()=>show(i); rail.appendChild(b);
});

function show(i,keepDark){
  idx=i; const s=screens[i];
  if(!keepDark&&!s.dark) dark=false;
  const el=(dark&&s.dark)?s.dark:s.light;
  frame.replaceChildren(el);
  [...rail.querySelectorAll('button')].forEach((b,j)=>b.setAttribute('aria-current',String(j===i)));
  bD.disabled=!s.dark; bL.setAttribute('aria-pressed',String(!dark)); bD.setAttribute('aria-pressed',String(dark));
  now.textContent=s.name+' · '+(i+1)+'/'+screens.length;
  location.hash=encodeURIComponent(s.name)+(dark?'/dark':'');
}
bL.onclick=()=>{dark=false;show(idx,true)};
bD.onclick=()=>{dark=true;show(idx,true)};

const [wantName,wantMode]=decodeURIComponent(location.hash.slice(1)).split('/');
dark=wantMode==='dark';
show(Math.max(0,screens.findIndex(s=>s.name===wantName)),true);

addEventListener('keydown',e=>{
  if(e.key==='ArrowDown'||e.key==='j')show((idx+1)%screens.length);
  if(e.key==='ArrowUp'||e.key==='k')show((idx-1+screens.length)%screens.length);
  if(e.key==='d'&&screens[idx].dark){dark=!dark;show(idx,true)}
});
"""


def build(src: Path, out: Path) -> None:
    html = src.read_text()

    body = html[html.index("<body>") + 6 : html.rindex("</body>")]
    style = "".join(re.findall(r"<style>(.*?)</style>", html, re.S))

    print("· 폰트 서브셋")
    css = font_css(used_chars(body))

    out.write_text(
        "<!doctype html>\n<html lang=ko><head><meta charset=utf-8>"
        "<meta name=viewport content='width=device-width,initial-scale=1'>"
        "<title>MoneyMinder · 펜슬 프로토타입</title>"
        f"<style>{css}{style}{SHELL}</style></head><body>"
        '<div id=app><nav id=rail></nav><main id=stage><div id=frame></div></main></div>'
        '<div id=bar><span id=now></span><div class=tgl>'
        '<button id=bL type=button>Light</button><button id=bD type=button>Dark</button>'
        '</div></div>'
        f'<template id=src>{body}</template>'
        "<script>document.body.append(document.getElementById('src').content);"
        f"{SCRIPT}</script></body></html>"
    )
    kb = out.stat().st_size // 1024
    print(f"· 완료 {out}  {kb}KB")


if __name__ == "__main__":
    build(Path(sys.argv[1]), Path(sys.argv[2]))
