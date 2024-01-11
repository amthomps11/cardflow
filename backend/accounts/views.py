from django.contrib.auth import get_user_model
from drf_spectacular.utils import extend_schema
from rest_framework import viewsets, generics, serializers, status
from rest_framework.decorators import action
from rest_framework.mixins import DestroyModelMixin
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView

from accounts.serializers import RegistrationSerializer, MyTokenObtainPairSerializer, UpdateUserSerializer, UploadAvatarSerializer

User = get_user_model()


@extend_schema(tags=['Accounts'])
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


@extend_schema(tags=['Accounts'])
class RegistrationView(viewsets.ModelViewSet):
    serializer_class = RegistrationSerializer
    http_method_names = ['post']

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        refresh = MyTokenObtainPairSerializer.get_token(user)
        access_token = refresh.access_token

        return Response({
            'refresh': str(refresh),
            'access': str(access_token),
        })


@extend_schema(tags=['Accounts'])
class UserUpdateView(DestroyModelMixin, generics.RetrieveAPIView, generics.UpdateAPIView):
    """
    View for get or update the user personal information and user delete \n
        - API endpoint: /api/accounts/update/<int:pk>/
    """

    queryset = User.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = UpdateUserSerializer

    def retrieve(self, request, *args, **kwargs):
        """
        View for update the user personal information and user delete \n
            - API endpoint for get user information. : /api/accounts/update/<int:pk>/
        """
        user = self.get_object()

        if user.pk != request.user.pk:
            raise serializers.ValidationError({'authorize': 'You dont have permission for this user.'})

        serializer = self.get_serializer(user)
        return Response(serializer.data)

    def delete(self, request, *args, **kwargs):
        """
        View for update the user personal information and user delete \n
            - API endpoint for user delete. : /api/accounts/update/<int:pk>/
        """
        user = self.get_object()

        if user.pk != request.user.pk:
            raise serializers.ValidationError({'authorize': 'You dont have permission for this user.'})

        return self.destroy(request, *args, **kwargs)

    # @action(methods=['POST'], detail=True, url_path='upload-image')
    # def upload_image(self, request, pk=None):
    #
    #     user = self.get_object()
    #
    #     if user.pk != request.user.pk:
    #         raise serializers.ValidationError({'authorize': 'You dont have permission for this user.'})
    #
    #     serializer = UploadAvatarSerializer(user, data=request.data)
    #
    #     if serializer.is_valid():
    #         serializer.save()
    #         return Response(serializer.data, status=status.HTTP_200_OK)
    #
    #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
