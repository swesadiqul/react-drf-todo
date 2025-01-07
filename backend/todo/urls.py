from django.urls import path
from  todo import views


# TODO: Implement the Todo app URLs here
urlpatterns = [
    path('todos/', views.TodoView.as_view(), name='todo-list'),
    path('todos/<int:pk>/', views.TodoDetailView.as_view(), name='todo-detail'),
]