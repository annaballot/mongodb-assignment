
//************************************************************************************************************************* */
//************************************************************************************************************************* */

//  I have left the formatting in this script, but on my laptop, each of these queries only runs if I put it all on the same line.



// You will need to run the following statement. This script gives me an error if I don't comment it out though.
// use ca2;


//************************************************************************************************************************* */
//************************************************************************************************************************* */

//Part 1, Query 1
//This query shows the number of series greater than 2010, and less than or equal to 2013
// Uses:    $gt, $lte, count
db.movies.find({ type: "series", year: { $gt: 2010, $lte: 2013 } }).count();

//Part 1, Query 2
//This query gets all movies that are both comedy + Romance, where they have an imdb rating of 8 or more. It projects only title, plot and rating
//to the results, sorts them by rating descending, and limits the results to 10
//Uses:     $all, $gte, sort, limit, projection
db.movies
  .find(
    {
      type: "movie",
      genres: { $all: ["Comedy", "Romance"] },
      "imdb.rating": { $gte: 8 },
    },
    { _id: 0, title: 1, plot: 1, "imdb.rating": 1 }
  )
  .sort({ "imdb.rating": -1 })
  .limit(10)
  .pretty();

//Part 1, Query 3
//This query shows all movies from Ireland or Germany which have an imdb rating of less than 5, and only shows title
//Uses:     $in, $lt, projection
db.movies.find(
  {
    type: "movie",
    countries: { $in: ["Ireland", "Germany"] },
    "imdb.rating": { $lt: 5 },
  },
  { _id: 0, title: 1 }
);

//Part 1, Query 4
//This query gets the 5th highest rated series, by sorting all series by rating, then skipping the first 4, then limiting to one (which is the 5th highest)
//Uses $gt Projection, skip, limit, sort
db.movies
  .find(
    { type: "series", "imdb.rating": { $gt: 0 } },
    { _id: 0, title: 1, plot: 1, "imdb.rating": 1 }
  )
  .sort({ "imdb.rating": -1 })
  .skip(4)
  .limit(1);

//Part 1, Query 5
//This query shows movies which have John Wayne in the case, and are not in the Genre of 'Western' or 'War'
//Uses:     $nin, projection
db.movies
  .find(
    { type: "movie", cast: "John Wayne", genres: { $nin: ["Western", "War"] } },
    { _id: 0, title: 1, genres: 1 }
  )
  .pretty();

//Part 1, Query 6
//This query finds the number of movies or series that Scott Brennan commented on since 2015
//Uses:     elemMatch, gte, count
db.movies
  .find({
    comments: {
      $elemMatch: {
        date: { $gte: ISODate("2015-01-01") },
        name: "Scott Brennan",
      },
    },
  })
  .count();

//************************************************************************************************************************* */
//************************************************************************************************************************* */

//Part 2, Query 1
// Create 2 Movies
//On my laptop this only runs when I put it on one line (using join lines)

db.movies.insertMany([
  {
    _id: 10000001,
    title: "Oppenheimer",
    year: 2023,
    runtime: 340,
    cast: ["Cillian Murphy", "Emily Blunt", "Matt Damon"],
    plot: "A dramatization of the life story of J. Robert Oppenheimer, the physicist who had a large hand in the development of the atomic bomb, thus helping end World War 2. We see his life from university days all the way to post-WW2, where his fame saw him embroiled in political machinations",
    genres: ["Biography", "Drama", "History"],
    imdb: { rating: 8.4, votes: 550000 },
  },
  {
    _id: 10000002,
    title: "Avatar: The Way of Water",
    year: 2022,
    runtime: 352,
    cast: ["Sam Worthington", "Zoe Saldana", "Sigourney Weaver"],
    plot: "Jake Sully lives with his newfound family formed on the extrasolar moon Pandora. Once a familiar threat returns to finish what was previously started, Jake must work with Neytiri and the army of the Na'vi race to protect their home.",
    genres: ["Action", "Adventure", "Fantasy", "Sci-Fi"],
    imdb: { rating: 7.6, votes: 472000 },
  },
]);

//Part 2, Query 2
// Create 3 Users

db.users.insertMany([
  {
    _id: 1,
    name: "Anna Ballot",
    email: "anna.ballot@email.com",
    password: "secret",
    dob: ISODate("1990-01-01"),
    favourites: [
      10000001,
      10000002,
      ObjectId("573a13c4f29313caabd6b7f4"),
      ObjectId("573a13b0f29313caabd34a3e"),
      ObjectId("573a13b0f29313caabd337c9"),
    ],
  },
  {
    _id: 2,
    name: "Frank O'Brien",
    email: "frank@email.com",
    password: "secret123",
    dob: ISODate("1985-06-01"),
    favourites: [
      ObjectId("573a1393f29313caabcdd0b8"),
      10000002,
      ObjectId("573a13c3f29313caabd6917f"),
      ObjectId("573a13b0f29313caabd3486a"),
      ObjectId("573a13aef29313caabd2cb25"),
    ],
  },
  {
    _id: 3,
    name: "Fiona Walsh",
    email: "fiona@email.com",
    password: "secretPass",
    dob: ISODate("1986-01-15"),
    favourites: [
      10000001,
      ObjectId("573a1393f29313caabcdca95"),
      ObjectId("573a1393f29313caabcdca92"),
      ObjectId("573a13c3f29313caabd6917f"),
      ObjectId("573a13b0f29313caabd337c9"),
    ],
  },
]);

//************************************************************************************************************************* */
//************************************************************************************************************************* */

//Part 3, Query 1
//Update first movie I added: update imdb rating and votes
db.movies.updateOne(
  { _id: 10000001 },
  { $set: { "imdb.rating": 9.9, "imdb.votes": 550001 } }
);

//Part 3, Query 2
//Update first user I added: add a movie to the array of favourites
db.users.updateOne(
  { _id: 1 },
  { $push: { favourites: ObjectId("573a1390f29313caabcd4135") } }
);

//Part 3, Query 3
//Update all users I added: remove movie from all array of favourites
db.users.updateMany({}, { $pull: { favourites: 10000001 } });

//Part 3, Query 4
//Update all movies I added: add 'Adventure' to Genres if not already there
//will find 2 but only update one, as it's in one already
db.movies.updateMany(
  { _id: { $in: [10000001, 10000002] } },
  { $addToSet: { genres: "Adventure" } }
);

//Part 3, Query 5
//Update all movies I added: add 'Adventure' to Genres if not already there
db.movies.deleteOne({ _id: 10000001 });

//************************************************************************************************************************* */
//************************************************************************************************************************* */

//Part 4, Query 1
//show all movies, split out by genre (movies will be counted more than once if they have mulitiple genres), and shows average imdb.rating per genre, and sorts by avd rating
db.movies
  .aggregate([
    { $match: { type: "movie" } },
    { $project: { _id: 0, title: 1, genres: 1, "imdb.rating": 1 } },
    { $unwind: "$genres" },
    {
      $group: {
        _id: "$genres",
        num_films: { $sum: 1 },
        avg_rating: { $avg: "$imdb.rating" },
      },
    },
  ])
  .sort({ avg_rating: -1 });

//Part 4, Query 2
//Shows all users, with their top 3 favourite movies, based on most recent year
db.users
  .aggregate([
    {
      $lookup: {
        from: "movies",
        localField: "favourites",
        foreignField: "_id",
        pipeline: [{ $sort: { year: -1 } }, { $limit: 3 }],
        as: "movie_details",
      },
    },
    {
      $project: {
        _id: 0,
        name: 1,
        "movie_details.title": 1,
        "movie_details.year": 1,
      },
    },
  ])
  .sort({ name: 1 });
