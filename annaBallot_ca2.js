// show databases;
// use ca2;
// show tables;

db.movies.findOne();

//Part 1, Query 1
//This query shows the number of series greater than 2010, and less than or equal to 2013
db.movies.find({ type: "series", year: { $gt: 2010, $lte: 2013 } }).count();

//Part 1, Query 2
//This query gets all movies that are both comedy + Romance, where they have an imdb rating of 8 or more. It projects only title, plot and rating 
//to the results, sorts them by rating descending, and limits the results to 10
db.movies .find({ type: "movie", genres: { $all: ["Comedy", "Romance"] }, "imdb.rating": { $gte: 8 } }, { _id: 0, title: 1, plot: 1, "imdb.rating": 1}).sort( {"imdb.rating": -1}).limit(10).pretty();

//Part 1, Query 3
//This query
db.movies.find({ countries: { $in: ["Ireland", "Germany"] } }).count();



//use nin and in


db.movies.find({ type: { $in: ["series"] } }).pretty();

db.movies.find({ genres: "Comedy" });

// db.movies.find( {$or: [
//     {viewer.rating:}
// ]})

//count number of films per genre
db.movies.aggregate([ { $unwind: "$genres" }, { $group: { _id: "$genres", num_films: { $sum: 1 } } }, ]);


db.movies.aggregate([ { $unwind: "$type" }, { $group: { _id: "$type", num_films: { $sum: 1 } } }, ]);

db.movies.aggregate([ { $unwind: "$rated" }, { $group: { _id: "$rated", num_films: { $sum: 1 } } }, ]);

db.movies.aggregate([ { $unwind: "$countries" }, { $group: { _id: "$countries", num_films: { $sum: 1 } } }, ]);


