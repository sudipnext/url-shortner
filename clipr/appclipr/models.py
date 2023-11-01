from django.db import models
from django.contrib.auth.models import AbstractUser
from account.models import User

#url model
class URL(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    original_url = models.CharField(max_length=1000)
    short_url = models.CharField(max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)
    clicks = models.IntegerField(default=0)
    last_clicked = models.DateTimeField(auto_now=True)
    qr_code = models.ImageField(upload_to='qr_codes', blank=True)
    description = models.CharField(max_length=1000, blank=True)
    is_active = models.BooleanField(default=True)
    expiration_date = models.DateTimeField(blank=True, null=True)

#click for analytics model
class Click(models.Model):
    url = models.ForeignKey(URL, on_delete=models.CASCADE)
    clicked_at = models.DateTimeField(auto_now_add=True)
    ip_address = models.CharField(max_length=50, blank=True, null=True)
    user_agent = models.CharField(max_length=500, blank=True, null=True)
    referrer = models.CharField(max_length=1000, blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)

#tag model
class Tag(models.Model):
    name = models.CharField(max_length=50)
    urls = models.ManyToManyField(URL, blank=True)
