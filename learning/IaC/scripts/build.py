#!/usr/bin/env python3
"""Write publish copies of the lessons and reference pages, with assets/ inlined.

Local pages link ../assets/*.css and *.js by relative path, so they work when opened from this folder.
A published claude.ai page has no folder next to it, so the publish copy inlines every asset.

Usage:  python3 scripts/build.py --publish OUT_DIR
Write OUT_DIR outside the vault (the device shell cannot delete files in the vault).
If scripts/pages.json exists ({"lessons/0001-....html": "https://claude.ai/..."}), links between pages
are rewritten to those published addresses.
"""
import json, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def inline(html, page_dir):
    def css(m):
        p = os.path.normpath(os.path.join(page_dir, m.group(1)))
        return "<style>\n" + open(p, encoding="utf-8").read() + "\n</style>"
    def js(m):
        p = os.path.normpath(os.path.join(page_dir, m.group(1)))
        return "<script>\n" + open(p, encoding="utf-8").read() + "\n</script>"
    html = re.sub(r'<link rel="stylesheet" href="([^"]+\.css)">', css, html)
    html = re.sub(r'<script src="([^"]+\.js)"></script>', js, html)
    return html

def main():
    if len(sys.argv) != 3 or sys.argv[1] != "--publish":
        print(__doc__); sys.exit(1)
    out = sys.argv[2]
    pages_file = os.path.join(ROOT, "scripts", "pages.json")
    urls = json.load(open(pages_file)) if os.path.exists(pages_file) else {}
    for sub in ("lessons", "reference"):
        for name in sorted(os.listdir(os.path.join(ROOT, sub))):
            if not name.endswith(".html"): continue
            src_dir = os.path.join(ROOT, sub)
            html = inline(open(os.path.join(src_dir, name), encoding="utf-8").read(), src_dir)
            for rel, url in urls.items():
                html = html.replace('href="../' + rel + '"', 'href="' + url + '"')
                html = html.replace('href="' + os.path.basename(rel) + '"', 'href="' + url + '"') if rel.startswith(sub + "/") else html
            os.makedirs(os.path.join(out, sub), exist_ok=True)
            open(os.path.join(out, sub, name), "w", encoding="utf-8").write(html)
            print("wrote", os.path.join(out, sub, name))

if __name__ == "__main__":
    main()
