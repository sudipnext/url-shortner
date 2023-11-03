from django.contrib import admin
from .models import URL, Click, Tag
from account.models import User
# Register your models here.
class UserAdminInline(admin.StackedInline):
    model = User
    can_delete = False
    verbose_name_plural = 'users'

@admin.register(URL)
class URLAdmin(admin.ModelAdmin):
    list_display = ('original_url', 'short_slug', 'user', 'clicks', 'qr_code')
    list_filter = ('user',)
    search_fields = ('original_url', 'short_slug', 'user__username')

@admin.register(Click)
class ClickAdmin(admin.ModelAdmin):
    list_display = ('clicked_at', 'ip_address', 'user_agent', 'referrer', 'country', 'city')
    list_filter = ('clicked_at', 'country', 'city')
    search_fields = ('url__original_url', 'url__short_slug', 'ip_address', 'user_agent', 'referrer', 'country', 'city')
admin.site.register(Tag)
