from rest_framework.views import APIView
from rest_framework.response import Response
from .models import *
from .serializer import *
from .utils import *
from rest_framework.permissions import IsAuthenticated,IsAdminUser
from django.contrib.auth.hashers import make_password, check_password
from rest_framework.permissions import IsAuthenticated
import jwt
from decouple import config
from django.core.paginator import Paginator
from django.db.models import Q
class ArticleView(APIView):
    def get(self,request,format=None,**kwargs):
        try:
            slug_title=kwargs.get('slug',None)
            if slug_title==None:
                articles=Article.objects.all().order_by('-created_at')
                serializer=ArticleSerializer(articles,many=True)
                return Response(serializer.data,status=200)
            else:
                isExists=Article.objects.filter(slug=slug_title).exists()
                if isExists:
                    articles=Article.objects.filter(slug=slug_title).order_by('-created_at')
                    serializer=ArticleSerializer(articles,many=True)
                    return Response(serializer.data,status=200)
                else:
                    return Response({'message':'Article with that title does not exists'},status=500)        
        except:
            return Response({'message':'Server Error'},status=500)
class OrderView(APIView):
    def get(self,request,format=None):
        try:
            user=None
            if 'Authorization' in request.headers:
                decodeJWT = jwt.decode(str(request.headers['Authorization'].split(' ')[1]), config('SECRET_KEY'), algorithms=["HS256"])
                emailJWT=decodeJWT['user_email']
                userProfile=CustomUser.objects.filter(email=emailJWT)
                if userProfile.exists():
                    user=userProfile[0]
            if user is None:
                orders=Order.objects.exclude(owner__isnull=False).order_by('id')
            else:
                orders=Order.objects.filter(Q(owner=user.id) | Q(owner__isnull=True)).order_by('id')
            qty = self.request.GET.get('qty', 5)
            current = self.request.GET.get('current', 1)
            p = Paginator(orders, qty)
            if int(current) > p.num_pages:
                current=p.num_pages
            elif int(current) < 0:
                current=1
            page=p.page(current)
            response_data={
                'per_page':qty,
                'total_page':p.num_pages,
                'current_page':current,
                'orders':OrderSerializer(page.object_list,many=True).data
            }
            return Response(response_data,status=200)
        except:
            return Response({'message':"Server error"},status=500)

    def post(self, request, format=None):
        try:
            user=None
            data=request.data
            if 'Authorization' in request.headers:
                decodeJWT = jwt.decode(str(request.headers['Authorization'].split(' ')[1]), config('SECRET_KEY'), algorithms=["HS256"])
                emailJWT=decodeJWT['user_email']
                userProfile=CustomUser.objects.filter(email=emailJWT)
            
                if userProfile.exists():
                    user=userProfile[0]
            if user is not None:
                data={**request.data,**{'owner':user.id}}
            serializer=OrderSerializer(data=data,partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data,status=200)
            else:
                return Response(serializer.errors,status=400)
        except:
            return Response({'message':"Server error"},status=500)
class UserLoginView(APIView):
    def post(self, request, format=None):
        try:        
            data=request.data
            serial=LoginSerializer(data=data)
            if serial.is_valid():
                existedUser=CustomUser.objects.filter(email=data['email'])
                if existedUser.exists():
                    existedUser=existedUser[0]
                    if check_password(data['password'], existedUser.password):
                        serializer = UserSerializerWithToken(existedUser,many=False)
                        return Response(serializer.data,status=200)
                    return Response({'message':"Invalid Credentials"},status=500)  
                return Response({'message':"Invalid Credentials"},status=500)          
            else:
                return Response(serial.errors,status=400)
        except:
            return Response({'message':"Server error"},status=500)
class UserRegisterView(APIView):
    def post(self, request, format=None):
        try:
            serializer=UserSerializerWithToken(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data,status=200)
            else:
                return Response(serializer.errors,status=400)
        except:
            return Response({'message':"Server error"},status=500)
class UserMyProfilesView(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request,format=None):
        decodeJWT = jwt.decode(str(request.headers['Authorization'].split(' ')[1]), config('SECRET_KEY'), algorithms=["HS256"]);
        emailJWT=decodeJWT['user_email']
        myProfile=CustomUser.objects.filter(email=emailJWT)
        if myProfile.exists():
            myProfile=myProfile[0]
            serializers=UserSerializerWithToken(myProfile,many=False)
            return Response(serializers.data,status=200)
        return Response({'message':'Server error'},status=500)
class UserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self,request,format=None):
        decodeJWT = jwt.decode(str(request.headers['Authorization'].split(' ')[1]), config('SECRET_KEY'), algorithms=["HS256"]);
        emailJWT=decodeJWT['user_email']
        search = self.request.GET.get('search', None)
        if search is None:
            return Response({'message':'Enter a first name'},status=400) 
        users=CustomUser.objects.filter(Q(first_name__istartswith=search))
        if not users.exists():
            return Response({'message':'No match'},status=400) 
        serializers=UserSearchSerializer(users,many=True)
        return Response(serializers.data,status=200)
    def put(self, request, format=None):
        try:
            decodeJWT = jwt.decode(str(request.headers['Authorization'].split(' ')[1]), config('SECRET_KEY'), algorithms=["HS256"]);
            emailJWT=decodeJWT['user_email']
            userProfile=CustomUser.objects.filter(email=emailJWT) 
            profileImage=request.data.get('image',None)
            if profileImage==None:
                serializer=UserSerializer(data=request.data,instance=userProfile[0])
                if serializer.is_valid():
                    serializer.save()
                    return Response(serializer.data,status=200)
                else:
                    return Response(serializer.errors,status=400)
            else:
                user=userProfile[0]
                user.image=request.FILES["image"]
                user.save()
                serializer=UserSerializerWithToken(user,many=False)
                return Response(serializer.data,status=201)
        except:
            return Response({'message':"Server error"},status=500)


