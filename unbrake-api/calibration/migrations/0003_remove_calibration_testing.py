# Generated by Django 2.2 on 2019-06-11 02:04

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('calibration', '0002_calibration_testing'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='calibration',
            name='testing',
        ),
    ]
