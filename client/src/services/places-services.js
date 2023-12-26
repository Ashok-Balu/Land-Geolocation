import axios from "axios";

class PlacesService {
    async getPlaces(searchQuery, params) {
        let getPlacesResponse = {
            error: null,
            data: null,
        };
        try {
            const response = await axios.get(
                `http://localhost:5000/api/search/${searchQuery}?${params}`
            );
            if (response.status == 200) {
                getPlacesResponse.data = response;
            }
            else {
                getPlacesResponse.error = "UNABLE_TO_GET_DATA";
            }
        }
        catch (error) {
            getPlacesResponse.error = "UNABLE_TO_GET_DATA";
        }
        return getPlacesResponse;
    }
}

export default new PlacesService();