interface Input {
    city: string;
}

export const getWeather = async (input: Input) => {
    const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
    const url = `https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${encodeURIComponent(input.city)}`;

    const res = await fetch(url);

    if (!res.ok) {
        const errorData = await res.json();
        return errorData;
    }

    const data = await res.json();
    return {
        city: data.location.name,
        region: data.location.region,
        country: data.location.country,
        temp_c: data.current.temp_c,
        temp_f: data.current.temp_f,
        condition: data.current.condition.text,
    };
};
