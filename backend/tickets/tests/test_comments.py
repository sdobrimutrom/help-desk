from rest_framework.test import APITestCase
from users.models import User
from tickets.models import Ticket, Category, Comment

class CommentTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="user", password="123")
        self.tech = User.objects.create_user(username="tech", password="123", role="technician")
        self.category = Category.objects.create(name="Network")
        self.ticket = Ticket.objects.create(title="wi-fi", description = "no internet", category = self.category, created_by = self.user, assigned_to = self.tech)
        
    def test_comment_by_creator(self):
        self.client.force_authenticate(user=self.user)
        res = self.client.post("/api/comments/", {
            "ticket": self.ticket.id,
            "content": "Check network"
        })
        self.assertEqual(res.status_code, 201)

    def test_comment_by_technician(self):
        self.client.force_authenticate(user=self.tech)
        res = self.client.post("/api/comments/", {
            "ticket": self.ticket.id,
            "content": "fixing"
        })
        self.assertEqual(res.status_code, 201)

    def test_comment_by_stranger(self):
        stranger = User.objects.create_user(username="stranger", password="123")
        self.client.force_authenticate(user=stranger)
        res = self.client.post("/api/comments/", {
            "ticket": self.ticket.id,
            "content": "I don't have an access"
        })
        self.assertEqual(res.status_code, 403)