from django.contrib import admin
from account.models import User
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

class UserModelAdmin(BaseUserAdmin):
    list_display = ('id', 'email', 'username', 'is_active','is_superuser', 'is_staff')
    list_filter = ('is_superuser', 'is_staff')
    fieldsets = (
        ('User Credentials', {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('username',)}),
        ('Permissions', {'fields': ('is_superuser','is_staff', 'is_active', 'groups', 'user_permissions')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'password1', 'password2')
        }),
    )

    # Remove references to 'groups' and 'user_permissions' since they don't apply
    filter_horizontal = ()
    
    # Specify a valid field for ordering user records
    ordering = ('id',)

# Register your custom User model with the updated admin class
admin.site.register(User, UserModelAdmin)
