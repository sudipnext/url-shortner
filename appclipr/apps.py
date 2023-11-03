from django.apps import AppConfig


class AppcliprConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'appclipr'

    def ready(self):
        import appclipr.signals
