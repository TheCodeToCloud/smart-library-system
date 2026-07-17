from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('circulation', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='issuebook',
            name='fine_status',
            field=models.CharField(
                choices=[('unpaid', 'Unpaid'), ('paid', 'Paid'), ('waived', 'Waived')],
                default='unpaid',
                max_length=10,
            ),
        ),
        migrations.AddField(
            model_name='issuebook',
            name='fine_paid_date',
            field=models.DateField(blank=True, null=True),
        ),
    ]
