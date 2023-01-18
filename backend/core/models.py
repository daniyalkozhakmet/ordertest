from django.db import models
from django.contrib.auth.models import AbstractUser
from .manager import CustomUserManager
from django.template.defaultfilters import slugify
from datetime import datetime    
# Create your models here.
def upload_path(instance,filename):
    return '/'.join(['profile',str(instance.email)+filename])
def upload_path_article(instance,filename):
    return '/'.join(['article',str(instance.title)+filename])
class CustomUser(AbstractUser):
    email = models.EmailField(max_length=255, unique=True,blank=True,null=True)
    first_name=models.CharField(max_length=255,blank=True,null=True)
    last_name=models.CharField(max_length=255,blank=True,null=True)
    password=models.CharField(max_length=255,blank=True,null=True)
    image=models.ImageField(null=True,blank=True,default='default.png',upload_to=upload_path)
    birth = models.DateField(auto_now=False, auto_now_add=False, null=True, blank=True)
    username = None
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ('first_name','last_name','birth')
    objects = CustomUserManager()

    def __str__(self):
        return self.email
ORDER_STATUS = (
    ("SEND", "SEND"),
    ("REJECT", "REJECT"),
    ("LATER", "LATER"),
    ("SUCCESS", "SUCCESS"),
)
class Order(models.Model):
    title=models.CharField(max_length=255,blank=True,null=True)
    description=models.CharField(max_length=255,blank=True,null=True)
    owner = models.ForeignKey('CustomUser', on_delete=models.CASCADE,null=True,blank=True)
    status = models.CharField(
        max_length = 20,
        choices = ORDER_STATUS,
        default = 'SEND'
        )
    def __str__(self):
        return self.title 
class Article(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField(null=True,blank=True)
    created_at = models.DateTimeField(default=datetime.now, blank=True)
    slug=models.SlugField(max_length=200, unique=True,null=True,blank=True)
    image=models.ImageField(null=True,blank=True,default='default-article.png',upload_to=upload_path_article)
    def save(self, *args, **kwargs):  # new
        if not self.slug:
            self.slug = slugify(self.title)
        return super().save(*args, **kwargs)
    # def slug(self):
    #     return slugify(self.title)
    def __str__(self):
        return self.title 