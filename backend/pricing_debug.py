#!/usr/bin/env python3
"""
Pricing Calculator - Interactive Input
Input your values and get detailed price breakdown with formula explanations
"""

import sys
sys.path.insert(0, r'd:\OneDrive - DIGITIFY - NABIL REBHI\Workspace\brasenplus\backend')

from ai_detector.pricing import (
    get_price_from_matrix,
    get_volume_bucket_index,
    VOLUME_BUCKETS_M3,
    DISTANCE_BANDS_KM,
    PRICE_MATRIX,
    get_etage_price,
    get_ascenseur_extra,
    get_portage_price,
    get_assurance_valeur_bien_price,
    get_demontage_remontage_price,
    get_emballage_fragile_price,
    get_escale_price,
    PORTAGE_MATRIX,
    PORTAGE_DISTANCE_BANDS_M,
)


def get_float_input(prompt, default=0):
    """Get float input from user."""
    try:
        value = input(f"{prompt} [{default}]: ").strip()
        if not value:
            return float(default)
        return float(value)
    except ValueError:
        print(f"  Invalid number, using default: {default}")
        return float(default)


def get_string_input(prompt, default=""):
    """Get string input from user."""
    value = input(f"{prompt} [{default}]: ").strip()
    return value if value else default


def get_bool_input(prompt, default=False):
    """Get boolean input from user."""
    value = input(f"{prompt} (oui/non) [{'oui' if default else 'non'}]: ").strip().lower()
    if not value:
        return default
    return value in ['oui', 'o', 'yes', 'y']


def explain_volume_bucket(volume_m3: float) -> str:
    """Explain which volume bucket is used."""
    bucket_idx = get_volume_bucket_index(volume_m3)
    bucket_value = VOLUME_BUCKETS_M3[bucket_idx]
    
    if bucket_idx == 0:
        range_str = "0-5"
    else:
        prev_bucket = VOLUME_BUCKETS_M3[bucket_idx - 1]
        range_str = f"{prev_bucket}.1-{bucket_value}"
    
    return f"Volume {volume_m3}m³ → bucket {bucket_value} (range {range_str}m³), index {bucket_idx}"


def explain_distance_band(distance_km: float) -> str:
    """Explain which distance band is used."""
    if distance_km <= 0:
        return f"Distance {distance_km}km → band 0-50 km (index 0)"
    
    for i, (low, high) in enumerate(DISTANCE_BANDS_KM):
        if distance_km <= high:
            return f"Distance {distance_km}km → band {low}-{high} km (index {i})"
    
    low, high = DISTANCE_BANDS_KM[-1]
    return f"Distance {distance_km}km → band {low}-{high}+ km (index {len(DISTANCE_BANDS_KM)-1})"


def explain_portage_calculation(volume_m3: float, distance_m: float) -> str:
    """Explain the portage price calculation."""
    bucket_idx = get_volume_bucket_index(volume_m3)
    bucket_value = VOLUME_BUCKETS_M3[bucket_idx]
    
    MAX_TABLE_DISTANCE = 65
    EXTRA_CHARGE_PER_10M = 109
    
    if distance_m <= MAX_TABLE_DISTANCE:
        for i, (low, high) in enumerate(PORTAGE_DISTANCE_BANDS_M):
            if distance_m <= high:
                band_price = PORTAGE_MATRIX[i][bucket_idx]
                return f"Portage {distance_m}m (≤65m): band {low}-{high}m × volume bucket {bucket_value} → {band_price}€"
    else:
        base_price = PORTAGE_MATRIX[-1][bucket_idx]
        extra_meters = distance_m - MAX_TABLE_DISTANCE
        extra_intervals = int(extra_meters // 10) + (1 if extra_meters % 10 > 0 else 0)
        extra_charge = extra_intervals * EXTRA_CHARGE_PER_10M
        total = base_price + extra_charge
        
        return (
            f"Portage {distance_m}m (>65m):\n"
            f"  - Base price (55-65m band, vol {bucket_value}): {base_price}€\n"
            f"  - Extra: {extra_meters}m beyond 65m → {extra_intervals} × 10m intervals\n"
            f"  - Extra charge: {extra_intervals} × {EXTRA_CHARGE_PER_10M}€ = {extra_charge}€\n"
            f"  - Total: {base_price} + {extra_charge} = {total}€"
        )
    
    return "Portage: 0€"


def calculate_and_display(
    distance_km: float,
    volume_m3: float,
    etage_depart: str,
    etage_arrivee: str,
    ascenseur_depart: str,
    ascenseur_arrivee: str,
    portage_depart_m: float,
    portage_arrivee_m: float,
    valeur_bien: float,
    demontage_remontage: bool,
    emballage_fragile: bool,
    stopover_count: int,
):
    """Calculate and display detailed pricing breakdown."""
    
    print("\n" + "=" * 70)
    print("📊 PRICING CALCULATION BREAKDOWN")
    print("=" * 70)
    
    # 1. Base price
    print(f"\n📦 1. BASE PRICE (Volume × Distance)")
    print("-" * 50)
    print(explain_volume_bucket(volume_m3))
    print(explain_distance_band(distance_km))
    
    base_price = get_price_from_matrix(volume_m3, distance_km)
    vol_bucket_idx = get_volume_bucket_index(volume_m3)
    dist_band_idx = 0
    for i, (low, high) in enumerate(DISTANCE_BANDS_KM):
        if distance_km <= high:
            dist_band_idx = i
            break
    
    print(f"Formula: PRICE_MATRIX[{dist_band_idx}][{vol_bucket_idx}] = {base_price}€")
    print(f"✓ Base price: {base_price}€")
    
    # 2. Étage
    print(f"\n🏢 2. ÉTAGE (Floor Climbing)")
    print("-" * 50)
    
    etage_depart_price = get_etage_price(volume_m3, etage_depart)
    etage_arrivee_price = get_etage_price(volume_m3, etage_arrivee)
    etage_total = etage_depart_price + etage_arrivee_price
    
    print(f"Départ étage '{etage_depart}': {etage_depart_price}€")
    if etage_depart.upper() != "RDC" and etage_depart_price > 0:
        journee_type = "demi-journée" if volume_m3 <= 30 else "journée"
        print(f"  → Volume {volume_m3}m³ {'≤' if volume_m3 <= 30 else '>'} 30m³: {journee_type}")
        print(f"  → Formula: get_etage_price({volume_m3}, '{etage_depart}') = {etage_depart_price}€")
    
    print(f"Arrivée étage '{etage_arrivee}': {etage_arrivee_price}€")
    if etage_arrivee.upper() != "RDC" and etage_arrivee_price > 0:
        journee_type = "demi-journée" if volume_m3 <= 30 else "journée"
        print(f"  → Volume {volume_m3}m³ {'≤' if volume_m3 <= 30 else '>'} 30m³: {journee_type}")
        print(f"  → Formula: get_etage_price({volume_m3}, '{etage_arrivee}') = {etage_arrivee_price}€")
    
    print(f"✓ Étage total: {etage_depart_price} + {etage_arrivee_price} = {etage_total}€")
    
    # 3. Ascenseur
    print(f"\n🛗 3. ASCENSEUR (Elevator)")
    print("-" * 50)
    
    ascenseur_depart_price = get_ascenseur_extra(volume_m3, ascenseur_depart)
    ascenseur_arrivee_price = get_ascenseur_extra(volume_m3, ascenseur_arrivee)
    ascenseur_total = ascenseur_depart_price + ascenseur_arrivee_price
    
    print(f"Départ ascenseur '{ascenseur_depart}': {ascenseur_depart_price}€")
    if ascenseur_depart_price > 0:
        bucket_idx = get_volume_bucket_index(volume_m3)
        print(f"  → Volume bucket index: {bucket_idx}")
        print(f"  → Formula: get_ascenseur_extra({volume_m3}, '{ascenseur_depart}') = {ascenseur_depart_price}€")
    
    print(f"Arrivée ascenseur '{ascenseur_arrivee}': {ascenseur_arrivee_price}€")
    if ascenseur_arrivee_price > 0:
        bucket_idx = get_volume_bucket_index(volume_m3)
        print(f"  → Volume bucket index: {bucket_idx}")
        print(f"  → Formula: get_ascenseur_extra({volume_m3}, '{ascenseur_arrivee}') = {ascenseur_arrivee_price}€")
    
    print(f"✓ Ascenseur total: {ascenseur_depart_price} + {ascenseur_arrivee_price} = {ascenseur_total}€")
    
    # 4. Portage
    print(f"\n🚶 4. PORTAGE (Distance de Portage)")
    print("-" * 50)
    print(f"Input: départ={portage_depart_m}m, arrivée={portage_arrivee_m}m")
    
    portage_max = max(portage_depart_m, portage_arrivee_m)
    print(f"Formula: max({portage_depart_m}, {portage_arrivee_m}) = {portage_max}m")
    print(f"\n{explain_volume_bucket(volume_m3)}")
    print(explain_portage_calculation(volume_m3, portage_max))
    
    portage_total = get_portage_price(volume_m3, portage_max)
    print(f"\n✓ Portage total: {portage_total}€")
    
    # 5. Options
    print(f"\n⚙️  5. OPTIONS")
    print("-" * 50)
    
    assurance_price = get_assurance_valeur_bien_price(valeur_bien)
    print(f"Valeur des biens ({valeur_bien}€): {assurance_price}€")
    if valeur_bien > 30000:
        print(f"  → Formula: {valeur_bien} × 0.5% = {assurance_price}€")
    
    demontage_price = get_demontage_remontage_price(volume_m3, distance_km, demontage_remontage)
    rate = 8 if distance_km <= 200 else 16
    print(f"Démontage/remontage ({'oui' if demontage_remontage else 'non'}): {demontage_price}€")
    if demontage_remontage:
        print(f"  → Distance {distance_km}km → rate {rate}€/m³")
        print(f"  → Formula: {volume_m3}m³ × {rate}€/m³ = {demontage_price}€")
    
    emballage_price = get_emballage_fragile_price(volume_m3, emballage_fragile)
    print(f"Emballage fragile ({'oui' if emballage_fragile else 'non'}): {emballage_price}€")
    if emballage_fragile:
        print(f"  → Formula: {volume_m3}m³ × 12.5€/m³ = {emballage_price}€")
    
    options_total = assurance_price + demontage_price + emballage_price + portage_total
    print(f"\n✓ Options subtotal: {assurance_price} + {demontage_price} + {emballage_price} + {portage_total} = {options_total}€")
    
    # 6. Escale
    print(f"\n🛑 6. ESCALE (Stopovers)")
    print("-" * 50)
    escale_total = get_escale_price(stopover_count)
    print(f"Nombre d'escales: {stopover_count}")
    print(f"Formula: {stopover_count} × 150€ = {escale_total}€")
    print(f"✓ Escale total: {escale_total}€")
    
    # FINAL
    print(f"\n" + "=" * 70)
    print("💰 FINAL CALCULATION")
    print("=" * 70)
    
    subtotal_1 = base_price + etage_total + ascenseur_total
    subtotal_2 = options_total + escale_total
    final_price = subtotal_1 + subtotal_2
    
    print(f"Base + Étage + Ascenseur:")
    print(f"  {base_price} + {etage_total} + {ascenseur_total} = {subtotal_1}€")
    print(f"\nOptions + Escale:")
    print(f"  ({assurance_price} + {demontage_price} + {emballage_price} + {portage_total}) + {escale_total} = {subtotal_2}€")
    print(f"\n{'='*70}")
    print(f"💰 FINAL PRICE: {subtotal_1} + {subtotal_2} = {final_price}€")
    print("=" * 70)
    
    return {
        'base_price': base_price,
        'etage_total': etage_total,
        'ascenseur_total': ascenseur_total,
        'portage_total': portage_total,
        'options_total': options_total,
        'escale_total': escale_total,
        'final_price': final_price,
    }


def main():
    print("\n" + "🔧 " * 25)
    print("PRICING CALCULATOR - Interactive Input")
    print("🔧 " * 25)
    print("\nEnter your values (press Enter to use defaults):\n")
    
    # Get inputs
    distance_km = get_float_input("Distance (km)", 150)
    volume_m3 = get_float_input("Volume (m³)", 55)
    
    print("\n--- Départ ---")
    etage_depart = get_string_input("Étage départ (RDC, 1, 2, 3...)", "RDC")
    ascenseur_depart = get_string_input("Ascenseur départ (Non, 2-3 personnes, 3-4 personnes, 4-6 personnes, 6-8 personnes ou plus)", "Non")
    portage_depart_m = get_float_input("Distance portage départ (m)", 80)
    
    print("\n--- Arrivée ---")
    etage_arrivee = get_string_input("Étage arrivée (RDC, 1, 2, 3...)", "3")
    ascenseur_arrivee = get_string_input("Ascenseur arrivée (Non, 2-3 personnes, 3-4 personnes, 4-6 personnes, 6-8 personnes ou plus)", "Non")
    portage_arrivee_m = get_float_input("Distance portage arrivée (m)", 20)
    
    print("\n--- Options ---")
    valeur_bien = get_float_input("Valeur des biens (€)", 0)
    demontage_remontage = get_bool_input("Démontage/Remontage", False)
    emballage_fragile = get_bool_input("Emballage fragile", False)
    stopover_count = int(get_float_input("Nombre d'escales", 0))
    
    # Calculate
    print("\n" + "🔧 " * 25)
    print("CALCULATING...")
    print("🔧 " * 25)
    
    result = calculate_and_display(
        distance_km=distance_km,
        volume_m3=volume_m3,
        etage_depart=etage_depart,
        etage_arrivee=etage_arrivee,
        ascenseur_depart=ascenseur_depart,
        ascenseur_arrivee=ascenseur_arrivee,
        portage_depart_m=portage_depart_m,
        portage_arrivee_m=portage_arrivee_m,
        valeur_bien=valeur_bien,
        demontage_remontage=demontage_remontage,
        emballage_fragile=emballage_fragile,
        stopover_count=stopover_count,
    )
    
    print(f"\n✅ Calculation complete!")
    
    # Ask to run again
    again = input("\nCalculate another quote? (oui/non) [non]: ").strip().lower()
    if again in ['oui', 'o', 'yes', 'y']:
        main()


if __name__ == "__main__":
    main()


from ai_detector.pricing import (
    get_price_from_matrix,
    get_volume_bucket_index,
    VOLUME_BUCKETS_M3,
    DISTANCE_BANDS_KM,
    PRICE_MATRIX,
    get_etage_price,
    get_ascenseur_extra,
    get_portage_price,
    get_assurance_valeur_bien_price,
    get_demontage_remontage_price,
    get_emballage_fragile_price,
    PORTAGE_MATRIX,
    PORTAGE_DISTANCE_BANDS_M,
)


def explain_volume_bucket(volume_m3: float) -> str:
    """Explain which volume bucket is used."""
    bucket_idx = get_volume_bucket_index(volume_m3)
    bucket_value = VOLUME_BUCKETS_M3[bucket_idx]
    
    # Determine the range
    if bucket_idx == 0:
        range_str = "0-5"
    else:
        prev_bucket = VOLUME_BUCKETS_M3[bucket_idx - 1]
        range_str = f"{prev_bucket}.1-{bucket_value}"
    
    return f"Volume {volume_m3}m³ → bucket {bucket_value} (range {range_str}m³), index {bucket_idx}"


def explain_distance_band(distance_km: float) -> str:
    """Explain which distance band is used."""
    if distance_km <= 0:
        return f"Distance {distance_km}km → band 0-50 km (index 0)"
    
    for i, (low, high) in enumerate(DISTANCE_BANDS_KM):
        if distance_km <= high:
            return f"Distance {distance_km}km → band {low}-{high} km (index {i})"
    
    # Last band
    low, high = DISTANCE_BANDS_KM[-1]
    return f"Distance {distance_km}km → band {low}-{high}+ km (index {len(DISTANCE_BANDS_KM)-1})"


def explain_portage_calculation(volume_m3: float, distance_m: float) -> str:
    """Explain the portage price calculation."""
    bucket_idx = get_volume_bucket_index(volume_m3)
    bucket_value = VOLUME_BUCKETS_M3[bucket_idx]
    
    MAX_TABLE_DISTANCE = 65
    EXTRA_CHARGE_PER_10M = 109
    
    if distance_m <= MAX_TABLE_DISTANCE:
        # Find which band
        for i, (low, high) in enumerate(PORTAGE_DISTANCE_BANDS_M):
            if distance_m <= high:
                band_price = PORTAGE_MATRIX[i][bucket_idx]
                return f"Portage {distance_m}m (≤65m): band {low}-{high}m × volume bucket {bucket_value} → {band_price}€"
    else:
        base_price = PORTAGE_MATRIX[-1][bucket_idx]
        extra_meters = distance_m - MAX_TABLE_DISTANCE
        extra_intervals = int(extra_meters // 10) + (1 if extra_meters % 10 > 0 else 0)
        extra_charge = extra_intervals * EXTRA_CHARGE_PER_10M
        total = base_price + extra_charge
        
        return (
            f"Portage {distance_m}m (>65m):\n"
            f"  - Base price (55-65m band, vol {bucket_value}): {base_price}€\n"
            f"  - Extra: {extra_meters}m beyond 65m → {extra_intervals} × 10m intervals\n"
            f"  - Extra charge: {extra_intervals} × {EXTRA_CHARGE_PER_10M}€ = {extra_charge}€\n"
            f"  - Total: {base_price} + {extra_charge} = {total}€"
        )
    
    return "Portage: 0€"


def calculate_quote(
    distance_km: float,
    volume_m3: float,
    etage_depart: str,
    etage_arrivee: str,
    ascenseur_depart: str = "Non",
    ascenseur_arrivee: str = "Non",
    portage_depart_m: float = 0,
    portage_arrivee_m: float = 0,
    valeur_bien: float = 0,
    demontage_remontage: bool = False,
    emballage_fragile: bool = False,
    stopover_count: int = 0,
) -> dict:
    """
    Calculate complete quote with detailed explanations.
    """
    print("=" * 70)
    print("PRICING CALCULATION BREAKDOWN")
    print("=" * 70)
    
    # 1. Base price (volume × distance)
    print(f"\n📦 1. BASE PRICE (Volume × Distance)")
    print("-" * 50)
    print(explain_volume_bucket(volume_m3))
    print(explain_distance_band(distance_km))
    
    base_price = get_price_from_matrix(volume_m3, distance_km)
    vol_bucket_idx = get_volume_bucket_index(volume_m3)
    dist_band_idx = 0
    for i, (low, high) in enumerate(DISTANCE_BANDS_KM):
        if distance_km <= high:
            dist_band_idx = i
            break
    
    print(f"Matrix lookup: PRICE_MATRIX[{dist_band_idx}][{vol_bucket_idx}] = {base_price}€")
    print(f"✓ Base price: {base_price}€")
    
    # 2. Étage pricing
    print(f"\n🏢 2. ÉTAGE (Floor Climbing)")
    print("-" * 50)
    
    etage_depart_price = get_etage_price(volume_m3, etage_depart)
    etage_arrivee_price = get_etage_price(volume_m3, etage_arrivee)
    etage_total = etage_depart_price + etage_arrivee_price
    
    print(f"Départ étage '{etage_depart}': {etage_depart_price}€")
    if etage_depart.upper() != "RDC" and etage_depart_price > 0:
        vol_threshold = 30
        journee_type = "demi-journée" if volume_m3 <= vol_threshold else "journée"
        print(f"  → Volume {volume_m3}m³ ≤ {vol_threshold}m³: {journee_type}")
    
    print(f"Arrivée étage '{etage_arrivee}': {etage_arrivee_price}€")
    if etage_arrivee.upper() != "RDC" and etage_arrivee_price > 0:
        vol_threshold = 30
        journee_type = "demi-journée" if volume_m3 <= vol_threshold else "journée"
        print(f"  → Volume {volume_m3}m³ ≤ {vol_threshold}m³: {journee_type}")
    
    print(f"✓ Étage total: {etage_depart_price} + {etage_arrivee_price} = {etage_total}€")
    
    # 3. Ascenseur pricing
    print(f"\n🛗 3. ASCENSEUR (Elevator)")
    print("-" * 50)
    
    ascenseur_depart_price = get_ascenseur_extra(volume_m3, ascenseur_depart)
    ascenseur_arrivee_price = get_ascenseur_extra(volume_m3, ascenseur_arrivee)
    ascenseur_total = ascenseur_depart_price + ascenseur_arrivee_price
    
    print(f"Départ ascenseur '{ascenseur_depart}': {ascenseur_depart_price}€")
    if ascenseur_depart_price > 0:
        bucket_idx = get_volume_bucket_index(volume_m3)
        print(f"  → Volume bucket index: {bucket_idx}")
    
    print(f"Arrivée ascenseur '{ascenseur_arrivee}': {ascenseur_arrivee_price}€")
    if ascenseur_arrivee_price > 0:
        bucket_idx = get_volume_bucket_index(volume_m3)
        print(f"  → Volume bucket index: {bucket_idx}")
    
    print(f"✓ Ascenseur total: {ascenseur_depart_price} + {ascenseur_arrivee_price} = {ascenseur_total}€")
    
    # 4. Portage pricing
    print(f"\n🚶 4. PORTAGE (Distance de Portage)")
    print("-" * 50)
    print(f"Input: départ={portage_depart_m}m, arrivée={portage_arrivee_m}m")
    
    portage_max = max(portage_depart_m, portage_arrivee_m)
    print(f"Max distance: max({portage_depart_m}, {portage_arrivee_m}) = {portage_max}m")
    
    print(f"\n{explain_volume_bucket(volume_m3)}")
    print(explain_portage_calculation(volume_m3, portage_max))
    
    portage_total = get_portage_price(volume_m3, portage_max)
    print(f"✓ Portage total: {portage_total}€")
    
    # 5. Options
    print(f"\n⚙️  5. OPTIONS")
    print("-" * 50)
    
    assurance_price = get_assurance_valeur_bien_price(valeur_bien)
    print(f"Valeur des biens ({valeur_bien}€): {assurance_price}€")
    if valeur_bien > 30000:
        print(f"  → {valeur_bien} × 0.5% = {assurance_price}€")
    
    demontage_price = get_demontage_remontage_price(volume_m3, distance_km, demontage_remontage)
    rate = 8 if distance_km <= 200 else 16
    print(f"Démontage/remontage ({'oui' if demontage_remontage else 'non'}): {demontage_price}€")
    if demontage_remontage:
        print(f"  → {volume_m3}m³ × {rate}€/m³ = {demontage_price}€")
    
    emballage_price = get_emballage_fragile_price(volume_m3, emballage_fragile)
    print(f"Emballage fragile ({'oui' if emballage_fragile else 'non'}): {emballage_price}€")
    if emballage_fragile:
        print(f"  → {volume_m3}m³ × 12.5€/m³ = {emballage_price}€")
    
    options_total = assurance_price + demontage_price + emballage_price + portage_total
    print(f"\n✓ Options subtotal: {assurance_price} + {demontage_price} + {emballage_price} + {portage_total} = {options_total}€")
    
    # 6. Escale (stopover)
    print(f"\n🛑 6. ESCALE (Stopovers)")
    print("-" * 50)
    from ai_detector.pricing import get_escale_price
    escale_total = get_escale_price(stopover_count)
    print(f"Nombre d'escales: {stopover_count}")
    print(f"✓ Escale total: {stopover_count} × 150€ = {escale_total}€")
    
    # FINAL TOTAL
    print(f"\n" + "=" * 70)
    print("📊 FINAL TOTAL")
    print("=" * 70)
    
    subtotal_1 = base_price + etage_total + ascenseur_total
    subtotal_2 = options_total + escale_total
    final_price = subtotal_1 + subtotal_2
    
    print(f"Base + Étage + Ascenseur: {base_price} + {etage_total} + {ascenseur_total} = {subtotal_1}€")
    print(f"Options + Escale: {options_total} + {escale_total} = {subtotal_2}€")
    print(f"\n💰 FINAL PRICE: {subtotal_1} + {subtotal_2} = {final_price}€")
    print("=" * 70)
    
    return {
        'base_price': base_price,
        'etage_total': etage_total,
        'ascenseur_total': ascenseur_total,
        'portage_total': portage_total,
        'options_total': options_total,
        'escale_total': escale_total,
        'final_price': final_price,
    }


if __name__ == "__main__":
    print("\n" + "🔧 " * 20)
    print("Pricing Debug Calculator")
    print("🔧 " * 20 + "\n")
    
    # Example 1: Your test case
    print("\n" + "🧪 " * 25)
    print("TEST CASE 1: Volume 55m³, Portage 80m")
    print("🧪 " * 25)
    
    result1 = calculate_quote(
        distance_km=150,           # 150 km
        volume_m3=55,              # 55 m³ (bucket 60)
        etage_depart="RDC",        # Ground floor
        etage_arrivee="3",         # 3rd floor
        ascenseur_depart="Non",
        ascenseur_arrivee="Non",
        portage_depart_m=80,       # 80m at departure
        portage_arrivee_m=20,      # 20m at arrival
    )
    
    # Example 2: Short portage
    print("\n\n" + "🧪 " * 25)
    print("TEST CASE 2: Volume 30m³, Portage 35m")
    print("🧪 " * 25)
    
    result2 = calculate_quote(
        distance_km=80,
        volume_m3=30,              # 30 m³ (bucket 30)
        etage_depart="2",
        etage_arrivee="RDC",
        ascenseur_depart="3-4 personnes",
        ascenseur_arrivee="Non",
        portage_depart_m=35,       # 35m
        portage_arrivee_m=10,      # 10m
    )
    
    # Example 3: Long portage beyond 65m
    print("\n\n" + "🧪 " * 25)
    print("TEST CASE 3: Volume 70m³, Portage 95m (>65m)")
    print("🧪 " * 25)
    
    result3 = calculate_quote(
        distance_km=300,
        volume_m3=70,              # 70 m³ (bucket 70)
        etage_depart="5",
        etage_arrivee="7",
        ascenseur_depart="Non",
        ascenseur_arrivee="4-6 personnes",
        portage_depart_m=95,       # 95m (30m beyond 65m → 3 intervals)
        portage_arrivee_m=40,      # 40m
        valeur_bien=50000,
        demontage_remontage=True,
    )
    
    print("\n\n" + "✅ " * 25)
    print("All test cases completed!")
    print("✅ " * 25)
