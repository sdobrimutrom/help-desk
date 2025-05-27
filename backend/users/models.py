from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models

class CustomUserManager(BaseUserManager):
    def create_user(self, username, email=None, password=None, **extra_fields):
        if not username:
            raise ValueError("The Username must be set")
        email = self.normalize_email(email)
        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user
    
    def create_superuser(self, username, email=None, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("role", User.Role.ADMIN)

        return self.create_user(username, email, password, **extra_fields)

class User(AbstractUser):
    class Role(models.TextChoices):
        EMPLOYEE = 'employee', 'Сотрудник'
        TECHNICIAN = 'technician', 'Техник'
        ADMIN = 'admin', 'Администратор'

    objects = CustomUserManager()

    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.EMPLOYEE,
    )

    def is_employee(self):
        return self.role == self.Role.EMPLOYEE

    def is_technician(self):
        return self.role == self.Role.TECHNICIAN

    def is_admin(self):
        return self.role == self.Role.ADMIN

