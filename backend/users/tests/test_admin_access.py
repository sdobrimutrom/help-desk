from rest_framework.test import APITestCase
from users.models import User

class AdminAccessTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="user", password="123")
        self.admin = User.objects.create_user(username="admin", password="123", role="admin")

    def test_admin_access_forbidden_for_regular_user(self):
        self.client.force_authenticate(user=self.user)
        res = self.client.get("/api/users/")
        self.assertEqual(res.status_code, 403)

    def test_admin_access_allowed_for_admin(self):
        self.client.force_authenticate(user=self.admin)
        res = self.client.get("/api/users/")
        self.assertEqual(res.status_code, 200)