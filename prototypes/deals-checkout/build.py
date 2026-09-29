import base64, re, pathlib, mimetypes
root = pathlib.Path(__file__).parent
src = (root / 'src.html').read_text()
def uri(m):
    f = root / 'assets' / m.group(1)
    mime = 'image/svg+xml' if f.suffix == '.svg' else mimetypes.guess_type(f.name)[0]
    return f'data:{mime};base64,' + base64.b64encode(f.read_bytes()).decode()
out = re.sub(r'\{\{([\w.-]+)\}\}', uri, src)
(root / 'deals-checkout.html').write_text(out)
print(len(out), 'bytes')
