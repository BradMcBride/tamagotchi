# Generated by Django 5.0.3 on 2024-12-13 00:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0002_pet_is_dead_pet_light_on'),
    ]

    operations = [
        migrations.AddField(
            model_name='pet',
            name='health',
            field=models.IntegerField(default=100),
        ),
    ]
