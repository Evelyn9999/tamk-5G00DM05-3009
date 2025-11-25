from fastapi import FastAPI

app = FastAPI()

movies = [
    { "id": 1, "title": "Inception", "director": "Christopher Nolan", "year": 2010 },
    { "id": 2, "title": "The Matrix", "director": "The Wachowskis", "year": 1999 },
    { "id": 3, "title": "Parasite", "director": "Bong Joon-ho", "year": 2019 }
]

def generate_next_id():
    return max(movie["id"] for movie in movies) + 1 if movies else 1
