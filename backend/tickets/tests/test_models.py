from django.test import TestCase
from tickets.models import Ticket, Category
from users.models import User

class TicketModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="user", password="qwerty")
        self.category = Category.objects.create(name="Network")

    def test_create_ticket(self):
        ticket = Ticket.objects.create(
            title = "Wi-Fi issue",
            description = "No internet",
            category = self.category,
            created_by = self.user
        )
        self.assertEqual(ticket.title, "Wi-Fi issue")
        self.assertEqual(ticket.status, "open")
        self.assertEqual(ticket.created_by, self.user)