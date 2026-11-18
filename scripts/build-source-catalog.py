"""Build the public catalog from audited Excel row/image mappings.

The original H/I text remains in the private delivery ledger. Only neutral,
identifiable specification lines are published; marketing and performance
claims need separate evidence review before release.
"""
import csv
import json
import re
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ADMIN = Path(r"D:\Cursor\Grand\huanqiu-admin")
ROWS = ADMIN / "deliverables/jinxinseatcomponents-material-ledger/products-77-rows.csv"
IMAGES = ROOT / ".codex-delivery/product-images/image-manifest.json"
NAMES = ROOT / ".codex-delivery/product-name-translations.json"
DETAILS = ROOT / ".codex-delivery/product-detail-translations.json"
OUT = ROOT / "lib/product-catalog.json"
PUBLIC = ROOT / "public/catalog"

def category(row):
    if row <= 23:
        return "seat-assemblies"
    if row <= 62:
        return "molded-foam"
    return "seat-frames"

def safe_specs(text):
    result = []
    banned = re.compile(r"warrant|guarantee|\b(?:best|universal|safe load|safety|standard|certified|waterproof|durab|resistan|not prone|no need|without|prevent|reliev|shock absor|environment)\b", re.I)
    allowed = re.compile(r"^(?:overall|external|effective|seat|backrest|back|width|length|height|thickness|diameter|hole|mounting|installation|net weight|weight|material|surface material|internal filling|color|colour|shape|structure|foam density|adjustment angle|folding angle|angle|size|dimensions|center distance|centre distance|rod|tube|wire|frame|process|configuration)\b", re.I)
    for line in text.splitlines():
        line = line.strip(" -•\t")
        if ":" not in line:
            continue
        label, value = (part.strip() for part in line.split(":", 1))
        if not value or not allowed.search(label) or banned.search(line):
            continue
        # A sentence after a semicolon can be an unreviewed sales claim.
        value = value.split(";")[0].strip()
        if value:
            result.append({"label": label, "value": value})
    return result

def main():
    with ROWS.open(encoding="utf-8-sig", newline="") as f:
        rows = list(csv.DictReader(f))
    images = {int(x["excel_row"]): x for x in json.loads(IMAGES.read_text(encoding="utf-8"))}
    names = json.loads(NAMES.read_text(encoding="utf-8"))
    details = json.loads(DETAILS.read_text(encoding="utf-8"))
    assert len(rows) == len(images) == len(names) == len(details) == 77
    PUBLIC.mkdir(parents=True, exist_ok=True)
    catalog = []
    for item in rows:
        row = int(item["row"])
        assert row in images and str(row) in names and str(row) in details
        model = item["model"].strip()
        name = names[str(row)]["name_en"].strip()
        if row == 11:
            name = "ATV One-Piece Front Seat Cushion Assembly"
        if row in (8, 9, 10):
            name = name.replace(" Dedicated", "")
        image = images[row]
        assert model == names[str(row)]["model"] == image["model"]
        shutil.copyfile(IMAGES.parent / image["web_image"], PUBLIC / image["web_image"])
        specs = [{"label": "Model", "value": model}]
        specs.extend(safe_specs(details[str(row)]["parameters_en"]))
        catalog.append({
            "id": f"product-row-{row}",
            "slug": f"{re.sub(r'[^a-z0-9]+', '-', name.lower()).strip('-')}-{re.sub(r'[^a-z0-9]+', '-', model.lower()).strip('-')}",
            "categorySlug": category(row),
            "name": {"en": name},
            "summary": {"en": f"{name}, model {model}. Refer to the listed dimensions and configuration; confirm final requirements with our team."},
            "images": [{"src": "/catalog/" + image["web_image"], "width": image["width"], "height": image["height"], "alt": {"en": f"{name}, model {model}"}}],
            "specifications": [{"label": {"en": s["label"]}, "value": {"en": s["value"]}} for s in specs],
            "sourceRow": row,
            "featured": row in (7, 17, 45, 65),
            "sortOrder": row - 4,
        })
    assert len({x["slug"] for x in catalog}) == 77
    assert all(x["specifications"] for x in catalog)
    OUT.write_text(json.dumps(catalog, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"rows": len(catalog), "images": len(list(PUBLIC.glob("*.jpg"))), "with_specs": sum(len(x["specifications"]) > 1 for x in catalog)}))

if __name__ == "__main__":
    main()
