from django.urls import path, include
from core import views
# from rest_framework_simplejwt.views import (
#     TokenObtainPairView,
#     TokenRefreshView,
# )

urlpatterns = [
    # path('token', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    # path('token/refresh', TokenRefreshView.as_view(), name='token_refresh'),
    # path('token/refresh/register', views.RegisterUser.as_view()),
    path('user/', views.UserRegisterView.as_view()),
    path('user/register', views.UserRegisterView.as_view()),
    path('user/login', views.UserLoginView.as_view()),
    path('user/profile', views.UserView.as_view()),
    path('user/my/profile', views.UserMyProfilesView.as_view()),
    path('order', views.OrderView.as_view()),
    path('articles', views.ArticleView.as_view()),
    path('articles/<slug:slug>', views.ArticleView.as_view()),

]
