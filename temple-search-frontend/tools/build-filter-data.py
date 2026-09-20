#!/usr/bin/env python3
"""Generate compact front-end filter options from the government temple XML."""

from __future__ import annotations

import argparse
import json
import re
import xml.etree.ElementTree as ET
from collections import Counter, defaultdict
from pathlib import Path


REGIONS = {
    "北部": ["臺北市", "新北市", "基隆市", "桃園市", "新竹市", "新竹縣", "宜蘭縣"],
    "中部": ["苗栗縣", "臺中市", "彰化縣", "南投縣", "雲林縣"],
    "南部": ["嘉義市", "嘉義縣", "臺南市", "高雄市", "屏東縣"],
    "東部": ["花蓮縣", "臺東縣"],
    "離島": ["澎湖縣", "金門縣", "連江縣"],
}

# 原始地址少數行政區省略了「區」字，統一成正式名稱。
DISTRICT_FIXES = {
    ("桃園市", "平鎮"): "平鎮區",
    ("臺南市", "新市"): "新市區",
    ("臺南市", "左鎮"): "左鎮區",
    ("高雄市", "前鎮"): "前鎮區",
}


def clean_text(value: str | None) -> str:
    return (value or "").strip()


def normalize_place(value: str | None) -> str:
    return clean_text(value).replace("台", "臺")


def extract_district(city: str, address: str) -> str | None:
    normalized_address = normalize_place(address)
    remaining = (
        normalized_address[len(city) :]
        if normalized_address.startswith(city)
        else normalized_address
    )
    match = re.match(r"^(.{1,5}?(?:區|鄉|鎮|市))", remaining)

    if not match:
        return None

    district = match.group(1)
    return DISTRICT_FIXES.get((city, district), district)


def frequency_order(counter: Counter[str]) -> list[str]:
    return [name for name, _ in sorted(counter.items(), key=lambda item: (-item[1], item[0]))]


def build_filter_data(xml_path: Path) -> dict:
    root = ET.parse(xml_path).getroot()
    rows = list(root)

    city_counts: Counter[str] = Counter()
    district_counts: dict[str, Counter[str]] = defaultdict(Counter)
    religion_counts: Counter[str] = Counter()
    deity_counts: Counter[str] = Counter()

    for row in rows:
        city = normalize_place(row.findtext("行政區"))
        religion = clean_text(row.findtext("教別"))
        deity = clean_text(row.findtext("主祀神祇"))
        district = extract_district(city, row.findtext("地址") or "")

        if city:
            city_counts[city] += 1
        if city and district:
            district_counts[city][district] += 1
        if religion:
            religion_counts[religion] += 1
        if deity:
            deity_counts[deity] += 1

    region_output = {}
    for region, cities in REGIONS.items():
        region_output[region] = [city for city in cities if city in city_counts]

    return {
        "source": xml_path.name,
        "recordCount": len(rows),
        "regions": region_output,
        "districtsByCity": {
            city: frequency_order(district_counts[city])
            for city in city_counts
        },
        "religions": frequency_order(religion_counts),
        "deities": frequency_order(deity_counts),
        "counts": {
            "cities": len(city_counts),
            "districts": sum(len(values) for values in district_counts.values()),
            "religions": len(religion_counts),
            "deities": len(deity_counts),
        },
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("xml", type=Path)
    parser.add_argument("output", type=Path)
    args = parser.parse_args()

    data = build_filter_data(args.xml)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    compact_json = json.dumps(data, ensure_ascii=False, separators=(",", ":"))
    output_text = (
        f"window.TEMPLE_FILTER_DATA={compact_json};\n"
        if args.output.suffix.lower() == ".js"
        else compact_json
    )
    args.output.write_text(output_text, encoding="utf-8")

    print(json.dumps(data["counts"], ensure_ascii=False))


if __name__ == "__main__":
    main()
