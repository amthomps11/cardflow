# Generated by Django 4.2.6 on 2023-11-06 08:35

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('card', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='YugiohCard',
            fields=[
                ('card_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='card.card')),
                ('type', models.CharField(max_length=100)),
                ('frame_type', models.CharField(max_length=100)),
                ('description', models.CharField(blank=True, max_length=1000, null=True)),
                ('attack', models.CharField(blank=True, max_length=100, null=True)),
                ('defense', models.CharField(blank=True, max_length=100, null=True)),
                ('level', models.CharField(blank=True, max_length=100, null=True)),
                ('race', models.CharField(max_length=100)),
                ('attribute', models.CharField(blank=True, max_length=100, null=True)),
                ('archetype', models.CharField(blank=True, max_length=100, null=True)),
                ('image', models.URLField(blank=True, null=True)),
            ],
            bases=('card.card',),
        ),
        migrations.CreateModel(
            name='YugiohCardRarity',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('rarity', models.CharField(max_length=100, unique=True)),
                ('rarity_code', models.CharField(max_length=100, unique=True)),
            ],
            options={
                'verbose_name': 'Yugioh Card Rarity',
                'verbose_name_plural': 'Yugioh Card Rarities',
            },
        ),
        migrations.CreateModel(
            name='YugiohCardSet',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('card_set_name', models.CharField(max_length=100, unique=True)),
                ('set_code', models.CharField(max_length=100, unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='YugiohCardInSet',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('rarity', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='yugioh.yugiohcardrarity')),
                ('set', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='yugioh.yugiohcardset')),
                ('yugioh_card', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='yugioh.yugiohcard')),
            ],
        ),
    ]