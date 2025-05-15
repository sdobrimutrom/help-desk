from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    class Role(models.TextChoices):
        EMPLOYEE = 'employee', 'Сотрудник'
        TECHNICIAN = 'technician', 'Техник'
        ADMIN = 'admin', 'Администратор'

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
