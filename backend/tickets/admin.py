from django.contrib import admin
from .models import Ticket, Comment, Category

admin.site.register(Ticket)
admin.site.register(Comment)
admin.site.register(Category)