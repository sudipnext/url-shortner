from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser
#Custom User Manager
class UserManager(BaseUserManager):
    def create_user(self, email, name, is_admin=False, password=None):
        #Creates and saves a User with the given email, name and password.
        if not email:
            raise ValueError("Users must have an email address")
        user=self.model(
            email=self.normalize_email(email),
            name=name,
            is_admin=is_admin
        )
        user.set_password(password)
        user.save(using=self._db)
        return user
    def create_superuser(self, email, name, is_admin=True, password=None):
        #create and save a superuser with the given email, name and password.
        user=self.create_user(
            email=email,
            name=name,
            # is_admin=is_admin,
            password=password
        )
        user.is_admin=True
        user.save(using=self._db)
        return user

# Custom User Model
class User(AbstractBaseUser):
    email = models.EmailField(verbose_name='email', max_length=255, unique=True)
    name = models.CharField(max_length=255, blank=False)
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    #mentioning the custom user manager
    objects = UserManager()

    #to make the default username field as email
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name', 'is_admin']

    def __str__(self):
        return self.email
    def get_full_name(self):
        return self.name
    def has_perm(self, perm, obj=None):
        return self.is_admin
    def has_module_perms(self, app_label):
        return True
    
    @property
    def is_staff(self):
        return self.is_admin

