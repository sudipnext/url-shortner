from django.contrib import admin
from .models import URL, Click, Tag
# Register your models here.

@admin.register(URL)
class URLAdmin(admin.ModelAdmin):
    list_display = ('original_url', 'short_url', 'user', 'clicks', 'qr_code')
    filter = ('user', 'tags')
    search_fields = ('original_url', 'short_url', 'user__username')

@admin.register(Click)
class ClickAdmin(admin.ModelAdmin):
    list_display = ('url', 'clicked_at', 'ip_address', 'user_agent', 'referrer', 'country', 'city')
    filter = ('url', 'url__user', 'url__tags')
    search_fields = ('url__original_url', 'url__short_url', 'ip_address', 'user_agent', 'referrer', 'country', 'city')
admin.site.register(Tag)
