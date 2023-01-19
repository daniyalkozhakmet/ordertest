from .models import *
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import make_password, check_password
from datetime import date
class ArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Article  
        fields = ['title','slug','image','description'] 
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(max_length=200)

class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order  
        fields = ['id', 'title', 'description','status','owner'] 
        extra_kwargs = {
            'title': {'required': True, 'allow_blank': False},
            'description': {'required': True, 'allow_blank': False},
            'status': {'required': True,'validators': []},
            'owner': {'required': True,'validators': [],'write_only':True},
        }
    def create(self, validated_data):
        order=Order.objects.create(**validated_data)
        return order
    def validate(self, attrs):
        return super().validate(attrs)
class UserSerializerWithToken(serializers.ModelSerializer):
    access = serializers.SerializerMethodField(read_only=True)
    age = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = CustomUser
        fields = ['first_name', 'email','last_name', 'image','password','access','age','birth']
        extra_kwargs = {
            'email': {'required': True, 'allow_blank': False},
            'first_name': {'required': True},
            'last_name': {'required': True, 'allow_blank': False},
            'birth': {'required': True,'write_only': True},
            'password': {'write_only': True}
        }
    
    def validate_email(self, value):
        if CustomUser.objects.filter(email=value):
            raise serializers.ValidationError("This field must be unique.")
        return value
    def validate_password(self, value):
        if len(value)<5:
            raise serializers.ValidationError("Password must be longer than 5 character.")
        return value
    def validate_birth(self, value):
        today = date.today()
        y = today.year - value.year
        if today.month < value.month or today.month == value.month and today.day < value.day:
            y -= 1
        if y<18:
             raise serializers.ValidationError("User under 18 age can not use!")
        return value
    def get_age(self,obj):
        today = date.today()
        y = today.year - obj.birth.year
        if today.month < obj.birth.month or today.month == obj.birth.month and today.day < obj.birth.day:
            y -= 1
        return y
    def get_access(self, obj):
        refresh = RefreshToken.for_user(obj)
        return str(refresh.access_token)
    def create(self, validated_data):
        validated_data['password']=make_password(validated_data['password'])
        user=CustomUser.objects.create(**validated_data)
        return user

class UserSerializer(serializers.ModelSerializer):
    age = serializers.SerializerMethodField(read_only=True)
    access = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = CustomUser
        fields = [ 'first_name','last_name','email', 'image','age','access','password']
        extra_kwargs = {
            'email': {'required': True, 'allow_blank': False},
            'first_name': {'required': True},
            'last_name': {'required': True, 'allow_blank': False},
            # 'birth': {'required': True,'write_only': True},
            'password': {'required': True, 'allow_blank': False,'write_only': True},
            'age': {'read_only': True},
        }
    def update(self, instance,validated_data):
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.image = validated_data.get('image', instance.image)
        instance.password = make_password(validated_data.get('password'))
        instance.save()
        return instance
    def get_access(self, obj):
        refresh = RefreshToken.for_user(obj)
        return str(refresh.access_token)
    # def validate_email(self, value):
    #     if CustomUser.objects.filter(email=value):
    #         raise serializers.ValidationError("This field must be unique.")
    #     return value
    def validate_password(self, value):
        if len(value)<5:
            raise serializers.ValidationError("Password must be longer than 5 character.")
        return value
    def validate_birth(self, value):
        today = date.today()
        y = today.year - value.year
        if today.month < value.month or today.month == value.month and today.day < value.day:
            y -= 1
        if y<18:
             raise serializers.ValidationError("User under 18 age can not use!")
        return value
    def get_age(self,obj):
        today = date.today()
        y = today.year - obj.birth.year
        if today.month < obj.birth.month or today.month == obj.birth.month and today.day < obj.birth.day:
            y -= 1
        return y

class UserSerializerUpdateImage(serializers.ModelSerializer):
    access = serializers.SerializerMethodField(read_only=True)
    age = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = CustomUser  
        fields = ['first_name', 'last_name','age','email','birth'] 
        extra_kwargs = {
            'email': {'required': True, 'allow_blank': False},
            'first_name': {'required': True},
            'last_name': {'required': True, 'allow_blank': False},
            # 'birth': {'required': True,'write_only': True},
            'password': {'required': False, 'allow_blank': False,'write_only': True},
            'age': {'read_only': True},
        }
    def get_access(self, obj):
        refresh = RefreshToken.for_user(obj)
        return str(refresh.access_token)
    def get_age(self,obj):
        today = date.today()
        y = today.year - obj.birth.year
        if today.month < obj.birth.month or today.month == obj.birth.month and today.day < obj.birth.day:
            y -= 1
        return y
    def update(self, instance, validated_data):
        return instance
class UserSearchSerializer(serializers.ModelSerializer):
    age = serializers.SerializerMethodField(read_only=True)    
    class Meta:
        model = CustomUser  
        fields = ['first_name', 'age','birth','image'] 
        extra_kwargs = {
            'birth': {'required': True,'write_only': True},
            # 'title': {'required': True, 'allow_blank': False},
            # 'description': {'required': True, 'allow_blank': False},
            # 'status': {'required': True,'validators': []},
            # 'owner': {'required': True,'validators': [],'write_only':True},
        }
    def get_age(self,obj):
        today = date.today()
        y = today.year - obj.birth.year
        if today.month < obj.birth.month or today.month == obj.birth.month and today.day < obj.birth.day:
            y -= 1
        return y




