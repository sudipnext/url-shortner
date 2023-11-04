from django.db import models
from django.contrib.auth.models import (
    BaseUserManager,
    AbstractBaseUser,
    PermissionsMixin
)
#Custom User Manager
class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **kwargs):
        #Creates and saves a User with the given email, name and password.
        if not email:
            raise ValueError("Users must have an email address")
        user=self.model(
            email=self.normalize_email(email),
            #automatically saves the other keyword arguments arguments
            **kwargs
        )
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, **kwargs):
        #create and save a superuser with the given email, name and password.
        user=self.create_user(
            email=email,
            **kwargs
        )
        user.is_superuser=True
        user.is_staff=True
        user.save(using=self._db)
        return user

# Custom User Model
class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(verbose_name='email', max_length=255, unique=True)
    name = models.CharField(max_length=255, blank=False)
    is_active = models.BooleanField(default=True)
    is_superuser = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    #mentioning the custom user manager
    objects = UserManager()

    #to make the default username field as email
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']

    def __str__(self):
        return self.email

    