#!/usr/bin/env python3
"""
hexis.center blog converter
Markdown draft → blog HTML page + homepage card injection.

Usage:
    python tools/blog-converter.py blog/_drafts/yazi-adi.md
"""

import sys
import os
import re
import html
from datetime import datetime

# ──────────────────────────────────────────────
# CONSTANTS
# ──────────────────────────────────────────────

SITE_URL = "https://hexis.center"
OG_IMAGE = f"{SITE_URL}/assets/og-hexis.png"

MONTH_TR = {
    1: "Ocak", 2: "Şubat", 3: "Mart", 4: "Nisan",
    5: "Mayıs", 6: "Haziran", 7: "Temmuz", 8: "Ağustos",
    9: "Eylül", 10: "Ekim", 11: "Kasım", 12: "Aralık",
}


# ──────────────────────────────────────────────
# FRONT MATTER PARSER
# ──────────────────────────────────────────────

def parse_front_matter(text):
    """Parse YAML front matter between --- delimiters."""
    m = re.match(r"^---\s*\n(.*?)\n---\s*\n", text, re.DOTALL)
    if not m:
        print("HATA: YAML front matter bulunamadı (--- ... --- formatı bekleniyor)")
        sys.exit(1)

    meta = {}
    for line in m.group(1).strip().splitlines():
        if ":" not in line:
            continue
        key, val = line.split(":", 1)
        meta[key.strip()] = val.strip().strip('"').strip("'")

    required = ["title", "description", "date", "category", "slug"]
    missing = [k for k in required if k not in meta]
    if missing:
        print(f"HATA: Eksik front matter alanları: {', '.join(missing)}")
        sys.exit(1)

    body = text[m.end():]
    return meta, body


# ──────────────────────────────────────────────
# TURKISH QA SCAN
# ──────────────────────────────────────────────

def turkish_qa(meta, body):
    """Run Turkish content QA checks. Returns list of warnings."""
    warnings = []
    full_text = meta.get("description", "") + "\n" + body

    # Em dash check
    em_dash_hits = []
    for i, line in enumerate(full_text.splitlines(), 1):
        if " — " in line or " - " in line:
            em_dash_hits.append((i, line.strip()[:80]))

    if em_dash_hits:
        for lineno, excerpt in em_dash_hits:
            warnings.append(f"  Em dash (satır {lineno}): {excerpt}")

    # Italic usage info
    italic_hits = re.findall(r"\*([^*]+)\*", body)
    if italic_hits:
        for term in italic_hits:
            warnings.append(f"  İtalik kullanım: *{term}*")

    return warnings


# ──────────────────────────────────────────────
# MARKDOWN → HTML CONVERTER
# ──────────────────────────────────────────────

def md_to_html(md_text):
    """Convert markdown to HTML matching hexis blog style."""
    lines = md_text.strip().splitlines()
    html_parts = []
    in_list = False
    list_items = []

    def flush_list():
        nonlocal in_list, list_items
        if in_list and list_items:
            items_html = "\n".join(
                f'    <li>{item}</li>' for item in list_items
            )
            html_parts.append(
                f'  <ul style="margin:20px 0 20px 20px;display:flex;flex-direction:column;gap:8px">\n{items_html}\n  </ul>'
            )
            list_items = []
            in_list = False

    for line in lines:
        stripped = line.strip()

        # Skip empty lines
        if not stripped:
            flush_list()
            continue

        # Headings
        h2_match = re.match(r"^##\s+(.+)$", stripped)
        if h2_match:
            flush_list()
            title = inline_format(h2_match.group(1))
            html_parts.append(
                f'  <h2 style="font-family:Georgia,serif;font-size:24px;font-weight:700;'
                f'color:var(--text);margin:48px 0 16px">\n'
                f"    {title}\n"
                f"  </h2>"
            )
            continue

        h3_match = re.match(r"^###\s+(.+)$", stripped)
        if h3_match:
            flush_list()
            title = inline_format(h3_match.group(1))
            html_parts.append(
                f'  <h3 style="font-family:Georgia,serif;font-size:20px;font-weight:700;'
                f'color:var(--text);margin:36px 0 12px">\n'
                f"    {title}\n"
                f"  </h3>"
            )
            continue

        # Blockquote
        bq_match = re.match(r"^>\s+(.+)$", stripped)
        if bq_match:
            flush_list()
            text = inline_format(bq_match.group(1))
            html_parts.append(
                f'  <blockquote style="margin:32px 0;padding:20px 24px;border-left:2px solid var(--brass);'
                f'color:var(--text);font-style:italic;font-family:Georgia,serif;font-size:18px">\n'
                f"    &ldquo;{text}&rdquo;\n"
                f"  </blockquote>"
            )
            continue

        # List item
        li_match = re.match(r"^[-*]\s+(.+)$", stripped)
        if li_match:
            in_list = True
            list_items.append(inline_format(li_match.group(1)))
            continue

        # Paragraph
        flush_list()
        text = inline_format(stripped)
        margin = 'margin-top:16px' if html_parts and not html_parts[-1].strip().startswith('<h') else ''
        style = f' style="{margin}"' if margin else ''
        html_parts.append(f"  <p{style}>{text}</p>")

    flush_list()
    return "\n\n".join(html_parts)


def inline_format(text):
    """Convert inline markdown: **bold**, *italic*, [link](url)."""
    # Bold
    text = re.sub(
        r"\*\*(.+?)\*\*",
        r'<strong style="color:var(--text)">\1</strong>',
        text,
    )
    # Italic
    text = re.sub(r"\*(.+?)\*", r"<em>\1</em>", text)
    # Links
    text = re.sub(
        r"\[(.+?)\]\((.+?)\)",
        r'<a href="\2" style="color:var(--brass);text-decoration:underline">\1</a>',
        text,
    )
    return text


# ──────────────────────────────────────────────
# HTML PAGE GENERATOR
# ──────────────────────────────────────────────

def generate_blog_html(meta, content_html):
    """Generate full blog page HTML from template."""
    title = html.escape(meta["title"])
    desc = html.escape(meta["description"])
    slug = meta["slug"]
    category = html.escape(meta["category"])
    date = datetime.strptime(meta["date"], "%Y-%m-%d")
    month_label = f"{MONTH_TR[date.month]} {date.year}"

    return f"""<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{title} — Hexis</title>
<meta name="description" content="{desc}">
<meta property="og:title" content="{title} — Hexis">
<meta property="og:description" content="{desc}">
<meta property="og:type" content="article">
<meta property="og:url" content="{SITE_URL}/blog/{slug}/">
<meta property="og:image" content="{OG_IMAGE}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{title} — Hexis">
<meta name="twitter:description" content="{desc}">
<meta name="twitter:image" content="{OG_IMAGE}">
<link rel="icon" href="/assets/favicon.ico">
<link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
<style>
/* ─── BRAND TOKENS ───────────────────────────────── */
:root{{
  --charcoal:  #1C1E23;
  --brass:     #B2986C;
  --stone:     #686662;
  --paper:     #F8F7F5;
  --dark-bg:   #16181C;
  --dark-type: #E8E6E2;
  --dark-sub:  #8A8884;

  --bg:        var(--dark-bg);
  --text:      var(--dark-type);
  --text2:     var(--dark-sub);
  --muted:     var(--dark-sub);

  --border:    rgba(232,230,226,0.10);
  --border2:   rgba(232,230,226,0.18);
  --card:      rgba(232,230,226,0.04);
  --card2:     rgba(232,230,226,0.07);
}}

/* ─── RESET ──────────────────────────────────────── */
*{{margin:0;padding:0;box-sizing:border-box}}
html{{scroll-behavior:smooth;font-size:16px}}
body{{
  font-family:Arial,sans-serif;
  -webkit-font-smoothing:antialiased;
  -moz-osx-font-smoothing:grayscale;
  text-rendering:optimizeLegibility;
  background:var(--bg);
  color:var(--text);
  line-height:1.55;
  min-height:100vh;
  overflow-x:hidden;
}}
p{{line-height:1.75;color:var(--text2)}}

/* ─── NAV ────────────────────────────────────────── */
nav{{
  position:sticky;top:0;z-index:100;
  display:flex;align-items:center;justify-content:space-between;
  padding:0 48px;height:60px;
  background:var(--dark-bg);
  border-bottom:1px solid var(--border);
}}
.nav-logo{{
  display:flex;align-items:center;gap:10px;
  text-decoration:none;color:var(--text);
  flex-shrink:0;
}}
.nav-logo img{{
  display:block;
  height:40px;
  width:auto;
}}
@media(max-width:768px){{
  .nav-logo img{{ height:32px; }}
}}
.nav-logo:focus-visible{{
  outline:2px solid rgba(232,230,226,0.5);
  outline-offset:4px;
}}
.nav-links{{display:flex;gap:4px;align-items:center}}
.nav-links a{{
  color:var(--muted);text-decoration:none;font-size:12px;font-weight:400;
  padding:6px 12px;border-radius:2px;transition:color .15s;letter-spacing:.04em;
  font-family:Arial,sans-serif;
}}
.nav-links a:hover{{color:var(--text)}}

/* HAMBURGER */
.hamburger{{
  display:none;flex-direction:column;gap:5px;
  cursor:pointer;background:none;border:none;padding:4px;z-index:200;
}}
.hamburger span{{width:22px;height:1px;background:var(--text2);transition:all .3s}}
.hamburger.open span:nth-child(1){{transform:translateY(6px) rotate(45deg)}}
.hamburger.open span:nth-child(2){{opacity:0}}
.hamburger.open span:nth-child(3){{transform:translateY(-6px) rotate(-45deg)}}
.mobile-menu{{
  display:none;position:fixed;top:60px;left:0;right:0;
  background:var(--dark-bg);
  border-bottom:1px solid var(--border);
  padding:12px 20px 20px;flex-direction:column;gap:0;z-index:99;
}}
.mobile-menu.open{{display:flex}}
.mobile-menu a{{
  color:var(--muted);text-decoration:none;font-size:13px;font-weight:400;
  padding:11px 4px;border-bottom:1px solid var(--border);
  transition:color .15s;font-family:Arial,sans-serif;
}}
.mobile-menu a:last-child{{border-bottom:none}}
.mobile-menu a:hover{{color:var(--text)}}

/* ─── FOOTER ─────────────────────────────────────── */
footer{{
  position:relative;z-index:1;
  border-top:1px solid var(--border);
  padding:20px 48px;
  display:flex;align-items:center;justify-content:space-between;
  gap:16px;flex-wrap:wrap;
}}
.footer-left{{display:flex;align-items:center;gap:10px;flex-wrap:wrap}}
.footer-logo{{display:flex;align-items:center;flex-shrink:0;text-decoration:none;}}
.footer-logo img{{display:block;height:auto;width:auto;max-height:18px;}}
.footer-logo:focus-visible{{outline:2px solid rgba(232,230,226,0.5);outline-offset:4px;}}
.footer-sep{{color:var(--stone);margin:0 4px}}
.footer-txt{{font-size:10px;color:var(--stone);font-family:Arial,sans-serif;letter-spacing:.02em}}
.footer-links{{display:flex;gap:16px;flex-wrap:wrap}}
.footer-links a{{font-size:10px;color:var(--stone);text-decoration:none;transition:color .15s;font-family:Arial,sans-serif;letter-spacing:.04em}}
.footer-links a:hover{{color:var(--text2)}}

/* ─── RESPONSIVE ─────────────────────────────────── */
@media(max-width:860px){{
  nav{{padding:0 20px}}
  .nav-links{{display:none}}
  .hamburger{{display:flex}}
  footer{{flex-direction:column;align-items:flex-start;padding:20px}}
}}
</style>
</head>
<body>

<!-- NAV -->
<nav>
  <a href="/" class="nav-logo">
    <img src="/assets/logo-light.png" alt="Hexis" width="72" height="40">
  </a>
  <div class="nav-links">
    <a href="/metodoloji/">Orient Framework</a>
    <a href="/generator/">Generator</a>
    <a href="/#contact">Contact</a>
  </div>
  <button class="hamburger" id="hamburger" onclick="toggleMenu()" aria-label="Menu">
    <span></span><span></span><span></span>
  </button>
</nav>

<div class="mobile-menu" id="mobileMenu">
  <a href="/metodoloji/" onclick="closeMenu()">Orient Framework</a>
  <a href="/generator/" onclick="closeMenu()">Generator</a>
  <a href="/#contact" onclick="closeMenu()">Contact</a>
</div>

<!-- BREADCRUMB -->
<div style="max-width:720px;margin:40px auto 0;padding:0 24px">
  <a href="/" style="color:var(--stone);font-size:12px;text-decoration:none">&larr; hexis.center</a>
</div>

<!-- ARTICLE HEADER -->
<header style="max-width:720px;margin:40px auto 48px;padding:0 24px">
  <div style="font-size:11px;color:var(--brass);font-family:Arial,sans-serif;letter-spacing:.08em;text-transform:uppercase;margin-bottom:16px">
    {category} &middot; {month_label}
  </div>
  <h1 style="font-family:Georgia,serif;font-size:clamp(28px,4vw,44px);font-weight:700;line-height:1.15;letter-spacing:-.5px;color:var(--text);margin-bottom:20px">
    {title}
  </h1>
  <p style="font-size:16px;line-height:1.7;color:var(--stone);max-width:600px">
    {desc}
  </p>
</header>

<!-- ARTICLE CONTENT -->
<article style="max-width:720px;margin:0 auto 96px;padding:0 24px;font-family:Arial,sans-serif;font-size:16px;line-height:1.8;color:var(--text2)">

{content_html}

</article>

<!-- BACK LINK -->
<div style="max-width:720px;margin:0 auto 96px;padding:0 24px">
  <a href="/" style="font-size:13px;color:var(--stone);text-decoration:none;font-family:Arial,sans-serif">
    &larr; T&uuml;m yaz&#305;lar
  </a>
</div>

<!-- FOOTER -->
<footer>
  <div class="footer-left">
    <a href="/" class="footer-logo"><img src="/assets/logo-light.png" alt="Hexis" width="32" height="18"></a>
    <span class="footer-sep">&middot;</span>
    <span class="footer-txt">&copy; 2026 Hexis &middot; Built by &Ouml;zden Co&#351;kun &middot; Yaln&#305;zca bilgilendirme ama&ccedil;l&#305;d&#305;r; hukuki dan&#305;&#351;manl&#305;k niteli&#287;i ta&#351;&#305;maz.</span>
  </div>
  <div class="footer-links">
    <a href="/metodoloji/">Orient Framework</a>
    <a href="/generator/">Generator</a>
    <a href="/#contact">Contact</a>
    <a href="https://eur-lex.europa.eu/legal-content/TR/TXT/?uri=CELEX:32024R1689" target="_blank" rel="noopener noreferrer">EU AI Act</a>
    <a href="https://www.linkedin.com/in/ozden-coskun-8728a1301" target="_blank" rel="noopener noreferrer">LinkedIn</a>
  </div>
</footer>

<script>
function toggleMenu(){{
  document.getElementById('hamburger').classList.toggle('open');
  document.getElementById('mobileMenu').classList.toggle('open');
}}
function closeMenu(){{
  document.getElementById('hamburger').classList.remove('open');
  document.getElementById('mobileMenu').classList.remove('open');
}}
document.addEventListener('click',function(e){{
  const h=document.getElementById('hamburger');
  const m=document.getElementById('mobileMenu');
  if(m.classList.contains('open')&&!h.contains(e.target)&&!m.contains(e.target)){{
    h.classList.remove('open');m.classList.remove('open');
  }}
}});
</script>
</body>
</html>
"""


# ──────────────────────────────────────────────
# HOMEPAGE CARD INJECTION
# ──────────────────────────────────────────────

def inject_homepage_card(index_path, meta):
    """Add a new thinking-card to the top of the blog grid in index.html."""
    title = html.escape(meta["title"])
    desc = html.escape(meta["description"])
    # Truncate description for card display
    if len(desc) > 160:
        desc = desc[:157] + "..."
    slug = meta["slug"]
    category = html.escape(meta["category"])
    date = datetime.strptime(meta["date"], "%Y-%m-%d")
    month_label = f"{MONTH_TR[date.month]} {date.year}"

    card_html = (
        f'\n      <a href="/blog/{slug}/" class="thinking-card">\n'
        f'        <div class="thinking-card-tag">{category}</div>\n'
        f"        <h3>{title}</h3>\n"
        f"        <p>{desc}</p>\n"
        f'        <div class="thinking-card-footer">\n'
        f"          <span>{month_label}</span>\n"
        f'          <span class="thinking-card-arrow">\u2192</span>\n'
        f"        </div>\n"
        f"      </a>\n"
    )

    with open(index_path, "r", encoding="utf-8") as f:
        content = f.read()

    marker = '<div class="thinking-grid">'
    if marker not in content:
        print("UYARI: thinking-grid bulunamadı, homepage güncellenemedi.")
        return False

    content = content.replace(marker, marker + card_html, 1)

    with open(index_path, "w", encoding="utf-8") as f:
        f.write(content)

    return True


# ──────────────────────────────────────────────
# MAIN
# ──────────────────────────────────────────────

def main():
    if len(sys.argv) < 2:
        print("Kullanım: python tools/blog-converter.py blog/_drafts/yazi-adi.md")
        sys.exit(1)

    draft_path = sys.argv[1]
    if not os.path.isfile(draft_path):
        print(f"HATA: Dosya bulunamadı: {draft_path}")
        sys.exit(1)

    # Find repo root (where index.html lives)
    repo_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    index_path = os.path.join(repo_root, "index.html")
    if not os.path.isfile(index_path):
        print(f"HATA: index.html bulunamadı: {index_path}")
        sys.exit(1)

    # Parse draft
    with open(draft_path, "r", encoding="utf-8") as f:
        raw = f.read()

    meta, body = parse_front_matter(raw)

    # Turkish QA scan
    print("─── Türkçe Kural Taraması ───")
    warnings = turkish_qa(meta, body)
    if warnings:
        for w in warnings:
            print(f"⚠️  {w}")
    else:
        print("✅ Türkçe tarama: sorun yok")
    print()

    # Convert markdown to HTML
    content_html = md_to_html(body)

    # Generate blog page
    page_html = generate_blog_html(meta, content_html)

    # Write output
    slug = meta["slug"]
    out_dir = os.path.join(repo_root, "blog", slug)
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, "index.html")

    with open(out_path, "w", encoding="utf-8") as f:
        f.write(page_html)

    print(f"✅ Dönüştürüldü: blog/{slug}/index.html")

    # Inject homepage card
    if inject_homepage_card(index_path, meta):
        print("✅ Homepage güncellendi: yeni kart eklendi")
    else:
        print("❌ Homepage güncellenemedi")

    # Warnings summary
    if warnings:
        print(f"\n⚠️  Türkçe uyarılar: {len(warnings)} adet")
        for w in warnings:
            print(f"   {w}")

    print(f'\nQA için: grep -n "—\\| - " blog/{slug}/index.html')


if __name__ == "__main__":
    main()
