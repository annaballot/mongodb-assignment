// show databases;
// use ca2;
// show tables;

db.movies.findOne();

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
    favourites: [10000001, 10000002],
  },
  {
    _id: 2,
    name: "Frank O'Brien",
    email: "frank@email.com",
    password: "secret123",
    dob: ISODate("1985-06-01"),
    favourites: [ObjectId("573a1393f29313caabcdd0b8"), 10000002],
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
db.movies.updateMany( { _id: { $in: [10000001, 10000002] } }, { $addToSet: { genres: "Adventure" } } );

//Part 3, Query 5
//Update all movies I added: add 'Adventure' to Genres if not already there
db.movies.deleteOne({ _id: 10000001 });

//************************************************************************************************************************* */
//************************************************************************************************************************* */

//Part 4, Query 1
//

db.movies.aggregate([{ $match: {  type: "movie" } } , { $project: { _id: 0, title: 1, genres: 1, ratingPercent: { $multiply: [ "$imdb.rating", 10 ]}}}, { $unwind: "$genres" }, {$group: { _id: "$genres", num_films: { $sum: 1 } }}]).sort({ num_films: -1 });


db.movies.aggregate([{ $match: {  _id: { $in: [10000001, 10000002] } } } , { $project: { _id: 0, title: 1, genres: 1, ratingPercent: { $multiply: [ "$imdb.rating", 10 ]}}}, { $unwind: "$genres" }, {$group: { _id: "$genres", num_films: { $sum: 1 } }}]).sort({ num_films: -1 });











db.movies.aggregate([{ $match: {  _id: { $in: [10000001, 10000002] } } }, { $count: "test" } ]);


db.movies.aggregate([{ $match: {  _id: { $in: [10000001, 10000002] } } } , { $project: { _id: 0, title: 1, ratingPercent: { $multiply: [ "$imdb.rating", 10 ]}}}]);





db.movies.aggregate([{ $match: { type: "movie" } }, { $count: "test" }]);

db.movies
  .aggregate([
    { $unwind: "$cast" },
    { $group: { _id: "$cast", num_films: { $sum: 1 } } },
  ])
  .sort({ num_films: -1 });



db.movies.insertMany([ { _id: 10000001, title: "Oppenheimer", year: 2023, runtime: 340, cast: ["Cillian Murphy", "Emily Blunt", "Matt Damon"], plot: "A dramatization of the life story of J. Robert Oppenheimer, the physicist who had a large hand in the development of the atomic bomb, thus helping end World War 2. We see his life from university days all the way to post-WW2, where his fame saw him embroiled in political machinations", genres: ["Biography", "Drama", "History"], imdb: { rating: 8.4, votes: 550000 }, }, { _id: 10000002, title: "Avatar: The Way of Water", year: 2022, runtime: 352, cast: ["Sam Worthington", "Zoe Saldana", "Sigourney Weaver"], plot: "Jake Sully lives with his newfound family formed on the extrasolar moon Pandora. Once a familiar threat returns to finish what was previously started, Jake must work with Neytiri and the army of the Na'vi race to protect their home.", genres: ["Action", "Adventure", "Fantasy", "Sci-Fi"], imdb: { rating: 7.6, votes: 472000 }, }, ]);


db.movies.aggregate([
  { $unwind: "$countries" },
  { $group: { _id: "$countries", num_films: { $sum: 1 } } },
]);

db.movies.find({ _id: { $in: [10000001, 10000002] } });

db.movies.find({ _id: { $in: [10000001, 10000002] } });
db.users.find({ _id: { $in: [1, 2, 3] } });

db.users.find({ _id: { $in: [ObjectId("657ed525c464e8c379e03c51"), 2, 3] } });

db.users.deleteOne({
  _id: { $in: [ObjectId("657ed525c464e8c379e03c51"), 2, 3] },
});

db.users.find();

db.movies.find({ _id: { $in: [10000001, 10000002] } });
db.movies.deleteMany({ _id: { $in: [10000001, 10000002] } });

//Part 2, Query 2
// Create Movie 2

//Part 2, Query 3
// Create User 1

//Part 2, Query 4
// Create User 2

//Part 2, Query 5
// Create User 3

//************************************************************************************************************************* */
//************************************************************************************************************************* */

db.movies.findOne({ year: { $gt: 2015 } });

db.movies.find({ "comments.date": { $gte: ISODate("2010-01-01") } }).count();

db.movies.find({ type: { $in: ["series"] } }).pretty();

db.movies.find({ genres: "Comedy" });

// db.movies.find( {$or: [
//     {viewer.rating:}
// ]})

//count number of films per genre
db.movies.aggregate([
  { $unwind: "$genres" },
  { $group: { _id: "$genres", num_films: { $sum: 1 } } },
]);

db.movies.aggregate([
  { $unwind: "$type" },
  { $group: { _id: "$type", num_films: { $sum: 1 } } },
]);

db.movies.aggregate([
  { $unwind: "$rated" },
  { $group: { _id: "$rated", num_films: { $sum: 1 } } },
]);

db.movies.aggregate([
  { $unwind: "$countries" },
  { $group: { _id: "$countries", num_films: { $sum: 1 } } },
]);

db.movies.aggregate([
  { $unwind: "$runtime" },
  { $group: { _id: "$runtime", num_films: { $sum: 1 } } },
]);

db.movies.aggregate([
  { $unwind: "$comments.name" },
  { $group: { _id: "$comments.name", num_films: { $sum: 1 } } },
]);

db.movies.aggregate([
  { $group: { _id: "$comments.name", num_films: { $sum: 1 } } },
]);

db.movies.find({ type: "movie", year: { $gt: 2015 } });

db.movies
  .aggregate([
    { $unwind: "$cast" },
    { $group: { _id: "$cast", num_films: { $sum: 1 } } },
  ])
  .sort({ num_films: -1 });
