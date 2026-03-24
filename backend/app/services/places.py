import logging

import httpx
from app.config import settings

logger = logging.getLogger(__name__)


class PlacesService:
    def __init__(self):
        self.api_key = settings.google_maps_api_key
        self.base_url = "https://places.googleapis.com/v1/places:searchText"

    async def search_venue(self, query: str, location: str | None = None) -> list[dict]:
        """
        Search for a venue using Google Places API (New).
        Requires GOOGLE_MAPS_API_KEY.
        """
        if not self.api_key:
            logger.info("No GOOGLE_MAPS_API_KEY set, returning mock data")
            return [{"name": f"Mock {query}", "address": "123 Discovery Way", "rating": 4.5}]

        headers = {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": self.api_key,
            "X-Goog-FieldMask": "places.displayName,places.formattedAddress,places.rating,places.priceLevel,places.types,places.regularOpeningHours"
        }

        data = {
            "textQuery": f"{query} in {location}" if location else query
        }

        async with httpx.AsyncClient() as client:
            resp = await client.post(self.base_url, json=data, headers=headers)

            if resp.status_code != 200:
                logger.warning("Places API error %d: %s", resp.status_code, resp.text)
                return []

            results = resp.json().get("places", [])

            formatted = []
            for p in results:
                formatted.append({
                    "name": p.get("displayName", {}).get("text", "Unknown Venue"),
                    "address": p.get("formattedAddress", ""),
                    "rating": p.get("rating"),
                    "price_level": p.get("priceLevel"),
                    "types": p.get("types", []),
                    "opening_hours": p.get("regularOpeningHours", {}).get("weekdayDescriptions", [])
                })
            return formatted
