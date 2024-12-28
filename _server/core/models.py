from django.db import models
from django.contrib.auth.models import User

class Pet(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.TextField()
    hunger = models.FloatField(default=100)
    happiness = models.FloatField(default=100)
    sleep = models.FloatField(default=100)
    light_on = models.BooleanField(default=True)
    is_dead = models.BooleanField(default=False)
    health = models.FloatField(default=100)
    cat_type = models.TextField(default="tuxedo")

    user = models.ForeignKey(User, on_delete=models.CASCADE)
