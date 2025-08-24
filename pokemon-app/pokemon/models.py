from django.db import models

# Create your models here
# class Type(models.Model):
#     name = models.CharField(max_length=50, unique=True)

# class Pokemon(models.Model):
#     nat_dex_id = models.IntegerField(unique=True)
#     name = models.CharField(max_length=100)
#     types = models.ManyToManyField()
#     image_url = models.URLField()
    
#     def __str__(self):
#         return f"#{self.nat_dex_id}: {self.name}"