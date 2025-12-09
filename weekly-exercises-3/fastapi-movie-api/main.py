from fastapi import FastAPI, HTTPException, status
from typing import Optional
from fastapi import Response

app = FastAPI()

# ----- In-memory movie "database" -----
movies = [
    {"id": 1, "title": "Inception", "director": "Christopher Nolan", "year": 2010},
    {"id": 2, "title": "The Matrix", "director": "The Wachowskis", "year": 1999},
    {"id": 3, "title": "Parasite", "director": "Bong Joon-ho", "year": 2019},
]

def generate_next_id() -> int:
    """Return the next available movie id."""
    return max(movie["id"] for movie in movies) + 1 if movies else 1

# ----- Simple validation function -----
def validate_movie_data(data: dict) -> None:
    """
    Raises HTTPException(400) if data is invalid.
    """
    required_fields = ["title", "director", "year"]

    for field in required_fields:
        if field not in data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Missing field: {field}"
            )

    if not isinstance(data["title"], str) or data["title"].strip() == "":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Title must be a non-empty string"
        )

    if not isinstance(data["director"], str) or data["director"].strip() == "":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Director must be a non-empty string"
        )

    if not isinstance(data["year"], int):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Year must be an integer"
        )


# ----- CRUD routes -----
# GET /movies  (optionally filter)
@app.get("/movies")
def list_movies(
    title: Optional[str] = None,
    director: Optional[str] = None,
    year: Optional[int] = None,
):
    """
    Return all movies.
    Optional query filters: ?title= , ?director= , ?year=
    Status: 200 OK
    """
    result = movies

    if title is not None:
        result = [m for m in result if title.lower() in m["title"].lower()]
    if director is not None:
        result = [m for m in result if director.lower() in m["director"].lower()]
    if year is not None:
        result = [m for m in result if m["year"] == year]

    return result


# GET /movies/{id}
@app.get("/movies/{movie_id}")
def get_movie(movie_id: int):
    """
    Return single movie by id.
    Status: 200 OK or 404 Not Found
    """
    for movie in movies:
        if movie["id"] == movie_id:
            return movie

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Movie not found"
    )


# POST /movies
@app.post("/movies", status_code=status.HTTP_201_CREATED)
def create_movie(movie: dict):
    """
    Create a new movie.
    Status: 201 Created or 400 Bad Request
    """
    validate_movie_data(movie)

    new_movie = {
        "id": generate_next_id(),
        "title": movie["title"],
        "director": movie["director"],
        "year": movie["year"],
    }
    movies.append(new_movie)
    return new_movie


# PUT /movies/{id}
@app.put("/movies/{movie_id}")
def update_movie(movie_id: int, movie: dict):
    """
    Replace an existing movie with new data.
    Status: 200 OK, 400 Bad Request or 404 Not Found
    """
    validate_movie_data(movie)

    for index, existing in enumerate(movies):
        if existing["id"] == movie_id:
            updated_movie = {
                "id": movie_id,
                "title": movie["title"],
                "director": movie["director"],
                "year": movie["year"],
            }
            movies[index] = updated_movie
            return updated_movie

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Movie not found"
    )


# DELETE /movies/{id}
@app.delete("/movies/{movie_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_movie(movie_id: int):
    """
    Delete a movie.
    Status: 204 No Content or 404 Not Found
    """
    for index, movie in enumerate(movies):
        if movie["id"] == movie_id:
            del movies[index]
            # 204 means no response body
            return Response(status_code=status.HTTP_204_NO_CONTENT)

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Movie not found"
    )