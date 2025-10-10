from django.contrib import admin
from .models import ClientInformation, ManualSelection, Address


@admin.register(ClientInformation)
class ClientInformationAdmin(admin.ModelAdmin):
    list_display = ['prenom', 'nom', 'email', 'phone', 'date_demenagement', 'has_stopover', 'created_at']
    list_filter = ['date_demenagement', 'has_stopover', 'created_at']
    search_fields = ['nom', 'prenom', 'email', 'phone', 'adresse_depart', 'adresse_arrivee']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Informations Personnelles', {
            'fields': ('prenom', 'nom', 'email', 'phone', 'date_demenagement')
        }),
        ('Adresse de Départ', {
            'fields': ('adresse_depart', 'etage_depart', 'ascenseur_depart', 'options_depart')
        }),
        ('Escale (Optionnelle)', {
            'fields': ('has_stopover', 'escale_adresse', 'escale_etage', 'escale_ascenseur', 'escale_options'),
            'classes': ('collapse',)
        }),
        ('Adresse d\'Arrivée', {
            'fields': ('adresse_arrivee', 'etage_arrivee', 'ascenseur_arrivee', 'options_arrivee')
        }),
        ('Métadonnées', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def get_queryset(self, request):
        return super().get_queryset(request).order_by('-created_at')


@admin.register(ManualSelection)
class ManualSelectionAdmin(admin.ModelAdmin):
    list_display = ['id', 'get_client_name', 'total_volume', 'total_objects_count', 'get_rooms_count', 'status', 'created_at']
    list_filter = ['status', 'created_at', 'updated_at']
    search_fields = ['client_info__nom', 'client_info__prenom', 'client_info__email']
    readonly_fields = ['total_volume', 'total_objects_count', 'created_at', 'updated_at']
    
    fieldsets = (
        ('Client Information', {
            'fields': ('client_info',)
        }),
        ('Sélections', {
            'fields': ('room_selections', 'heavy_objects', 'status')
        }),
        ('Calculs Automatiques', {
            'fields': ('total_volume', 'total_objects_count'),
            'classes': ('collapse',)
        }),
        ('Métadonnées', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def get_client_name(self, obj):
        return f"{obj.client_info.prenom} {obj.client_info.nom}"
    get_client_name.short_description = 'Client'
    get_client_name.admin_order_field = 'client_info__nom'
    
    def get_rooms_count(self, obj):
        return obj.get_total_rooms()
    get_rooms_count.short_description = 'Pièces'
    
    def save_model(self, request, obj, form, change):
        """Recalculate totals when saving from admin"""
        super().save_model(request, obj, form, change)
        obj.calculate_totals()
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('client_info').order_by('-created_at')


@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    list_display = ['id', 'get_client_name', 'adresse_depart', 'etage_depart', 'adresse_arrivee', 'etage_arrivee', 'has_stopover', 'created_at']
    list_filter = ['has_stopover', 'etage_depart', 'ascenseur_depart', 'etage_arrivee', 'ascenseur_arrivee', 'created_at']
    search_fields = ['client_info__nom', 'client_info__prenom', 'client_info__email', 'adresse_depart', 'adresse_arrivee', 'etage_depart', 'etage_arrivee']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Client', {
            'fields': ('client_info',)
        }),
        ('Adresse de Départ', {
            'fields': ('adresse_depart', 'etage_depart', 'ascenseur_depart', 'options_depart')
        }),
        ('Escale (Optionnelle)', {
            'fields': ('has_stopover', 'escale_adresse', 'escale_etage', 'escale_ascenseur', 'escale_options'),
            'classes': ('collapse',)
        }),
        ('Adresse d\'Arrivée', {
            'fields': ('adresse_arrivee', 'etage_arrivee', 'ascenseur_arrivee', 'options_arrivee')
        }),
        ('Métadonnées', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def get_client_name(self, obj):
        return f"{obj.client_info.prenom} {obj.client_info.nom}"
    get_client_name.short_description = 'Client'
    get_client_name.admin_order_field = 'client_info__nom'
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('client_info').order_by('-created_at')