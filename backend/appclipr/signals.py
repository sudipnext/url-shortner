# signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import URL
import qrcode, os
from io import BytesIO
from django.core.files import File


@receiver(post_save, sender=URL)
def generate_qr_code(sender, instance, created, **kwargs):
    if (not instance.qr_code) or instance.is_original_url_changed():  
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4,
        )
        if os.environ.get('DOMAIN_BACK'):
            current_domain = os.environ.get('DOMAIN_BACK')
        else:
            current_domain = "http://localhost:8000/"

        # Construct the short URL for the QR code
        short_url = f"{current_domain}s/{instance.short_slug}"
        qr.add_data(short_url)
        qr.make(fit=True)

        qr_code_img = qr.make_image(fill_color="black", back_color="white")

        # Save the QR code image to the qr_codes directory
        buffer = BytesIO()
        qr_code_img.save(buffer, format="PNG")

        # Set the proper filename for the QR code image based on the instance ID
        filename = f'qr_code_{instance.short_slug}.png'

        instance.qr_code.save(filename, File(buffer), save=True)
