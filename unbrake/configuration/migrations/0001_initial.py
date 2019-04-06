# Generated by Django 2.2 on 2019-04-04 13:58

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Ciclos',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('NumeroCiclos', models.PositiveIntegerField()),
                ('TempoCiclos', models.PositiveIntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='Desligamento',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('InibeDesligamento', models.BooleanField()),
            ],
        ),
        migrations.CreateModel(
            name='Espera',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('TempoSuperior', models.IntegerField()),
                ('TempoInferior', models.IntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='SaidaAuxiliar',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('AtivarSaida', models.BooleanField()),
                ('Temperatura', models.DecimalField(blank=True, decimal_places=6, max_digits=10, null=True)),
                ('Tempo', models.DecimalField(blank=True, decimal_places=6, max_digits=10, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Velocidade',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('LimiteSuperior', models.IntegerField()),
                ('LimiteInferior', models.IntegerField()),
            ],
        ),
    ]