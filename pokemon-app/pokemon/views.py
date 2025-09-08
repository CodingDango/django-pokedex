from django.shortcuts import render
from django.http import HttpResponse
import requests 

# helper functions because im tired.
def get_gender_rates(gender_rate):
    if gender_rate == -1:
        return {}
    
    female_chance = (gender_rate / 8) * 100
    male_chance = 100 - female_chance
    
    if female_chance == 100:
        return {'female' : 100}
        
    elif male_chance == 100:
        return {'male' : 100}
    
    return {
        'female' : f"{female_chance:.1f}",
        'male' : f"{male_chance:.1f}"
    }

# Create your views here.
def home(request):
    return render(request, 'pokemon/index.html')

def viewPokemon(request, id):
    context = {'error' : False}
    
    try:
        url = f'https://pokeapi.co/api/v2/pokemon/{id}'
        response = requests.get(url, timeout=5)
        response.raise_for_status() 
        json_data = response.json() 
        context['details'] = json_data
        context['official_artwork_url'] = json_data.get('sprites', {}).get('other', {}).get('official-artwork', {}).get('front_default')
        context['weightKg'] = ( json_data['weight'] / 10 )
        context['heightFt'] = "{:.2f}".format(json_data['height'] / 3.048)
        context['types'] = [slot['type']['name'] for slot in json_data['types']]
        context['abilitiesStr'] = ', '.join([slot['ability']['name'].capitalize() for slot in json_data['abilities']])
        
    except requests.exceptions.HTTPError as err:
        # The "phone call" connected, but the API gave us an error page.
        # This is where we handle the "Pokémon doesn't exist" case.
        if err.response.status_code == 404:
            context['error'] = f"Couldn't find pokemon with ID #{id}."
        else:
            context['error'] = f"Error {err.response.status_code}"
    
    except requests.exceptions.RequestException as err:
        context['error'] = "Could not connect to the Pokémon API. Please try again later."
    
    if not context['error']:
        print('hm..')
        
        try:
            url = f'https://pokeapi.co/api/v2/pokemon-species/{id}'
            response = requests.get(url, timeout=5)
            response.raise_for_status() 
            json_data = response.json()
            
            context['gender_rates'] = get_gender_rates(json_data.get('gender_rate', -1))
            flavorEntries = [ entry for entry in json_data['flavor_text_entries'] if entry['language']['name'] == 'en']
            context['flavor_text'] = 'No description found.' if not flavorEntries else flavorEntries[-1]['flavor_text']
            categories = [ genus for genus in json_data['genera'] if genus['language']['name'] == 'en']
            
            if categories:
                context['category'] = categories[0]['genus']
            else:
                context['category'] = 'Not found'
            
        except Exception as idk:
            print(idk)
            pass    
    
    return render(request, 'pokemon/view.html', context=context)