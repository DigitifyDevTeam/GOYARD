"""
Pricing matrix: Volume (m³) × Distance (km) → Price (EUR).
Based on the official price grid (volume per distance).
"""

# Distance ranges (km): (min_km, max_km] for band lookup. 0-50 means 0 < d <= 50, etc.
# Volume buckets (m³): 5, 10, 15, 20, 25, 30, 40, 45, 50, 60, 70, 80, 90, 100
# Price matrix: PRICE_MATRIX[distance_band][volume_m3] = price in EUR

DISTANCE_BANDS_KM = [
    (0, 50),      # 0-50 Km
    (50, 100),    # 50-100 Km
    (100, 200),   # 100-200 Km
    (200, 300),   # 200-300 Km
    (300, 400),   # 300-400 Km
    (400, 500),   # 400-500 Km
    (500, 600),   # 500-600 Km
    (600, 850),   # 600-850 Km
    (850, 1000),  # 850-1000 Km
]

VOLUME_BUCKETS_M3 = [5, 10, 15, 20, 25, 30, 40, 45, 50, 60, 70, 80, 90, 100]

# Price matrix: rows = distance bands (0-50, 50-100, ..., 850-1000), cols = volume (5, 10, ..., 100)
# Order matches DISTANCE_BANDS_KM and VOLUME_BUCKETS_M3
PRICE_MATRIX = [
    # 5   10   15   20   25   30   40   45   50   60   70   80   90  100 m³
    [300, 450, 600, 780, 950, 1100, 1500, 1600, 1900, 2300, 2600, 2900, 3400, 3900],   # 0-50 Km
    [500, 650, 800, 980, 1150, 1300, 1730, 1830, 2200, 2650, 2950, 3300, 3800, 4400],  # 50-100 Km
    [1000, 1150, 1300, 1480, 1650, 1800, 2530, 2630, 2780, 2980, 3190, 3790, 4200, 5000],  # 100-200 Km
    [1400, 1450, 1500, 1700, 2000, 2050, 2800, 2850, 3000, 3500, 4200, 4500, 4700, 5700],  # 200-300 Km
    [1650, 1680, 1720, 1850, 2150, 2200, 2950, 3000, 3200, 3700, 4400, 4700, 5000, 6000],  # 300-400 Km
    [1800, 1830, 1870, 2050, 2350, 2400, 3150, 3200, 3500, 4000, 4700, 5000, 5350, 6350],  # 400-500 Km
    [1850, 1880, 1920, 2100, 2400, 2450, 3200, 3250, 3550, 4050, 4750, 5050, 5400, 6400],  # 500-600 Km
    [1950, 1980, 2020, 2400, 2700, 2750, 3600, 3650, 3950, 4650, 5350, 5650, 6400, 7400],  # 600-850 Km
    [2200, 2250, 2300, 3500, 3600, 3700, 4500, 4600, 4700, 5700, 6000, 7000, 9000, 10000],  # 850-1000 Km
]


def get_distance_band_index(distance_km: float) -> int:
    """
    Return the index of the distance band for the given distance in km.
    Bands: 0-50, 50-100, 100-200, ..., 850-1000. distance_km <= 0 → 0; > 1000 → last band.
    """
    if distance_km <= 0:
        return 0
    for i, (_low, high) in enumerate(DISTANCE_BANDS_KM):
        if distance_km <= high:
            return i
    return len(DISTANCE_BANDS_KM) - 1  # cap at 850-1000 for 1000+ km


def get_volume_bucket_index(volume_m3: float) -> int:
    """
    Round volume up to the next bucket. Returns index into VOLUME_BUCKETS_M3.
    volume_m3 <= 0 → 0 (5 m³), > 100 → last bucket (100 m³).
    """
    if volume_m3 <= 0:
        return 0
    for i, bucket in enumerate(VOLUME_BUCKETS_M3):
        if volume_m3 <= bucket:
            return i
    return len(VOLUME_BUCKETS_M3) - 1  # cap at 100 m³


def get_price_from_matrix(volume_m3: float, distance_km: float) -> float:
    """
    Get price in EUR from the volume × distance matrix.
    Volume is rounded up to the next bucket; distance is mapped to its band.
    """
    band_idx = get_distance_band_index(distance_km)
    bucket_idx = get_volume_bucket_index(volume_m3)
    return float(PRICE_MATRIX[band_idx][bucket_idx])


def get_price_breakdown(volume_m3: float, distance_km: float) -> dict:
    """
    Return price and the used volume bucket and distance band for display.
    """
    band_idx = get_distance_band_index(distance_km)
    bucket_idx = get_volume_bucket_index(volume_m3)
    low, high = DISTANCE_BANDS_KM[band_idx]
    volume_bucket = VOLUME_BUCKETS_M3[bucket_idx]
    price = float(PRICE_MATRIX[band_idx][bucket_idx])
    return {
        'price_eur': price,
        'volume_m3_used': volume_bucket,
        'volume_m3_input': volume_m3,
        'distance_km_input': distance_km,
        'distance_band_km': f"{low}-{high}",
        'distance_band_index': band_idx,
        'volume_bucket_index': bucket_idx,
    }


# --- Étage à monter (floor to climb) ---
# 1er au 6ème: Demi journée 300€ (volume ≤35m³), Journée 450€ (volume >35m³)
# 6ème au 9ème: Demi journée 450€ (volume ≤35m³), Journée 550€ (volume >35m³)
# Au-delà de 9 étages: +100€ par étage supplémentaire
VOLUME_THRESHOLD_DEMI_JOURNEE_M3 = 35  # ≤35 = demi journée, >35 = journée

ETAGE_1_6_DEMI = 300
ETAGE_1_6_JOURNEE = 450
ETAGE_6_9_DEMI = 450
ETAGE_6_9_JOURNEE = 550
ETAGE_EXTRA_PER_FLOOR_OVER_9 = 100


def _etage_base_price(volume_m3: float, floor_range: str) -> float:
    """Base price for a floor range: '1-6' or '6-9'. Uses demi/journée by volume."""
    demi = volume_m3 <= VOLUME_THRESHOLD_DEMI_JOURNEE_M3
    if floor_range == '1-6':
        return float(ETAGE_1_6_DEMI if demi else ETAGE_1_6_JOURNEE)
    if floor_range == '6-9':
        return float(ETAGE_6_9_DEMI if demi else ETAGE_6_9_JOURNEE)
    return 0.0


def get_etage_price(volume_m3: float, etage_value: str) -> float:
    """
    Price in EUR for "étage à monter" at one location.
    etage_value: 'RDC' (0€), or '1'..'20' (number of floors to climb).
    """
    if not etage_value or etage_value.upper() == 'RDC':
        return 0.0
    try:
        floor = int(etage_value)
    except (TypeError, ValueError):
        return 0.0
    if floor <= 0:
        return 0.0
    if floor <= 5:
        return _etage_base_price(volume_m3, '1-6')
    if floor <= 9:
        return _etage_base_price(volume_m3, '6-9')
    # 10+ : base for 6-9 + 100€ per floor beyond 9
    base = _etage_base_price(volume_m3, '6-9')
    extra = (floor - 9) * ETAGE_EXTRA_PER_FLOOR_OVER_9
    return base + extra


# --- Ascenseur (elevator) extra ---
# 2-3 personnes: "Voir prix étage" → 0€ extra
# 3-4 personnes: volume-based extra (same buckets as VOLUME_BUCKETS_M3)
# 4-6 personnes: volume-based extra
# 6-8 personnes ou plus: 0€
# App choices: Non, 2-3 personnes → 0€ ; 3-4 personnes → 3-4 ; 4-6 personnes → 4-6 ; 6-8 personnes ou plus → 0€
ASCENSEUR_EXTRA_3_4 = [0, 0, 0, 70, 70, 70, 120, 120, 120, 180, 180, 180, 300, 400]  # by VOLUME_BUCKETS_M3
ASCENSEUR_EXTRA_4_6 = [0, 0, 0, 50, 50, 50, 80, 80, 80, 120, 120, 120, 180, 220]


def get_ascenseur_extra(volume_m3: float, ascenseur_value: str) -> float:
    """
    Additional price in EUR for elevator at one location.
    ascenseur_value: 'Non', '2-3 personnes' → 0€ (see floor price).
    '3-4 personnes' → 3-4 column; '4-6 personnes' → 4-6 column; '6-8 personnes ou plus' → 0€.
    """
    if not ascenseur_value:
        return 0.0
    a = ascenseur_value.strip().lower()
    if a == 'non' or '2-3 personnes' in ascenseur_value or '6-8 personnes ou plus' in ascenseur_value:
        return 0.0
    bucket_idx = get_volume_bucket_index(volume_m3)
    if '3-4 personnes' in ascenseur_value:
        return float(ASCENSEUR_EXTRA_3_4[bucket_idx])
    if '4-6 personnes' in ascenseur_value:
        return float(ASCENSEUR_EXTRA_4_6[bucket_idx])
    return 0.0


# --- Options devis: valeur des biens, démontage/remontage, emballage fragile ---
# Valeur des biens (assurance): 0€ jusqu'à 30 000€ assuré, au-delà 0,50% du montant total assuré
ASSURANCE_VALEUR_BIEN_THRESHOLD_EUR = 30_000
ASSURANCE_VALEUR_BIEN_RATE_OVER_THRESHOLD = 0.005  # 0.50%


def get_assurance_valeur_bien_price(valeur_bien_eur: float) -> float:
    """
    Price in EUR for "valeur des biens" (assurance option).
    0€ up to 30 000€ insured; beyond: 0.50% of total insured amount.
    """
    if valeur_bien_eur is None or valeur_bien_eur <= 0:
        return 0.0
    valeur_bien_eur = float(valeur_bien_eur)
    if valeur_bien_eur <= ASSURANCE_VALEUR_BIEN_THRESHOLD_EUR:
        return 0.0
    return round(valeur_bien_eur * ASSURANCE_VALEUR_BIEN_RATE_OVER_THRESHOLD, 2)


# Démontage/remontage: si oui → 8€/m³ jusqu'à 200 km, au-delà 16€/m³
DEMONTAGE_REMONTAGE_EUR_PER_M3_UP_TO_200KM = 8.0
DEMONTAGE_REMONTAGE_EUR_PER_M3_OVER_200KM = 16.0
DEMONTAGE_REMONTAGE_DISTANCE_KM_THRESHOLD = 200


def get_demontage_remontage_price(volume_m3: float, distance_km: float, option_active: bool) -> float:
    """
    Price in EUR for "démontage et remontage du mobilier" option.
    If yes: 8€/m³ up to 200 km, 16€/m³ beyond 200 km.
    """
    if not option_active or volume_m3 <= 0:
        return 0.0
    rate = DEMONTAGE_REMONTAGE_EUR_PER_M3_UP_TO_200KM if distance_km <= DEMONTAGE_REMONTAGE_DISTANCE_KM_THRESHOLD else DEMONTAGE_REMONTAGE_EUR_PER_M3_OVER_200KM
    return round(volume_m3 * rate, 2)


# Emballage fragile: si oui → 12,5€/m³
EMBALLAGE_FRAGILE_EUR_PER_M3 = 12.5


def get_emballage_fragile_price(volume_m3: float, option_active: bool) -> float:
    """
    Price in EUR for "emballage du fragile (vaisselles, tableaux, bibelots)" option.
    If yes: 12.5€/m³.
    """
    if not option_active or volume_m3 <= 0:
        return 0.0
    return round(volume_m3 * EMBALLAGE_FRAGILE_EUR_PER_M3, 2)


# --- Portage (distance de portage) ---
# Table: Distance (meters) × Volume (m³) → Price EUR
# Distance bands: 0-15m, 15-25m, 25-35m, 35-45m, 45-55m, 55-65m
# Volume buckets: same as VOLUME_BUCKETS_M3 (5, 10, ..., 100)
PORTAGE_DISTANCE_BANDS_M = [(0, 15), (15, 25), (25, 35), (35, 45), (45, 55), (55, 65)]

# Portage price matrix: rows = distance band (m), cols = volume bucket (m³)
PORTAGE_MATRIX = [
    # 5  10  15  20  25  30  40  45  50  60  70  80  90 100 m³
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],       # 0-15m
    [0, 60, 80, 100, 109, 109, 109, 109, 109, 109, 109, 109, 159, 189],   # 15-25m
    [40, 80, 100, 120, 159, 159, 159, 159, 159, 159, 159, 159, 229, 259],  # 25-35m
    [60, 100, 120, 140, 220, 220, 220, 220, 220, 220, 220, 220, 280, 320],  # 35-45m
    [80, 120, 140, 160, 389, 389, 389, 389, 389, 389, 389, 429, 500, 600],  # 45-55m
    [100, 140, 160, 180, 389, 389, 389, 389, 389, 389, 389, 429, 500, 600],  # 55-65m
]


def get_portage_distance_band_index(distance_m: float) -> int:
    """Return band index for portage distance in meters. >65m uses last band."""
    if distance_m <= 0:
        return 0
    for i, (_low, high) in enumerate(PORTAGE_DISTANCE_BANDS_M):
        if distance_m <= high:
            return i
    return len(PORTAGE_DISTANCE_BANDS_M) - 1


def get_portage_price(volume_m3: float, distance_m: float) -> float:
    """
    Price in EUR for "distance de portage".
    distance_m: distance in meters (e.g. 37). One price is applied using the band (0-15m, 15-25m, ...).
    """
    if volume_m3 <= 0 or distance_m is None or distance_m < 0:
        return 0.0
    distance_m = float(distance_m)
    band_idx = get_portage_distance_band_index(distance_m)
    bucket_idx = get_volume_bucket_index(volume_m3)
    return float(PORTAGE_MATRIX[band_idx][bucket_idx])
