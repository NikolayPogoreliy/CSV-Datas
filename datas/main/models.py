from django.db import models

# Create your models here.


class Data(models.Model):
    id = models.IntegerField(primary_key=True)
    entity = models.CharField(blank=False, max_length=1)
    value = models.FloatField(null=False)
    string = models.CharField(blank=False, max_length=100)

    class Meta:
        db_table = 'data'
