from django.db import models, IntegrityError
from account.models import User
import qrcode
from io import BytesIO
from django.core.files import File
import string, random

#tag model
class Tag(models.Model):
    name = models.CharField(max_length=50)
    urls = models.ManyToManyField('URL', blank=True)

    def __str__(self):
        return f"{self.name}"


class URL(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='urls')
    original_url = models.CharField(max_length=1000)
    short_slug = models.CharField(max_length=20, blank=True, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    clicks = models.IntegerField(default=0)
    last_clicked = models.DateTimeField(auto_now=True)
    qr_code = models.ImageField(upload_to='qr_codes', blank=True)
    description = models.CharField(max_length=1000, blank=True)
    is_active = models.BooleanField(default=True)
    expiration_date = models.DateTimeField(blank=True, null=True)
    tags = models.ManyToManyField(Tag, blank=True)
    
    def save(self, *args, **kwargs):
        if not self.short_slug:
            self.short_slug = self.generate_unique_slug()
        super(URL, self).save(*args, **kwargs)

    def is_original_url_changed(self):
        if self.pk:
            original_url = URL.objects.get(pk=self.pk).original_url
            return original_url !=self.original_url
        return False


    def generate_unique_slug(self):
        while True:
            generated_slug = self.generate_random_slug()
            if not URL.objects.filter(short_slug=generated_slug).exists():
                return generated_slug

    def generate_random_slug(self):
        characters = string.ascii_letters + string.digits
        return ''.join(random.choice(characters) for _ in range(6))
    def __str__(self):
        return f"{self.short_slug}-{self.original_url}"

#click for analytics model
class Click(models.Model):
    url = models.ForeignKey(URL, on_delete=models.CASCADE)
    clicked_at = models.DateTimeField(auto_now_add=True)
    ip_address = models.CharField(max_length=50, blank=True, null=True)
    user_agent = models.CharField(max_length=500, blank=True, null=True)
    referrer = models.CharField(max_length=1000, blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return f"{self.url}"


