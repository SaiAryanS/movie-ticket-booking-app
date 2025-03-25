const mongoose = require('mongoose');
const Movie = require('./models/Movie');
const dotenv = require('dotenv');

dotenv.config();

const movies = [
  {
    title: "Se7en",
    description: "Two detectives track a brilliant and elusive killer who orchestrates a string of horrific murders.",
    imageUrl: "https://m.media-amazon.com/images/M/MV5BOTUwODM5MTctZjczMi00OTk4LTg3NWUtNmVhMTAzNTNjYjcyXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg",
    genre: "Crime, Drama, Mystery",
    duration: "2h 7min",
    releaseDate: "1995-09-22",
  },
  {
    title: "Ocean's Eleven",
    description: "Danny Ocean and his eleven accomplices plan to rob three Las Vegas casinos simultaneously.",
    imageUrl: "https://m.media-amazon.com/images/M/MV5BYzVmYzVkMmUtOGRhMi00MTNmLThlMmUtZTljYjlkMjNkMjJkXkEyXkFqcGdeQXVyNDk3NzU2MTQ@._V1_.jpg",
    genre: "Crime, Thriller",
    duration: "1h 56min",
    releaseDate: "2001-12-07",
  },
  {
    title: "Kill Bill: Vol. 1",
    description: "After awakening from a four-year coma, a former assassin seeks vengeance against the team of assassins who betrayed her.",
    imageUrl: "https://m.media-amazon.com/images/M/MV5BNzM3NDFhYTAtYmU5Mi00NGRmLTljYjgtMDkyODQ4MjNkMGY2XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg",
    genre: "Action, Crime, Drama",
    duration: "1h 51min",
    releaseDate: "2003-10-10",
  },
  {
    title: "Fight Club",
    description: "An insomniac office worker and a devil-may-care soapmaker form an underground fight club that evolves into something much more.",
    imageUrl: "https://m.media-amazon.com/images/M/MV5BNDIzNDU0YzEtYzE5Ni00ZjlkLTk5ZjgtNjM3NWE4YzA3Nzk3XkEyXkFqcGdeQXVyMjUzOTY1NTc@._V1_.jpg",
    genre: "Drama",
    duration: "2h 19min",
    releaseDate: "1999-10-15",
  },
  {
    title: "The Departed",
    description: "An undercover cop and a mole in the police attempt to identify each other while infiltrating an Irish gang in South Boston.",
    imageUrl: "https://m.media-amazon.com/images/M/MV5BMTI1MTY2OTIxNV5BMl5BanBnXkFtZTYwNjQ4NjY3._V1_.jpg",
    genre: "Crime, Drama, Thriller",
    duration: "2h 31min",
    releaseDate: "2006-10-06",
  },
  {
    title: "Interstellar",
    description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    imageUrl: "https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg",
    genre: "Adventure, Drama, Sci-Fi",
    duration: "2h 49min",
    releaseDate: "2014-11-07",
  },
  {
    title: "Hasee Toh Phasee",
    description: "A struggling businessman falls in love with his younger brother's girlfriend, a quirky and ambitious woman.",
    imageUrl: "https://m.media-amazon.com/images/M/MV5BMTUzNDU4NDMyOV5BMl5BanBnXkFtZTgwNzEzMzIzMDE@._V1_.jpg",
    genre: "Comedy, Romance",
    duration: "2h 21min",
    releaseDate: "2014-02-07",
  },
  {
    title: "Salaar",
    description: "A gang leader tries to keep a promise made to his dying friend and takes on the other criminal gangs.",
    imageUrl: "https://m.media-amazon.com/images/M/MV5BOWRhYWFkMDEtNTFjZC00OWJkLWJmMWQtNzI2OWRjZjVjODY0XkEyXkFqcGdeQXVyMTUzNTgzNzM0._V1_.jpg",
    genre: "Action, Drama, Thriller",
    duration: "2h 55min",
    releaseDate: "2023-12-22",
  },
  {
    title: "Pokiri",
    description: "An undercover cop becomes a gangster to expose the criminal underworld and root out corruption.",
    imageUrl: "https://m.media-amazon.com/images/M/MV5BNmE4YjM4NmYtNTRmMi00ZGI0LTk0ZTUtYzVhMDQ0NWYxZjVhXkEyXkFqcGdeQXVyODEzOTQwNTY@._V1_.jpg",
    genre: "Action, Crime, Drama",
    duration: "2h 42min",
    releaseDate: "2006-04-28",
  }
];

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    return Movie.deleteMany(); // Clear existing movies
  })
  .then(() => {
    return Movie.insertMany(movies);
  })
  .then(() => {
    console.log('Sample movies added successfully');
    process.exit();
  })
  .catch((error) => {
    console.error('Error seeding data:', error);
    process.exit(1);
  });
