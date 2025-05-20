from rest_framework.test import APITestCase
from django.urls import reverse
from users.models import User
from tickets.models import Category

class TicketAPITest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="qwerty")
        self.category = Category.objects.create(name="Network")
        self.client.login(username="testuser", password="qwerty")

    def test_create_ticket(self):
        url = reverse("ticket-list")
        data = {
            "title": "No wi-fi",
            "description": "no internet",
            "category": self.category.id
        }
        self.client.force_authenticate(user=self.user)
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["status"], "open")