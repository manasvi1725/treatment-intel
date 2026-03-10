import re


currency_patterns = [

    r"\$\s?\d+(?:,\d+)?",
    r"₹\s?\d+(?:,\d+)?",

    r"\d+(?:,\d+)?\s?usd",
    r"\d+(?:,\d+)?\s?dollars",

    r"\d+(?:,\d+)?\s?rupees",
    r"\d+(?:,\d+)?\s?inr",

    r"\d+(?:,\d+)?\s?lakh",
    r"\d+(?:,\d+)?\s?lakhs",

    r"\d+(?:,\d+)?\s?million"
]


range_patterns = [

    r"(\d+(?:,\d+)?)\s?(?:to|-)\s?(\d+(?:,\d+)?)",
    r"between\s(\d+(?:,\d+)?)\sand\s(\d+(?:,\d+)?)"
]


USD_TO_INR = 83

def normalize_cost(value):

    value = value.lower()

    num = re.sub(r"[^\d]", "", value)

    if not num:
        return None

    num = int(num)

    if "lakh" in value:
        num *= 100000

    if "million" in value:
        num *= 1000000

    # Convert INR → USD
    if "₹" in value or "inr" in value or "rupees" in value:
        num = num / USD_TO_INR

    return int(num)
    
def extract_costs(text):

    values = []

    text = text.lower()

    # Currency values
    for pattern in currency_patterns:

        matches = re.findall(pattern, text)

        for m in matches:

            cost = normalize_cost(m)

            if cost:
                values.append(cost)

    # Range values
    for pattern in range_patterns:

        matches = re.findall(pattern, text)

        for a, b in matches:

            try:
                values.append(int(a.replace(",", "")))
                values.append(int(b.replace(",", "")))
            except:
                pass

    return values


def build_cost_block(corpus):

    costs = []

    for doc in corpus:

        extracted = extract_costs(doc["text"])

        for c in extracted:

            # remove likely year values
            if 1900 <= c <= 2100:
                continue

            # remove very small numbers
            if c < 1000:
                continue

            # remove unrealistic extreme numbers
            if c > 50000000:
                continue

            costs.append(c)

    if not costs:

        # fallback estimate
        return {
            "min_cost": 1000,
            "max_cost": 100000
        }

    costs = [c for c in costs if 1000 < c < 100000000]
    print("Costs extracted:", costs[:20])

    return {
        "min_cost": min(costs),
        "max_cost": max(costs)
    }