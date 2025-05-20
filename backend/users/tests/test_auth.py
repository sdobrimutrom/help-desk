from rest_framework.test import APITestCase
from django.urls import reverse
from users.models import User

class AuthTest(APITestCase):
    def test_register_and_login(self):
        reg_url = reverse("register")
        data = {"username": "john", "password": "qwerty", "email": "john@example.com"}
        res = self.client.post(reg_url, data)
        self.assertEqual(res.status_code, 201)

        login_url = reverse("token_obtain_pair")
        res = self.client.post(login_url, {"username": "john", "password": "qwerty"})
        self.assertIn("access", res.data)