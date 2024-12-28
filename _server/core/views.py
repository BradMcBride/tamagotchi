from django.shortcuts import render
from django.conf  import settings
import json
import os
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.forms.models import model_to_dict
from .models import Pet

# Load manifest when server launches
MANIFEST = {}
if not settings.DEBUG:
    f = open(f"{settings.BASE_DIR}/core/static/manifest.json")
    MANIFEST = json.load(f)

# Create your views here.
@login_required
def index(req):
    context = {
        "asset_url": os.environ.get("ASSET_URL", ""),
        "debug": settings.DEBUG,
        "manifest": MANIFEST,
        "js_file": "" if settings.DEBUG else MANIFEST["src/main.ts"]["file"],
        "css_file": "" if settings.DEBUG else MANIFEST["src/main.ts"]["css"][0]
    }
    return render(req, "core/index.html", context)

@login_required
def me(req):
    return JsonResponse({"user": model_to_dict(req.user)})

@login_required
def pet(req):
    if req.method == "POST":
        body = json.loads(req.body)
        pet = Pet(
            name=body["petName"],
            user=req.user
        )
        pet.save()
        return JsonResponse({"pet": model_to_dict(pet)})
    

    pets = [model_to_dict(pet) for pet in req.user.pet_set.all()]
    return JsonResponse({"pets": pets})

@login_required
def pet_info(req, pet_id):
    pet = Pet.objects.get(id=pet_id)
    return JsonResponse(model_to_dict(pet))

@login_required
def feed_pet(req, pet_id):
    pet = Pet.objects.get(id=pet_id)
    if pet.is_dead == False:
        pet.hunger += 25
        if pet.hunger > 100:
            pet.hunger = 100
    pet.save()
    return JsonResponse(model_to_dict(pet))

@login_required
def increase_happy(req, pet_id):
    pet = Pet.objects.get(id=pet_id)
    if pet.is_dead == False:
        pet.happiness += 3
        if pet.happiness > 100:
            pet.happiness = 100
    pet.save()
    return JsonResponse(model_to_dict(pet))

@login_required
def toggle_light_on(req, pet_id):
    pet = Pet.objects.get(id=pet_id)
    pet.light_on = True
    pet.save()
    return JsonResponse(model_to_dict(pet))

@login_required
def toggle_light_off(req, pet_id):
    pet = Pet.objects.get(id=pet_id)
    pet.light_on = False
    pet.save()
    return JsonResponse(model_to_dict(pet))

@login_required
def delete_pet(req, pet_id):
    pet = Pet.objects.get(id=pet_id)
    pet.delete()



