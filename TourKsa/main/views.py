from django.shortcuts import render , redirect
from django.http import HttpRequest, HttpResponse
import google.generativeai as genai
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import os
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))


def home_view(request : HttpRequest):
    return render(request,"main/home.html")

def about_view(request):
    return render(request, "main/about.html")

def culture_view(request : HttpRequest):
    return render(request,"main/culture.html")

def transportation(request):
    return render(request, 'main/transportation.html')

def toggle_theme(request):
    current_theme = request.COOKIES.get('theme', 'light')
    new_theme = 'dark' if current_theme == 'light' else 'light'

    response = redirect(request.META.get('HTTP_REFERER', '/'))
    response.set_cookie('theme', new_theme, max_age=60*60*24*30)
    return response

def destinations_view(request: HttpRequest):
    return render(request, "main/destinations.html")

def city_detail_view(request: HttpRequest, city_name):
    return render(request, "main/city_detail.html", {"city": city_name})




genai.configure(api_key="AIzaSyBLJ9I3n77NpHmAPdMQMFAegWCwCFZbaR8")
@csrf_exempt
def travel_ai(request):
    if request.method == "POST":
        data = json.loads(request.body)

        category = data.get("category", "")
        city = data.get("city", "")
        subtype = data.get("subtype", "")
        family = data.get("family", "")

        prompt = f"""
You are a tourism AI assistant.

Give me the best 3 recommendations based on the filters below.  
Keep the answer short, clean, and well-formatted.  
For each place, give ONLY:
- Name  
- Area  
- One short reason (max 8 words)  

No long paragraphs. No introductions. No extra text.

Filters:
City: {city}
Category: {category}
Subtype: {subtype}


For each recommendation, include:
1. Place name
2. Area / district
3. One-sentence reason

Make the answer clean and easy to read.
"""

        model = genai.GenerativeModel("models/gemini-2.5-flash")
        response = model.generate_content(prompt)

        return JsonResponse({"reply": response.text})

    return JsonResponse({"reply": "POST only"})




def ai_view(request):
    return render(request, "main/ai.html")
