# Generated by Django 4.1.5 on 2023-01-12 21:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0006_remove_customuser_username'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuser',
            name='birth',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='order',
            name='status',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]
