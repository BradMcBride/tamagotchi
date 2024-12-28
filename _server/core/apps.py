import threading
import time
from django.apps import AppConfig

def background_task():
    while True:
        from .models import Pet

        try:
            # Only execute when apps are fully ready
            from django.apps import apps
            if not apps.ready:
                time.sleep(1)
                continue

            allPets = Pet.objects.all()
            for pet in allPets:
                if pet.hunger > 0:
                    pet.hunger -= .1
                
                if pet.happiness > 0:
                    pet.happiness -= .1

                if pet.sleep > 0 and pet.light_on == True:
                    pet.sleep -= .1
                if pet.sleep < 100 and pet.light_on == False and pet.is_dead == False:
                    pet.sleep += 1
                if pet.sleep > 100:
                    pet.sleep = 100


                if pet.hunger <= 0:
                    pet.health -= .1
                if pet.sleep <= 0:
                    pet.health -= .1
                if pet.happiness <= 0:
                    pet.health -= .1

                if pet.hunger > 0 and pet.sleep > 0 and pet.happiness > 0:
                    if pet.health < 100 and pet.is_dead == False:
                        pet.health += .1
                    if pet.health > 100:
                        pet.health = 100

                if pet.health <= 0:
                    pet.is_dead = True


                pet.save()




            print("Pet's Updated")
            time.sleep(60)  # Wait 1 minute
        except Exception as e:
            print(f"Error in background task: {e}")

class CoreConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'core'

    def ready(self):
        thread = threading.Thread(target=background_task, daemon=True)
        thread.start()

