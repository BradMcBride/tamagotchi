from django.urls import path
from . import views

urlpatterns = [
    path('', view=views.index, name="index"),
    path('me/', view=views.me, name="current user"),
    path('pet/', view=views.pet, name="pet"),
    path('pet_info/<int:pet_id>', view=views.pet_info, name="pet info"),
    path('feed_pet/<int:pet_id>', view=views.feed_pet, name="feed pet"),
    path('increase_happy/<int:pet_id>', view=views.increase_happy, name="increase happy"),
    path('toggle_light_on/<int:pet_id>', view=views.toggle_light_on, name="toggle light on"),
    path('toggle_light_off/<int:pet_id>', view=views.toggle_light_off, name="toggle light off"),
    path('delete_pet/<int:pet_id>', view=views.delete_pet, name="delete pet")
]