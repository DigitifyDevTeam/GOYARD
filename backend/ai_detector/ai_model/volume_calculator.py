# Volume Calculator for Moving Objects
# Based on Père et Fils calculator data

from .object_volumes import OBJECT_VOLUMES

def calculate_total_volume(object_counts):
    """
    Calculate total volume based on detected objects and their counts
    
    Args:
        object_counts: Dictionary with object names as keys and counts as values
        Example: {"Chaise": 3, "Canapé 3 places (-80KG)": 2, "lit double": 1}
    
    Returns:
        Dictionary with volume calculation details
    """
    total_volume = 0.0
    volume_breakdown = {}
    calculation_details = []
    
    for object_name, count in object_counts.items():
        # Get volume per unit for this object
        volume_per_unit = OBJECT_VOLUMES.get(object_name, 0.0)
        
        if volume_per_unit > 0:
            # Calculate total volume for this object type
            object_total_volume = count * volume_per_unit
            total_volume += object_total_volume
            
            # Store breakdown
            volume_breakdown[object_name] = {
                'count': count,
                'volume_per_unit': volume_per_unit,
                'total_volume': object_total_volume
            }
            
            # Add to calculation details for display
            calculation_details.append(
                f"{count} × {object_name} = {count} × {volume_per_unit}m³ = {object_total_volume}m³"
            )
        else:
            # Object not in our volume mapping
            volume_breakdown[object_name] = {
                'count': count,
                'volume_per_unit': 0.0,
                'total_volume': 0.0,
                'note': 'Volume not defined for this object'
            }
            calculation_details.append(
                f"{count} × {object_name} = Volume not defined (0m³)"
            )
    
    return {
        'total_volume': round(total_volume, 2),
        'volume_breakdown': volume_breakdown,
        'calculation_details': calculation_details,
        'formula': f"Total = {' + '.join([f'{v['total_volume']}m³' for v in volume_breakdown.values() if v['total_volume'] > 0])} = {total_volume}m³"
    }

def get_volume_for_object(object_name):
    """
    Get volume for a specific object
    
    Args:
        object_name: Name of the object
    
    Returns:
        Volume in cubic meters (m³)
    """
    return OBJECT_VOLUMES.get(object_name, 0.0)

def list_all_volumes():
    """
    List all objects and their volumes
    
    Returns:
        Dictionary with all object volumes
    """
    return OBJECT_VOLUMES.copy()
