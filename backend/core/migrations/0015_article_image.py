# Generated by Django 4.1.5 on 2023-01-17 10:26

import core.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0014_alter_article_slug'),
    ]

    operations = [
        migrations.AddField(
            model_name='article',
            name='image',
            field=models.ImageField(blank=True, default='default.png', null=True, upload_to=core.models.upload_path_article),
        ),
    ]
