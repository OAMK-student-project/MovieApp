

const getData = async () => {
    const url = 'https://api.themoviedb.org/3/movie/popular?language=en-US&page=1';
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjMzE0NjJlMWJhNjlhNTRlZTM1YzliOTAzNWJkMzg5NiIsIm5iZiI6MTc1NzE0NTgxOC4wNDksInN1YiI6IjY4YmJlYWRhYmNlN2IyYTI5ODliZmQ5YiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.0ZiVxCexBlKpNRTWR3MSbAf7s6OEyLGBlgrJB5N4o4M'
        }
        };
    try {
        const response = await fetch(url, options);
        if(!response.ok) throw new Error(response.status);

        const result = await response.json();
        console.log(result);

    } catch (error) {
        console.error(error);
    }
}

getData();
